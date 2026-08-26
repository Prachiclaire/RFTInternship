const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('crypto');
const cors = require('cors');
require('dotenv').config();

const Wallet = require('./models/Wallet');
const Transaction = require('./models/Transaction');
const Beneficiary = require('./models/Beneficiary');
const { authenticate } = require('./middleware/auth');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// --- 1. WALLET CREATION ---

app.post('/api/wallet/create', authenticate, async (req, res) => {
  try {
    const { pin } = req.body;
    if (!pin || pin.length < 4) {
      return res.status(400).json({ message: 'A 4-digit PIN is required' });
    }

    const existing = await Wallet.findOne({ userId: req.user.id });
    if (existing) return res.status(400).json({ message: 'Wallet already exists' });

    const hashedPin = await bcrypt.hash(pin, 10);
    const wallet = await Wallet.create({
      userId: req.user.id,
      transactionPin: hashedPin
    });

    res.status(201).json({ message: 'Wallet created successfully', walletId: wallet._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 2. GET WALLET BALANCE ---

app.get('/api/wallet/balance', authenticate, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id }).select('-transactionPin');
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 3. ADD MONEY (DEPOSIT) ---

app.post('/api/wallet/add-money', authenticate, async (req, res) => {
  try {
    const { amount } = req.body;
    if (amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const wallet = await Wallet.findOneAndUpdate(
      { userId: req.user.id },
      { $inc: { balance: amount } },
      { new: true }
    );

    await Transaction.create({
      receiverId: wallet._id,
      amount,
      type: 'DEPOSIT',
      reference: `DEP-${Date.now()}`
    });

    res.json({ message: 'Money added successfully', balance: wallet.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 4. SEND MONEY (WITH PIN & DAILY LIMIT VERIFICATION) ---

app.post('/api/wallet/send-money', authenticate, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { receiverUserId, amount, pin } = req.body;
    const dailyLimit = parseFloat(process.env.DAILY_TRANSACTION_LIMIT || 5000);

    if (amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    // Fetch Sender Wallet
    const senderWallet = await Wallet.findOne({ userId: req.user.id }).session(session);
    if (!senderWallet) return res.status(404).json({ message: 'Sender wallet not found' });

    // Verify PIN
    const isPinValid = await bcrypt.compare(pin, senderWallet.transactionPin);
    if (!isPinValid) {
      await session.abortTransaction();
      return res.status(401).json({ message: 'Invalid Transaction PIN' });
    }

    // Check Balance
    if (senderWallet.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Check Daily Limit Usage
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayTransactions = await Transaction.aggregate([
      {
        $match: {
          senderId: senderWallet._id,
          type: 'TRANSFER',
          createdAt: { $gte: startOfDay }
        }
      },
      { $group: { _id: null, totalSpent: { $sum: "$amount" } } }
    ]);

    const spentToday = todayTransactions[0]?.totalSpent || 0;
    if (spentToday + amount > dailyLimit) {
      await session.abortTransaction();
      return res.status(400).json({ 
        message: `Daily transaction limit of $${dailyLimit} exceeded. Remaining: $${dailyLimit - spentToday}` 
      });
    }

    // Fetch Receiver Wallet
    const receiverWallet = await Wallet.findOne({ userId: receiverUserId }).session(session);
    if (!receiverWallet) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Receiver wallet not found' });
    }

    // Perform Atomic Ledger Transfer
    senderWallet.balance -= amount;
    receiverWallet.balance += amount;

    await senderWallet.save({ session });
    await receiverWallet.save({ session });

    const transaction = await Transaction.create([{
      senderId: senderWallet._id,
      receiverId: receiverWallet._id,
      amount,
      type: 'TRANSFER',
      reference: `TRX-${Date.now()}`
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: 'Transfer successful', transaction: transaction[0] });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: err.message });
  }
});

// --- 5. BENEFICIARY MANAGEMENT ---

app.post('/api/wallet/beneficiary', authenticate, async (req, res) => {
  try {
    const { beneficiaryUserId, nickname } = req.body;
    const beneficiary = await Beneficiary.create({
      userId: req.user.id,
      beneficiaryUserId,
      nickname
    });
    res.status(201).json(beneficiary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/wallet/beneficiary', authenticate, async (req, res) => {
  try {
    const list = await Beneficiary.find({ userId: req.user.id });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 6. TRANSACTION HISTORY & ANALYTICS ---

// Get Transaction History (Paginated)
app.get('/api/wallet/transactions', authenticate, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const query = {
      $or: [{ senderId: wallet._id }, { receiverId: wallet._id }]
    };

    const history = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Transaction.countDocuments(query);

    res.json({ page, limit, totalPages: Math.ceil(total / limit), total, data: history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Transaction Analytics Endpoint
app.get('/api/wallet/analytics', authenticate, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    const stats = await Transaction.aggregate([
      {
        $match: {
          $or: [{ senderId: wallet._id }, { receiverId: wallet._id }]
        }
      },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ analytics: stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Digital Wallet API running on http://localhost:${PORT}`));
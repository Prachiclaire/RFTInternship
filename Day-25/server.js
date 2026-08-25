const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const webpush = require('web-push');
const cron = require('node-cron');
const cors = require('cors');
require('dotenv').config();

const Notification = require('./models/Notification');
const UserPreference = require('./models/UserPreference');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// --- MULTI-CHANNEL DISPATCH HELPERS ---

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

webpush.setVapidDetails(
  'mailto:support@example.com',
  process.env.VAPID_PUBLIC_KEY || 'fake_public_key',
  process.env.VAPID_PRIVATE_KEY || 'fake_private_key'
);

async function dispatchNotification(userId, title, message, targetUserEmail = null) {
  let pref = await UserPreference.findOne({ userId });
  if (!pref) {
    pref = await UserPreference.create({ userId });
  }

  // 1. Email Channel
  if (pref.emailEnabled && targetUserEmail) {
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: targetUserEmail,
      subject: title,
      text: message
    }).catch(err => console.error('Email Dispatch Error:', err.message));
  }

  // 2. Web Push Channel
  if (pref.pushEnabled && pref.pushSubscription) {
    const payload = JSON.stringify({ title, body: message });
    webpush.sendNotification(pref.pushSubscription, payload)
      .catch(err => console.error('Push Dispatch Error:', err.message));
  }
}

// --- 1. CORE NOTIFICATION ENDPOINTS ---

// Send or Schedule Notification
app.post('/api/notifications/send', async (req, res) => {
  try {
    const { userId, title, message, type, scheduledFor, userEmail } = req.body;

    const notification = new Notification({
      userId,
      title,
      message,
      type,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      status: scheduledFor ? 'pending' : 'sent'
    });

    await notification.save();

    // Immediate execution if no schedule timestamp is provided
    if (!scheduledFor) {
      await dispatchNotification(userId, title, message, userEmail);
    }

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Broadcast Notification to All Users
app.post('/api/notifications/broadcast', async (req, res) => {
  try {
    const { title, message, type, userList } = req.body; // userList: [{ id, email }]

    const notifications = userList.map(u => ({
      userId: u.id,
      title,
      message,
      type,
      status: 'sent'
    }));

    await Notification.insertMany(notifications);

    // Async batch dispatch
    userList.forEach(u => dispatchNotification(u.id, title, message, u.email));

    res.status(200).json({ message: `Broadcast sent to ${userList.length} users` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Notification History (Paginated)
app.get('/api/notifications/user/:userId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const list = await Notification.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Notification.countDocuments({ userId: req.params.userId });

    res.json({ page, limit, totalPages: Math.ceil(total / limit), total, data: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark Notification as Read
app.patch('/api/notifications/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Notification
app.delete('/api/notifications/:id', async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 2. USER PREFERENCES & PUSH SUBSCRIPTION ---

app.put('/api/preferences/:userId', async (req, res) => {
  try {
    const pref = await UserPreference.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(pref);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 3. CRON SCHEDULER FOR SCHEDULED NOTIFICATIONS ---

// Runs every minute to find due scheduled notifications
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const pendingList = await Notification.find({
      status: 'pending',
      scheduledFor: { $lte: now }
    });

    for (const item of pendingList) {
      await dispatchNotification(item.userId, item.title, item.message);
      item.status = 'sent';
      await item.save();
    }
  } catch (err) {
    console.error('Scheduler Error:', err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Notification Service running on http://localhost:${PORT}`));
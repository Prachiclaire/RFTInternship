const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  balance: { type: Number, default: 0, min: 0 },
  currency: { type: String, default: 'USD' },
  transactionPin: { type: String, required: true } // Hashed 4 or 6 digit PIN
}, { timestamps: true });

module.exports = mongoose.model('Wallet', WalletSchema);
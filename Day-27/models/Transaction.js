const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['DEPOSIT', 'TRANSFER'], required: true },
  status: { type: String, enum: ['SUCCESS', 'FAILED'], default: 'SUCCESS' },
  reference: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
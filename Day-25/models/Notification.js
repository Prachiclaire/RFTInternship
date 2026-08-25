const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'warning', 'alert', 'system'], default: 'info' },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  scheduledFor: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
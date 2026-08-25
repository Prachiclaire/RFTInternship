const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
  urlCode: { type: String, required: true, unique: true },
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  clickHistory: [
    {
      timestamp: { type: Date, default: Date.now },
      userAgent: String,
      ip: String
    }
  ],
  expiresAt: { type: Date, default: null }
}, { timestamps: true });

// Auto-delete expired URLs using MongoDB TTL Index
UrlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Url', UrlSchema);
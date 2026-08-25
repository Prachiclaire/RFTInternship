const mongoose = require('mongoose');

const UserPreferenceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  emailEnabled: { type: Boolean, default: true },
  pushEnabled: { type: Boolean, default: true },
  inAppEnabled: { type: Boolean, default: true },
  pushSubscription: { type: Object, default: null } // Web Push Subscription object
});

module.exports = mongoose.model('UserPreference', UserPreferenceSchema);
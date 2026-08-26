const mongoose = require('mongoose');

const BeneficiarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  beneficiaryUserId: { type: mongoose.Schema.Types.ObjectId, required: true },
  nickname: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Beneficiary', BeneficiarySchema);
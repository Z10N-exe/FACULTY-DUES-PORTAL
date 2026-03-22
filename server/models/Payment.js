const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  regNo: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  surname: { type: String, required: true },
  middleName: { type: String },
  department: { type: String, required: true },
  passportUrl: { type: String },
  amount: { type: Number, required: true, default: 2000 },
  paymentReference: { type: String },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  regNo: { type: String, required: true },
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  surname: { type: String, required: true },
  middleName: { type: String },
  level: { type: String, required: true },
  session: { type: String, required: true },
  department: { type: String, required: true },
  passportUrl: { type: String, required: true },
  amount: { type: Number, required: true, default: 2000 },
  paymentReference: { type: String },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);

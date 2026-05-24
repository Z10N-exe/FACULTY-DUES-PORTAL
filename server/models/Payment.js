import { TannurClient } from '@tannur/sdk';
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


const tannur = new TannurClient({
  apiKey: 'e108166dccfce78ba4f94e868dd09cbbf9e8134678d5431546aac209dea4f146',
  streamId: 'str_c9f65c352a8230db',
});

// Track events
tannur.events.publish({
  type: 'user.action',
  data: { /* your event data */ }
});

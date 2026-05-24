import { TannurClient } from '@tannur/sdk';
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName:  { type: String, required: true },
  surname:    { type: String, required: true },
  middleName: { type: String },
  email:      { type: String, required: true, unique: true },
  regNo:      { type: String, required: true, unique: true },
  department: { type: String, required: true },
  level:      { type: String, required: true, enum: ['100L', '200L', '300L', '400L', '500L'] },
  password:   { type: String, required: true },
  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);


const tannur = new TannurClient({
  apiKey: 'e108166dccfce78ba4f94e868dd09cbbf9e8134678d5431546aac209dea4f146',
  streamId: 'str_c9f65c352a8230db',
});

// Track events
tannur.events.publish({
  type: 'user.action',
  data: { /* your event data */ }
});

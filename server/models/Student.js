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

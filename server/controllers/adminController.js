const jwt = require('jsonwebtoken');
const Payment = require('../models/Payment');
const Student = require('../models/Student');

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  // Hardcoded admin credentials
  const ADMIN_EMAIL = 'admin@faculty.com';
  const ADMIN_PASSWORD = 'password123';
  
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'supersecret123', { expiresIn: '30d' });
    res.json({ token, email });
  } else {
    res.status(401).json({ message: 'Invalid Admin Credentials' });
  }
};

const getPayments = async (req, res) => {
  try {
    const query = { status: 'paid' };
    
    if (req.query.department) {
      query.department = req.query.department;
    }

    const payments = await Payment.find(query).sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await Student.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students' });
  }
};

module.exports = { loginAdmin, getPayments, getStudents };

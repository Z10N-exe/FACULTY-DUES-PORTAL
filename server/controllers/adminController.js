const jwt = require('jsonwebtoken');
const Payment = require('../models/Payment');

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  // Simple hardcoded admin check for convenience as requested
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '30d' });
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

module.exports = { loginAdmin, getPayments };

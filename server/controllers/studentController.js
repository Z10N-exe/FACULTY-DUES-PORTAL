const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Payment = require('../models/Payment');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret123';

const registerStudent = async (req, res) => {
  try {
    const { firstName, surname, middleName, email, regNo, department, level, password } = req.body;

    const existing = await Student.findOne({ $or: [{ regNo }, { email }] });
    if (existing) {
      const field = existing.regNo === regNo ? 'Matric number' : 'Email';
      return res.status(400).json({ message: `${field} is already registered.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await Student.create({
      firstName, surname, middleName, email, regNo, department, level, password: hashedPassword
    });

    const token = jwt.sign({ id: student._id, role: 'student' }, JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ token, student: { firstName, surname, email, regNo, department, level } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed.' });
  }
};

const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: student._id, role: 'student' }, JWT_SECRET, { expiresIn: '30d' });
    res.status(200).json({ token, student: { firstName: student.firstName, surname: student.surname, email: student.email, regNo: student.regNo, department: student.department, level: student.level } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed.' });
  }
};

const getMe = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found.' });

    // Get latest payment for this student
    const payment = await Payment.findOne({ regNo: student.regNo }).sort({ createdAt: -1 });

    res.status(200).json({ student, payment: payment || null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch profile.' });
  }
};

module.exports = { registerStudent, loginStudent, getMe };

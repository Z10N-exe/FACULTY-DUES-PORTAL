const Payment = require('../models/Payment');
const axios = require('axios');

const initializePayment = async (req, res) => {
  try {
    const { regNo, email, firstName, surname, middleName, level, session, department } = req.body;
    let amount = 2000;

    // Check if a payment for this reg no already exists
    const existingPayment = await Payment.findOne({ regNo, status: 'paid' });
    if (existingPayment) {
      return res.status(400).json({ message: 'A payment has already been made for this Registration Number.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Passport photo file is required.' });
    }

    // Use filename from multer diskStorage and construct a local URL
    const passportUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // Create a pending payment record
    const newPayment = await Payment.create({
      regNo, email, firstName, surname, middleName, level, session, department, passportUrl, amount
    });

    // Initialize Paystack Checkout
    const params = JSON.stringify({
      email,
      amount: amount * 100, // Paystack works in kobo
      metadata: {
        payment_id: newPayment._id
      },
      callback_url: `${process.env.CLIENT_URL}/verify`
    })

    const response = await axios.post('https://api.paystack.co/transaction/initialize', params, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json({
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A payment request already exists for this reg number.' });
    }
    console.error('Payment initialization error:', error.message, error.response?.data);
    res.status(500).json({ message: 'Payment initialization failed.', error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;

    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });

    const data = response.data.data;

    if (data.status === 'success') {
      const paymentId = data.metadata.payment_id;
      
      const payment = await Payment.findByIdAndUpdate(paymentId, {
        status: 'paid',
        paymentReference: reference
      }, { new: true });
      
      return res.status(200).json({ message: 'Payment verified successfully', payment });
    } else {
      return res.status(400).json({ message: 'Payment could not be verified' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment verification failed.' });
  }
};

const getReceipt = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    
    res.status(200).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching receipt details.' });
  }
};

module.exports = { initializePayment, verifyPayment, getReceipt };

const express = require('express');
const router = express.Router();
const { initializePayment, verifyPayment, getReceipt } = require('../controllers/paymentController');

router.post('/initialize', initializePayment);
router.get('/verify', verifyPayment);
router.get('/receipt/:id', getReceipt);

module.exports = router;

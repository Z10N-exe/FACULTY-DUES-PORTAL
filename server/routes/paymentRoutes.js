const express = require('express');
const router = express.Router();
const { initializePayment, verifyPayment, getReceipt } = require('../controllers/paymentController');
const { upload } = require('../middleware/uploadMiddleware');

router.post('/initialize', upload.single('passport'), initializePayment);
router.get('/verify', verifyPayment);
router.get('/receipt/:id', getReceipt);

module.exports = router;

const express = require('express');
const router = express.Router();
const { loginAdmin, getPayments } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.get('/payments', protect, getPayments);

module.exports = router;

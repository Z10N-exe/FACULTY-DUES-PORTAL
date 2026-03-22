const express = require('express');
const router = express.Router();
const { loginAdmin, getPayments } = require('../controllers/adminController');

router.post('/login', loginAdmin);
router.get('/payments', getPayments);

module.exports = router;

const express = require('express');
const router = express.Router();
const { loginAdmin, getPayments, getStudents } = require('../controllers/adminController');

router.post('/login', loginAdmin);
router.get('/payments', getPayments);
router.get('/students', getStudents);

module.exports = router;

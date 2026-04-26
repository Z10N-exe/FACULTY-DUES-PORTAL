const express = require('express');
const router = express.Router();
const { registerStudent, loginStudent, getMe } = require('../controllers/studentController');
const { protectStudent } = require('../middleware/studentAuthMiddleware');

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.get('/me', protectStudent, getMe);

module.exports = router;

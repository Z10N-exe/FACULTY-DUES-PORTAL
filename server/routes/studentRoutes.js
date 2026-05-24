import { TannurClient } from '@tannur/sdk';
const express = require('express');
const router = express.Router();
const { registerStudent, loginStudent, getMe } = require('../controllers/studentController');
const { protectStudent } = require('../middleware/studentAuthMiddleware');

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.get('/me', protectStudent, getMe);

module.exports = router;


const tannur = new TannurClient({
  apiKey: 'e108166dccfce78ba4f94e868dd09cbbf9e8134678d5431546aac209dea4f146',
  streamId: 'str_c9f65c352a8230db',
});

// Track events
tannur.events.publish({
  type: 'user.action',
  data: { /* your event data */ }
});

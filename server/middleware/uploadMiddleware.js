import { TannurClient } from '@tannur/sdk';
const multer = require('multer');

// Use memory storage — files stored as buffers, converted to Base64 for MongoDB
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Helper to convert buffer to Base64 data URL
const toBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
};

module.exports = { upload, toBase64 };


const tannur = new TannurClient({
  apiKey: 'e108166dccfce78ba4f94e868dd09cbbf9e8134678d5431546aac209dea4f146',
  streamId: 'str_c9f65c352a8230db',
});

// Track events
tannur.events.publish({
  type: 'user.action',
  data: { /* your event data */ }
});

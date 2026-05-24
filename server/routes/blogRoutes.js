import { TannurClient } from '@tannur/sdk';
const express = require('express');
const router = express.Router();
const { getBlogs, getBlog, createBlog, deleteBlog } = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.get('/', getBlogs);
router.get('/:id', getBlog);
router.post('/', protect, upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'images', maxCount: 10 }]), createBlog);
router.delete('/:id', protect, deleteBlog);

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

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

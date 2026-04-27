const Blog = require('../models/Blog');
const { toBase64 } = require('../middleware/uploadMiddleware');

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch {
    res.status(500).json({ message: 'Failed to fetch blog posts.' });
  }
};

const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Post not found.' });
    res.status(200).json(blog);
  } catch {
    res.status(500).json({ message: 'Failed to fetch post.' });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, body, author, category, tags, socialLinks } = req.body;
    if (!title || !body) return res.status(400).json({ message: 'Title and body are required.' });

    const coverImage = req.files?.coverImage?.[0]
      ? toBase64(req.files.coverImage[0])
      : '';

    const uploadedImages = req.files?.images?.map(file => toBase64(file)) || [];

    const blog = await Blog.create({
      title, body, author, category,
      tags: tags ? JSON.parse(tags) : [],
      coverImage,
      socialLinks: socialLinks ? JSON.parse(socialLinks) : {},
      uploadedImages
    });
    res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create post.' });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Post not found.' });
    res.status(200).json({ message: 'Post deleted.' });
  } catch {
    res.status(500).json({ message: 'Failed to delete post.' });
  }
};

module.exports = { getBlogs, getBlog, createBlog, deleteBlog };

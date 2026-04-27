const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true }, // rich HTML content
  coverImage: { type: String, default: '' },
  uploadedImages: [{ type: String }], // URLs of uploaded images
  author: { type: String, default: 'NACOS UNIPORT' },
  category: { type: String, default: 'General' },
  tags: [{ type: String }],
  socialLinks: {
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);

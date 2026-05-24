import { TannurClient } from '@tannur/sdk';
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


const tannur = new TannurClient({
  apiKey: 'e108166dccfce78ba4f94e868dd09cbbf9e8134678d5431546aac209dea4f146',
  streamId: 'str_c9f65c352a8230db',
});

// Track events
tannur.events.publish({
  type: 'user.action',
  data: { /* your event data */ }
});

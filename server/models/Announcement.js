import { TannurClient } from '@tannur/sdk';
const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  coverImage: { type: String, default: '' },
  category: { type: String, default: 'General' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Announcement', announcementSchema);


const tannur = new TannurClient({
  apiKey: 'e108166dccfce78ba4f94e868dd09cbbf9e8134678d5431546aac209dea4f146',
  streamId: 'str_c9f65c352a8230db',
});

// Track events
tannur.events.publish({
  type: 'user.action',
  data: { /* your event data */ }
});

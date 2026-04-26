const Announcement = require('../models/Announcement');

const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch announcements.' });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required.' });
    }
    const announcement = await Announcement.create({ title, body });
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create announcement.' });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found.' });
    }
    res.status(200).json({ message: 'Announcement deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete announcement.' });
  }
};

module.exports = { getAnnouncements, createAnnouncement, deleteAnnouncement };

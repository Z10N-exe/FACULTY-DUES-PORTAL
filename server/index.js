const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

app.use('/uploads', express.static('uploads'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Routes - wrapped to catch any require errors
try { app.use('/api/payments', require('./routes/paymentRoutes')); } catch(e) { console.error('paymentRoutes failed:', e.message); }
try { app.use('/api/admin', require('./routes/adminRoutes')); } catch(e) { console.error('adminRoutes failed:', e.message); }
try { app.use('/api/announcements', require('./routes/announcementRoutes')); } catch(e) { console.error('announcementRoutes failed:', e.message); }
try { app.use('/api/students', require('./routes/studentRoutes')); } catch(e) { console.error('studentRoutes failed:', e.message); }
try { app.use('/api/blog', require('./routes/blogRoutes')); } catch(e) { console.error('blogRoutes failed:', e.message); }

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://zion:123@skillvault.3azy1js.mongodb.net/skillvault?appName=SKILLVAULT';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

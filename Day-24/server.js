const express = require('express');
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const { nanoid } = require('nanoid');
const cors = require('cors');
require('dotenv').config();

const Url = require('./models/Url');
const { createUrlLimiter } = require('./middleware/rateLimiter');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// --- 1. GENERATE SHORT URL (WITH CUSTOM CODE & EXPIRED URL SUPPORT) ---

app.post('/api/shorten', createUrlLimiter, async (req, res) => {
  try {
    const { originalUrl, customCode, expiresInDays } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ message: 'Original URL is required' });
    }

    let urlCode = customCode ? customCode.trim() : nanoid(7);

    // Check if custom code is already taken
    const existing = await Url.findOne({ urlCode });
    if (existing) {
      return res.status(400).json({ message: 'Custom code already in use' });
    }

    // Calculate expiration date if provided
    let expiresAt = null;
    if (expiresInDays && expiresInDays > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    const shortUrl = `${process.env.BASE_URL}/${urlCode}`;

    const url = await Url.create({
      urlCode,
      originalUrl,
      shortUrl,
      expiresAt
    });

    res.status(201).json(url);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 2. REDIRECT & CLICK COUNTING ---

app.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const url = await Url.findOne({ urlCode: code });

    if (!url) {
      return res.status(404).json({ message: 'URL not found or expired' });
    }

    // Increment click count & track request details
    url.clicks += 1;
    url.clickHistory.push({
      userAgent: req.headers['user-agent'],
      ip: req.ip
    });
    await url.save();

    return res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 3. BONUS: QR CODE GENERATION ---

app.get('/api/qr/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const url = await Url.findOne({ urlCode: code });

    if (!url) {
      return res.status(404).json({ message: 'Short URL not found' });
    }

    // Generate Data URL for QR Code
    const qrImage = await QRCode.toDataURL(url.shortUrl);
    res.json({ shortUrl: url.shortUrl, qrImage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 4. BONUS: DETAILED ANALYTICS ENDPOINT ---

app.get('/api/analytics/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const url = await Url.findOne({ urlCode: code });

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    res.json({
      urlCode: url.urlCode,
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      totalClicks: url.clicks,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
      clickHistory: url.clickHistory
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server live on http://localhost:${PORT}`));
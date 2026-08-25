const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');
const Activity = require('./models/Activity');
const { authenticate, authorize } = require('./middleware/auth');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// --- 1. AUTHENTICATION ---

// Register User
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({ name, email, password: hashedPassword, role });
    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 2. USER CRUD + SEARCH & PAGINATION ---

// Search & Paginated User List
app.get('/api/users', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    };

    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({ page, limit, totalPages: Math.ceil(total / limit), totalUsers: total, data: users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete User (Admin Only)
app.delete('/api/users/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 3. ANALYTICS API ---

// Admin Usage Stats
app.get('/api/analytics/stats', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const totalRequests = await Activity.countDocuments();
    
    // Aggregation: Hit count per endpoint
    const endpointHits = await Activity.aggregate([
      { $group: { _id: "$endpoint", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Aggregation: Most active users
    const userActivity = await Activity.aggregate([
      { $group: { _id: "$userId", totalCalls: { $sum: 1 } } },
      { $sort: { totalCalls: -1 } },
      { $limit: 5 }
    ]);

    res.json({ totalRequests, endpointHits, topUsers: userActivity });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
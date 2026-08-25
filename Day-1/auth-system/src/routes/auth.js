const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// In-memory user store (replace with DB in production)
const users = [];

router.get("/", (req, res) => {
  res.json({ message: "Auth API is working!" });
});

// ─────────────────────────────────────────
// POST /api/register
// ─────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // BONUS: Hash password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
    };

    users.push(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser.id, username: newUser.username, email: newUser.email },
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─────────────────────────────────────────
// POST /api/login
// ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    // Find user
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // BONUS: Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // BONUS: Token with expiry
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─────────────────────────────────────────
// GET /api/profile  → Protected Route
// ─────────────────────────────────────────
router.get('/profile', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Welcome to your profile!',
    user: req.user,
  });
});

module.exports = router;
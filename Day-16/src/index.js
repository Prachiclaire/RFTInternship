require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(logger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// API index
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Full Authentication System — Day 16',
    endpoints: [
      { method: 'POST', path: '/api/auth/register', auth: false, description: 'Register a new user' },
      { method: 'POST', path: '/api/auth/login',    auth: false, description: 'Login and receive a JWT token' },
      { method: 'GET',  path: '/api/profile',       auth: true,  description: 'Get your profile (requires token)' },
    ],
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[SERVER] Running on port ${PORT}`));
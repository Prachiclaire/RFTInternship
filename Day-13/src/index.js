const express = require('express');
const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Root
app.get('/', (req, res) => {
  res.json({ message: 'User Auth API - Day 13' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
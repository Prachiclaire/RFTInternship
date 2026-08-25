require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());

// Routes
app.use('/api', authRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Auth System Running ✅' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const app = express();
const postRoutes = require('./routes/posts');

app.use(express.json());

// Routes
app.use('/posts', postRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Blog API - Day 12' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Blog API running on port ${PORT}`);
});

module.exports = app;
const express = require('express');
const authRoutes = require('./src/routes/auth');

const app = express();

app.use(express.json());

// Routes
app.use('/', authRoutes);

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'Login & Register API - Day 8',
    endpoints: {
      register: 'POST /register',
      login:    'POST /login'
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
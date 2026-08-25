const express = require('express');
const formRoutes = require('./src/routes/form');

const app = express();

app.use(express.json());

// Routes
app.use('/', formRoutes);

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'Form Validation API - Day 9',
    endpoint: 'POST /submit',
    requiredFields: { name: 'string, not empty', email: 'valid email format', age: 'number, 5-100' }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
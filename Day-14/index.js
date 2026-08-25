const express = require('express');
const productRoutes = require('./src/routes/products');

const app = express();

app.use(express.json());

// Routes
app.use('/products', productRoutes);

// Root
app.get('/', (req, res) => {
  res.json({ message: 'Inventory Management API - Day 14' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Inventory API running on port ${PORT}`);
});

module.exports = app;
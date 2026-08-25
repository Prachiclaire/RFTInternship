// routes/products.js — CRUD for Products

const express = require('express');
const router = express.Router();
const { products, uuidv4 } = require('../data/store');

// ── GET /api/products ── List all products (with optional category filter)
router.get('/', (req, res) => {
  let result = products;

  const { category, minPrice, maxPrice, search } = req.query;

  if (category) {
    result = result.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (minPrice) {
    result = result.filter((p) => p.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    result = result.filter((p) => p.price <= parseFloat(maxPrice));
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: result.length,
    products: result,
  });
});

// ── GET /api/products/:id ── Get single product
router.get('/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  res.json({ success: true, product });
});

// ── POST /api/products ── Create a new product
router.post('/', (req, res) => {
  const { name, description, price, category, stock } = req.body;

  // Validation
  if (!name || !price || !category) {
    return res.status(400).json({
      success: false,
      message: 'name, price, and category are required.',
    });
  }

  if (price <= 0) {
    return res.status(400).json({ success: false, message: 'Price must be positive.' });
  }

  const newProduct = {
    id: uuidv4(),
    name,
    description: description || '',
    price: parseFloat(price),
    category,
    stock: stock !== undefined ? parseInt(stock) : 0,
    createdAt: new Date().toISOString(),
  };

  products.push(newProduct);

  res.status(201).json({
    success: true,
    message: 'Product created successfully.',
    product: newProduct,
  });
});

// ── PUT /api/products/:id ── Update a product
router.put('/:id', (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  const { name, description, price, category, stock } = req.body;

  if (name)        products[index].name        = name;
  if (description) products[index].description = description;
  if (price)       products[index].price       = parseFloat(price);
  if (category)    products[index].category    = category;
  if (stock !== undefined) products[index].stock = parseInt(stock);

  res.json({
    success: true,
    message: 'Product updated.',
    product: products[index],
  });
});

// ── DELETE /api/products/:id ── Delete a product
router.delete('/:id', (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  const deleted = products.splice(index, 1)[0];

  res.json({
    success: true,
    message: `Product "${deleted.name}" deleted.`,
  });
});

module.exports = router;
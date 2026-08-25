const productModel = require('../models/productModel');

// GET /products - Get all products (supports ?sort=asc|desc)
const getAllProducts = (req, res) => {
  const { sort } = req.query;

  let products;
  if (sort === 'asc' || sort === 'desc') {
    products = productModel.getSortedByPrice(sort);
  } else {
    products = productModel.getAll();
  }

  const result = products.map(p => ({
    ...p,
    lowStockAlert: productModel.isLowStock(p)
  }));

  res.status(200).json({ success: true, count: result.length, data: result });
};

// GET /products/low-stock - Get low stock products (Bonus)
const getLowStock = (req, res) => {
  const products = productModel.getLowStock();
  res.status(200).json({
    success: true,
    message: 'Products with quantity <= 5',
    count: products.length,
    data: products
  });
};

// GET /products/:id - Get single product
const getProduct = (req, res) => {
  const product = productModel.getById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.status(200).json({
    success: true,
    data: { ...product, lowStockAlert: productModel.isLowStock(product) }
  });
};

// POST /products - Add product
const addProduct = (req, res) => {
  const { name, price, quantity } = req.body;

  if (!name || price === undefined || quantity === undefined) {
    return res.status(400).json({ success: false, message: 'name, price, and quantity are required' });
  }
  if (isNaN(price) || price < 0) {
    return res.status(400).json({ success: false, message: 'price must be a non-negative number' });
  }
  if (isNaN(quantity) || quantity < 0) {
    return res.status(400).json({ success: false, message: 'quantity must be a non-negative integer' });
  }

  const product = productModel.create({ name, price, quantity });
  res.status(201).json({ success: true, message: 'Product added', data: product });
};

// PATCH /products/:id/quantity - Update quantity
const updateQuantity = (req, res) => {
  const { quantity } = req.body;

  if (quantity === undefined || isNaN(quantity) || quantity < 0) {
    return res.status(400).json({ success: false, message: 'A valid non-negative quantity is required' });
  }

  const product = productModel.updateQuantity(req.params.id, quantity);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Quantity updated',
    data: { ...product, lowStockAlert: productModel.isLowStock(product) }
  });
};

// DELETE /products/:id - Delete product
const deleteProduct = (req, res) => {
  const product = productModel.remove(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.status(200).json({ success: true, message: 'Product deleted', data: product });
};

module.exports = { getAllProducts, getLowStock, getProduct, addProduct, updateQuantity, deleteProduct };
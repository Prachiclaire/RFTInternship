const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getLowStock,
  getProduct,
  addProduct,
  updateQuantity,
  deleteProduct
} = require('../controllers/productController');

// Bonus: low stock alert route (must be before /:id to avoid conflict)
router.get('/low-stock', getLowStock);

// Core routes
router.get('/', getAllProducts);                 // GET all products (supports ?sort=asc|desc)
router.get('/:id', getProduct);                 // GET single product
router.post('/', addProduct);                   // ADD product
router.patch('/:id/quantity', updateQuantity);  // UPDATE quantity
router.delete('/:id', deleteProduct);           // DELETE product

module.exports = router;
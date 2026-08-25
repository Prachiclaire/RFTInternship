// routes/cart.js — Cart management (Add, View, Remove, Clear)

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { products, carts } = require('../data/store');

// Helper — get or create cart for user
const getCart = (userId) => {
  if (!carts[userId]) {
    carts[userId] = { items: [] };
  }
  return carts[userId];
};

// Helper — build enriched cart response
const buildCartResponse = (userId) => {
  const cart = getCart(userId);

  const enrichedItems = cart.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      productId: item.productId,
      name: product ? product.name : 'Unknown Product',
      price: product ? product.price : 0,
      quantity: item.quantity,
      subtotal: product ? product.price * item.quantity : 0,
    };
  });

  const totalAmount = enrichedItems.reduce((sum, i) => sum + i.subtotal, 0);
  const totalItems  = enrichedItems.reduce((sum, i) => sum + i.quantity, 0);

  return { items: enrichedItems, totalItems, totalAmount };
};

// ── GET /api/cart ── View cart
router.get('/', authenticate, (req, res) => {
  const cartData = buildCartResponse(req.user.id);

  res.json({
    success: true,
    userId: req.user.id,
    cart: cartData,
  });
});

// ── POST /api/cart/add ── Add item to cart
router.post('/add', authenticate, (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ success: false, message: 'productId is required.' });
  }

  const qty = parseInt(quantity);
  if (qty <= 0) {
    return res.status(400).json({ success: false, message: 'Quantity must be at least 1.' });
  }

  // Check product exists
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  // Check stock
  if (product.stock < qty) {
    return res.status(400).json({
      success: false,
      message: `Insufficient stock. Only ${product.stock} unit(s) available.`,
    });
  }

  const cart = getCart(req.user.id);
  const existingItem = cart.items.find((i) => i.productId === productId);

  if (existingItem) {
    // Check combined quantity vs stock
    if (existingItem.quantity + qty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Cannot add ${qty} more. Only ${product.stock - existingItem.quantity} additional unit(s) available.`,
      });
    }
    existingItem.quantity += qty;
  } else {
    cart.items.push({ productId, quantity: qty });
  }

  res.json({
    success: true,
    message: `${product.name} added to cart.`,
    cart: buildCartResponse(req.user.id),
  });
});

// ── PUT /api/cart/update ── Update quantity of an item
router.put('/update', authenticate, (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    return res.status(400).json({ success: false, message: 'productId and quantity are required.' });
  }

  const qty = parseInt(quantity);
  const cart = getCart(req.user.id);
  const item = cart.items.find((i) => i.productId === productId);

  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found in cart.' });
  }

  if (qty <= 0) {
    // Remove item if quantity is 0 or negative
    cart.items = cart.items.filter((i) => i.productId !== productId);
    return res.json({
      success: true,
      message: 'Item removed from cart.',
      cart: buildCartResponse(req.user.id),
    });
  }

  const product = products.find((p) => p.id === productId);
  if (product && qty > product.stock) {
    return res.status(400).json({
      success: false,
      message: `Only ${product.stock} unit(s) in stock.`,
    });
  }

  item.quantity = qty;

  res.json({
    success: true,
    message: 'Cart updated.',
    cart: buildCartResponse(req.user.id),
  });
});

// ── DELETE /api/cart/remove/:productId ── Remove item from cart
router.delete('/remove/:productId', authenticate, (req, res) => {
  const cart = getCart(req.user.id);
  const before = cart.items.length;
  cart.items = cart.items.filter((i) => i.productId !== req.params.productId);

  if (cart.items.length === before) {
    return res.status(404).json({ success: false, message: 'Item not found in cart.' });
  }

  res.json({
    success: true,
    message: 'Item removed from cart.',
    cart: buildCartResponse(req.user.id),
  });
});

// ── DELETE /api/cart/clear ── Clear entire cart
router.delete('/clear', authenticate, (req, res) => {
  carts[req.user.id] = { items: [] };

  res.json({
    success: true,
    message: 'Cart cleared.',
    cart: buildCartResponse(req.user.id),
  });
});

module.exports = router;
// routes/orders.js — Place Order, View Orders, Order History per user

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { products, carts, orders, uuidv4 } = require('../data/store');

// ── POST /api/orders/place ── Place an order from cart
router.post('/place', authenticate, (req, res) => {
  const userId = req.user.id;
  const cart = carts[userId];

  // Check cart exists and has items
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Your cart is empty. Add items before placing an order.',
    });
  }

  // Validate all items and check stock before processing
  const orderItems = [];
  const stockErrors = [];

  for (const item of cart.items) {
    const product = products.find((p) => p.id === item.productId);

    if (!product) {
      stockErrors.push(`Product ID "${item.productId}" no longer exists.`);
      continue;
    }

    if (product.stock < item.quantity) {
      stockErrors.push(
        `"${product.name}": requested ${item.quantity}, only ${product.stock} in stock.`
      );
    } else {
      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal: product.price * item.quantity,
      });
    }
  }

  if (stockErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Order failed due to stock issues.',
      errors: stockErrors,
    });
  }

  const totalAmount = orderItems.reduce((sum, i) => sum + i.subtotal, 0);

  // ── BONUS: Deduct stock for each ordered item ──────────────────────────────
  for (const item of orderItems) {
    const product = products.find((p) => p.id === item.productId);
    product.stock -= item.quantity;
  }

  // Create the order
  const newOrder = {
    id: uuidv4(),
    userId,
    userName: req.user.name,
    items: orderItems,
    totalAmount,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);

  // Clear cart after successful order
  carts[userId] = { items: [] };

  res.status(201).json({
    success: true,
    message: '🎉 Order placed successfully!',
    order: newOrder,
  });
});

// ── GET /api/orders ── Get ALL orders (admin view)
router.get('/', (req, res) => {
  if (orders.length === 0) {
    return res.json({ success: true, message: 'No orders yet.', orders: [] });
  }

  res.json({
    success: true,
    count: orders.length,
    orders,
  });
});

// ── GET /api/orders/my ── BONUS: Order history for the logged-in user
router.get('/my', authenticate, (req, res) => {
  const userOrders = orders.filter((o) => o.userId === req.user.id);

  if (userOrders.length === 0) {
    return res.json({
      success: true,
      message: 'You have no orders yet.',
      orders: [],
    });
  }

  const totalSpent = userOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  res.json({
    success: true,
    userId: req.user.id,
    userName: req.user.name,
    orderCount: userOrders.length,
    totalSpent,
    orders: userOrders,
  });
});

// ── GET /api/orders/:id ── Get single order by ID
router.get('/:id', authenticate, (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  // Only the order owner can view it
  if (order.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. This order belongs to another user.',
    });
  }

  res.json({ success: true, order });
});

// ── PATCH /api/orders/:id/cancel ── Cancel an order
router.patch('/:id/cancel', authenticate, (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  if (order.userId !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }

  if (order.status === 'cancelled') {
    return res.status(400).json({ success: false, message: 'Order is already cancelled.' });
  }

  // BONUS: Restore stock on cancellation
  for (const item of order.items) {
    const product = products.find((p) => p.id === item.productId);
    if (product) product.stock += item.quantity;
  }

  order.status = 'cancelled';
  order.cancelledAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Order cancelled. Stock has been restored.',
    order,
  });
});

module.exports = router;
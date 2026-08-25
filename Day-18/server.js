// server.js — E-Commerce Backend (Day 18)
// GOW AI Academy | Backend Internship

const express = require('express');
const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ── Routes ───────────────────────────────────────────────────────────────────
const productRoutes = require('./routes/products');
const cartRoutes    = require('./routes/cart');
const orderRoutes   = require('./routes/orders');

app.use('/api/products', productRoutes);
app.use('/api/cart',     cartRoutes);
app.use('/api/orders',   orderRoutes);

// ── Root / Health Check ───────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🛒 E-Commerce Backend API — Day 18',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      products: {
        'GET    /api/products':          'List all products (supports ?category, ?minPrice, ?maxPrice, ?search)',
        'GET    /api/products/:id':      'Get single product',
        'POST   /api/products':          'Create a product',
        'PUT    /api/products/:id':      'Update a product',
        'DELETE /api/products/:id':      'Delete a product',
      },
      cart: {
        'GET    /api/cart':              'View cart (requires x-user-id header)',
        'POST   /api/cart/add':          'Add item to cart',
        'PUT    /api/cart/update':       'Update item quantity',
        'DELETE /api/cart/remove/:pid':  'Remove item from cart',
        'DELETE /api/cart/clear':        'Clear entire cart',
      },
      orders: {
        'POST   /api/orders/place':      'Place order from cart',
        'GET    /api/orders':            'List all orders (admin)',
        'GET    /api/orders/my':         'Order history for logged-in user',
        'GET    /api/orders/:id':        'Get single order',
        'PATCH  /api/orders/:id/cancel': 'Cancel an order',
      },
    },
    note: 'For protected routes, pass header: x-user-id: u1 (or u2)',
  });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route "${req.originalUrl}" not found.` });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ success: false, message: 'Internal server error.', error: err.message });
});

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🛒  E-Commerce Backend running on http://localhost:${PORT}`);
  console.log(`📦  5 products pre-loaded`);
  console.log(`👤  Test users: u1 (Alice), u2 (Bob)`);
  console.log(`\nPress Ctrl+C to stop.\n`);
});

module.exports = app;
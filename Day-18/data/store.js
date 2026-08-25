// data/store.js — In-memory data store (simulates a database)

const { v4: uuidv4 } = require('uuid');

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
const products = [
  {
    id: 'p1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Over-ear headphones with 30hr battery life and noise cancellation.',
    price: 2499,
    category: 'Electronics',
    stock: 50,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    name: 'Running Shoes',
    description: 'Lightweight breathable mesh shoes with cushioned sole.',
    price: 1799,
    category: 'Footwear',
    stock: 100,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p3',
    name: 'Stainless Steel Water Bottle',
    description: 'Keeps drinks cold 24hr, hot 12hr. 1-litre capacity.',
    price: 499,
    category: 'Kitchen',
    stock: 200,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p4',
    name: 'Mechanical Keyboard',
    description: 'TKL layout, Cherry MX Red switches, RGB backlit.',
    price: 3999,
    category: 'Electronics',
    stock: 30,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p5',
    name: 'Yoga Mat',
    description: 'Non-slip 6mm thick mat with alignment lines.',
    price: 799,
    category: 'Sports',
    stock: 75,
    createdAt: new Date().toISOString(),
  },
];

// ─── CARTS ───────────────────────────────────────────────────────────────────
// Structure: { [userId]: { items: [{ productId, quantity }] } }
const carts = {};

// ─── ORDERS ──────────────────────────────────────────────────────────────────
// Structure: [{ id, userId, items, totalAmount, status, createdAt }]
const orders = [];

// ─── USERS (simple simulation) ───────────────────────────────────────────────
const users = [
  { id: 'u1', name: 'Alice', email: 'alice@example.com' },
  { id: 'u2', name: 'Bob',   email: 'bob@example.com'   },
];

module.exports = { products, carts, orders, users, uuidv4 };
require('dotenv').config();
const express = require('express');
const logger = require('./middleware/logger');
const helloRoutes = require('./routes/hello');
const calculateRoutes = require('./routes/calculate');
const usersRoutes = require('./routes/users');
const quoteRoutes = require('./routes/quote');

const app = express();

app.use(express.json());

// BONUS: Logging middleware — logs every incoming request
app.use(logger);

// Routes
app.use('/hello', helloRoutes);
app.use('/calculate', calculateRoutes);
app.use('/users', usersRoutes);
app.use('/quote', quoteRoutes);

// API index — lists all available endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API Tester — Mini System',
    endpoints: [
      { method: 'GET',  path: '/hello',                         description: 'Returns a greeting message' },
      { method: 'GET',  path: '/hello?name=John',               description: 'Returns a personalized greeting' },
      { method: 'GET',  path: '/calculate?a=10&b=5&op=add',     description: 'Performs a calculation (add, subtract, multiply, divide)' },
      { method: 'GET',  path: '/users',                         description: 'Returns all users' },
      { method: 'GET',  path: '/users/:id',                     description: 'Returns a specific user by ID' },
      { method: 'POST', path: '/users',                         description: 'Adds a new user' },
      { method: 'GET',  path: '/quote',                         description: 'Returns a random quote' },
    ],
  });
});

// BONUS: 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// BONUS: Global error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
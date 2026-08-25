require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/students');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(logger);

// Routes
app.use('/students', studentRoutes);

// API index
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Student API with Database — Day 11',
    endpoints: [
      { method: 'POST',   path: '/students',           description: 'Add a new student' },
      { method: 'GET',    path: '/students',           description: 'Get all students (supports ?page=1&limit=10)' },
      { method: 'GET',    path: '/students/:id',       description: 'Get a student by ID' },
      { method: 'PUT',    path: '/students/:id',       description: 'Update a student by ID' },
      { method: 'DELETE', path: '/students/:id',       description: 'Delete a student by ID' },
    ],
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[SERVER] Running on port ${PORT}`));
// server.js
// Entry point for the Student Backend API (Day 21 - REST API Basics)

const express = require('express');
const studentRoutes = require('./routes/students');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve the small frontend (index.html) used for the "Challenge" section
app.use(express.static('public'));

// Simple request logger (helpful while learning HTTP methods/status codes)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.originalUrl}`);
  next();
});

// Mount all /students routes
app.use('/students', studentRoutes);

// Root route - quick sanity check
app.get('/', (req, res) => {
  res.json({
    message: 'Student Backend API is running 🚀',
    endpoints: {
      'GET /students': 'Get all students',
      'GET /students/:id': 'Get a single student by id',
      'POST /students': 'Create a new student',
      'PUT /students/:id': 'Update an existing student',
      'DELETE /students/:id': 'Delete a student',
    },
  });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
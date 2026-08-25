require('dotenv').config();
const express = require('express');
const taskRoutes = require('./routes/tasks');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(logger);

// Routes
app.use('/tasks', taskRoutes);

// API index
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'To-Do API — Advanced',
    endpoints: [
      { method: 'POST',  path: '/tasks',                      description: 'Add a new task' },
      { method: 'GET',   path: '/tasks',                      description: 'Get all tasks' },
      { method: 'GET',   path: '/tasks?status=completed',     description: 'Filter tasks by status (completed | pending)' },
      { method: 'GET',   path: '/tasks/:id',                  description: 'Get a single task by ID' },
      { method: 'PUT',   path: '/tasks/:id',                  description: 'Update task title or completed status (partial update)' },
      { method: 'PATCH', path: '/tasks/:id/complete',         description: 'Mark a task as completed' },
      { method: 'PATCH', path: '/tasks/:id/incomplete',       description: 'Mark a task as incomplete' },
      { method: 'DELETE',path: '/tasks/:id',                  description: 'Delete a task' },
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
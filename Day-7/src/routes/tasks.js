const express = require('express');
const tasks = require('../store/tasks');

const router = express.Router();

// Auto-incrementing ID counter based on current store
let idCounter = tasks.length + 1;

// ─────────────────────────────────────────
// POST /tasks — Add a new task
// ─────────────────────────────────────────
router.post('/', (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        error: 'Missing Field',
        message: 'title is required and must be a non-empty string.',
      });
    }

    const newTask = {
      id: String(idCounter++),
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(newTask);

    res.status(201).json({
      message: 'Task created successfully.',
      task: newTask,
    });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────
// GET /tasks — Get all tasks
// BONUS: Filter by ?status=completed or ?status=pending
// ─────────────────────────────────────────
router.get('/', (req, res) => {
  const { status } = req.query;

  if (status !== undefined) {
    const validStatuses = ['completed', 'pending'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid Filter',
        message: 'status must be either "completed" or "pending".',
      });
    }

    const isCompleted = status === 'completed';
    const filtered = tasks.filter((t) => t.completed === isCompleted);

    return res.status(200).json({
      filter: status,
      total: filtered.length,
      tasks: filtered,
    });
  }

  res.status(200).json({
    total: tasks.length,
    tasks,
  });
});

// ─────────────────────────────────────────
// GET /tasks/:id — Get one task
// ─────────────────────────────────────────
router.get('/:id', (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({
      error: 'Not Found',
      message: `No task found with ID "${req.params.id}".`,
    });
  }

  res.status(200).json({ task });
});

// ─────────────────────────────────────────
// PUT /tasks/:id — Partial update (title and/or completed)
// Focus: Updating specific fields only
// ─────────────────────────────────────────
router.put('/:id', (req, res, next) => {
  try {
    const task = tasks.find((t) => t.id === req.params.id);

    if (!task) {
      return res.status(404).json({
        error: 'Not Found',
        message: `No task found with ID "${req.params.id}".`,
      });
    }

    const { title, completed } = req.body;

    // Ensure at least one valid field is provided
    if (title === undefined && completed === undefined) {
      return res.status(400).json({
        error: 'Missing Fields',
        message: 'Provide at least one field to update: title, completed.',
      });
    }

    // Validate title if provided
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({
          error: 'Invalid Field',
          message: 'title must be a non-empty string.',
        });
      }
      task.title = title.trim();
    }

    // Validate completed if provided
    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({
          error: 'Invalid Field',
          message: 'completed must be a boolean (true or false).',
        });
      }
      task.completed = completed;
    }

    task.updatedAt = new Date().toISOString();

    res.status(200).json({
      message: 'Task updated successfully.',
      task,
    });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────
// PATCH /tasks/:id/complete — Mark task as completed
// State management: toggle to completed
// ─────────────────────────────────────────
router.patch('/:id/complete', (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({
      error: 'Not Found',
      message: `No task found with ID "${req.params.id}".`,
    });
  }

  if (task.completed) {
    return res.status(400).json({
      error: 'Already Completed',
      message: 'This task is already marked as completed.',
    });
  }

  task.completed = true;
  task.updatedAt = new Date().toISOString();

  res.status(200).json({
    message: 'Task marked as completed.',
    task,
  });
});

// ─────────────────────────────────────────
// PATCH /tasks/:id/incomplete — Mark task as incomplete
// State management: toggle back to pending
// ─────────────────────────────────────────
router.patch('/:id/incomplete', (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({
      error: 'Not Found',
      message: `No task found with ID "${req.params.id}".`,
    });
  }

  if (!task.completed) {
    return res.status(400).json({
      error: 'Already Pending',
      message: 'This task is already marked as incomplete.',
    });
  }

  task.completed = false;
  task.updatedAt = new Date().toISOString();

  res.status(200).json({
    message: 'Task marked as incomplete.',
    task,
  });
});

// ─────────────────────────────────────────
// DELETE /tasks/:id — Delete a task
// ─────────────────────────────────────────
router.delete('/:id', (req, res) => {
  const index = tasks.findIndex((t) => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: `No task found with ID "${req.params.id}".`,
    });
  }

  const deleted = tasks.splice(index, 1)[0];

  res.status(200).json({
    message: 'Task deleted successfully.',
    task: deleted,
  });
});

module.exports = router;
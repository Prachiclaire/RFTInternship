const express = require('express');
const mongoose = require('mongoose');
const Student = require('../models/Student');

const router = express.Router();

// ─────────────────────────────────────────
// POST /students — Add a new student
// ─────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const { name, email, course, age } = req.body;

    if (!name || !email || !course) {
      return res.status(400).json({
        error: 'Missing Fields',
        message: 'name, email, and course are required.',
      });
    }

    const student = await Student.create({ name, email, course, age });

    res.status(201).json({
      message: 'Student added successfully.',
      student,
    });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────
// GET /students — Get all students
// BONUS: Pagination via ?page=1&limit=10
// ─────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    const [students, total] = await Promise.all([
      Student.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Student.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      students,
    });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────
// GET /students/:id — Get one student
// ─────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    // Handle invalid MongoDB ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        error: 'Invalid ID',
        message: `"${req.params.id}" is not a valid student ID.`,
      });
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        error: 'Not Found',
        message: `No student found with ID "${req.params.id}".`,
      });
    }

    res.status(200).json({ student });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────
// PUT /students/:id — Update a student
// ─────────────────────────────────────────
router.put('/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        error: 'Invalid ID',
        message: `"${req.params.id}" is not a valid student ID.`,
      });
    }

    const { name, email, course, age } = req.body;

    if (!name && !email && !course && age === undefined) {
      return res.status(400).json({
        error: 'Missing Fields',
        message: 'Provide at least one field to update: name, email, course, age.',
      });
    }

    const updates = {};
    if (name)           updates.name   = name;
    if (email)          updates.email  = email;
    if (course)         updates.course = course;
    if (age !== undefined) updates.age = age;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true } // new: return updated doc, runValidators: apply schema rules
    );

    if (!student) {
      return res.status(404).json({
        error: 'Not Found',
        message: `No student found with ID "${req.params.id}".`,
      });
    }

    res.status(200).json({
      message: 'Student updated successfully.',
      student,
    });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────
// DELETE /students/:id — Delete a student
// ─────────────────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        error: 'Invalid ID',
        message: `"${req.params.id}" is not a valid student ID.`,
      });
    }

    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        error: 'Not Found',
        message: `No student found with ID "${req.params.id}".`,
      });
    }

    res.status(200).json({
      message: 'Student deleted successfully.',
      student,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
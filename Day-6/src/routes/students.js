const express = require('express');
const students = require('../store/students');

const router = express.Router();

// ─────────────────────────────────────────
// POST /students — Add a new student
// ─────────────────────────────────────────
router.post('/', (req, res, next) => {
  try {
    const { id, name, email, course, age } = req.body;

    // Handle missing required fields
    const missingFields = [];
    if (!id)     missingFields.push('id');
    if (!name)   missingFields.push('name');
    if (!email)  missingFields.push('email');
    if (!course) missingFields.push('course');

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing Fields',
        message: `The following fields are required: ${missingFields.join(', ')}`,
      });
    }

    // Handle invalid ID format
    if (typeof id !== 'string' && typeof id !== 'number') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'id must be a string or number.',
      });
    }

    // BONUS: Prevent duplicate IDs
    const duplicate = students.find((s) => String(s.id) === String(id));
    if (duplicate) {
      return res.status(409).json({
        error: 'Duplicate ID',
        message: `A student with ID "${id}" already exists.`,
      });
    }

    // Validate age if provided
    if (age !== undefined && (isNaN(age) || Number(age) <= 0)) {
      return res.status(400).json({
        error: 'Invalid Field',
        message: 'age must be a positive number.',
      });
    }

    const newStudent = {
      id: String(id),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      course: course.trim(),
      age: age ? Number(age) : null,
      createdAt: new Date().toISOString(),
    };

    students.push(newStudent);

    res.status(201).json({
      message: 'Student added successfully.',
      student: newStudent,
    });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────
// GET /students — Get all students
// ─────────────────────────────────────────
router.get('/', (req, res) => {
  res.status(200).json({
    total: students.length,
    students,
  });
});

// ─────────────────────────────────────────
// GET /students/:id — Get one student
// ─────────────────────────────────────────
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({
      error: 'Not Found',
      message: `No student found with ID "${id}".`,
    });
  }

  res.status(200).json({ student });
});

// ─────────────────────────────────────────
// PUT /students/:id — Update a student
// ─────────────────────────────────────────
router.put('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, course, age } = req.body;

    const student = students.find((s) => s.id === id);

    if (!student) {
      return res.status(404).json({
        error: 'Not Found',
        message: `No student found with ID "${id}".`,
      });
    }

    // Validate age if being updated
    if (age !== undefined && (isNaN(age) || Number(age) <= 0)) {
      return res.status(400).json({
        error: 'Invalid Field',
        message: 'age must be a positive number.',
      });
    }

    // Check that at least one field is being updated
    if (!name && !email && !course && age === undefined) {
      return res.status(400).json({
        error: 'Missing Fields',
        message: 'Provide at least one field to update: name, email, course, age.',
      });
    }

    // Apply updates
    if (name)   student.name   = name.trim();
    if (email)  student.email  = email.toLowerCase().trim();
    if (course) student.course = course.trim();
    if (age !== undefined) student.age = Number(age);
    student.updatedAt = new Date().toISOString();

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
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: `No student found with ID "${id}".`,
    });
  }

  const deleted = students.splice(index, 1)[0];

  res.status(200).json({
    message: 'Student deleted successfully.',
    student: deleted,
  });
});

module.exports = router;
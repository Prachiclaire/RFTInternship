// routes/students.js
// Maps each endpoint from the task sheet to its controller function

const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');

router.get('/', getAllStudents);        // GET    /students
router.get('/:id', getStudentById);     // GET    /students/:id
router.post('/', createStudent);        // POST   /students
router.put('/:id', updateStudent);      // PUT    /students/:id
router.delete('/:id', deleteStudent);   // DELETE /students/:id

module.exports = router;
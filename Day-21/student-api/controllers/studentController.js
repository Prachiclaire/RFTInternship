// controllers/studentController.js
// Contains the actual logic for each endpoint (GET, POST, PUT, DELETE)

const db = require('../data/students');

// GET /students - return all students
function getAllStudents(req, res) {
  res.status(200).json({
    count: db.students.length,
    data: db.students,
  });
}

// GET /students/:id - return a single student
function getStudentById(req, res) {
  const id = Number(req.params.id);
  const student = db.students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ error: `Student with id ${id} not found` });
  }

  res.status(200).json(student);
}

// POST /students - create a new student
function createStudent(req, res) {
  const { name, course, marks } = req.body;

  if (!name || !course) {
    return res.status(400).json({ error: 'name and course are required fields' });
  }

  const newStudent = {
    id: db.getNextId(),
    name,
    course,
    marks: marks ?? null,
  };

  db.students.push(newStudent);
  res.status(201).json(newStudent);
}

// PUT /students/:id - update an existing student
function updateStudent(req, res) {
  const id = Number(req.params.id);
  const student = db.students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ error: `Student with id ${id} not found` });
  }

  const { name, course, marks } = req.body;
  if (name !== undefined) student.name = name;
  if (course !== undefined) student.course = course;
  if (marks !== undefined) student.marks = marks;

  res.status(200).json(student);
}

// DELETE /students/:id - remove a student
function deleteStudent(req, res) {
  const id = Number(req.params.id);
  const index = db.students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Student with id ${id} not found` });
  }

  const deleted = db.students.splice(index, 1)[0];
  res.status(200).json({ message: 'Student deleted', student: deleted });
}

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
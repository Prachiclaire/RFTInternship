// data/students.js
// In-memory "database" (array) as suggested in the task:
// "For now, you can store the students in an array instead of a database."

let students = [
  { id: 1, name: 'Aarav Sharma', course: 'Backend Development', marks: 88 },
  { id: 2, name: 'Isha Verma', course: 'Frontend Development', marks: 92 },
  { id: 3, name: 'Rohan Mehta', course: 'Full Stack Development', marks: 75 },
];

// Keeps track of the next id to assign (simple auto-increment)
let nextId = 4;

module.exports = {
  students,
  getNextId: () => nextId++,
};
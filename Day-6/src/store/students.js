// In-memory student store seeded with sample data
const students = [
  {
    id: '1',
    name: 'Amit Sharma',
    email: 'amit@example.com',
    course: 'Computer Science',
    age: 20,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Riya Patel',
    email: 'riya@example.com',
    course: 'Information Technology',
    age: 21,
    createdAt: new Date().toISOString(),
  },
];

module.exports = students;
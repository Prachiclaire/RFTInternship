# Student Management API


A full CRUD REST API for managing student records using in-memory storage. Covers all five CRUD operations with proper error handling for invalid IDs, missing fields, and duplicate entries.


## Concepts Covered

- Full CRUD operations: Create, Read, Update, Delete
- RESTful route design
- Handling invalid IDs and missing required fields
- Preventing duplicate ID entries (bonus)
- Request logging and global error handling


## Project Structure

```
day6/
├── src/
│   ├── middleware/
│   │   ├── logger.js          # Request logger
│   │   └── errorHandler.js    # Global error handler
│   ├── routes/
│   │   └── students.js        # All CRUD routes
│   ├── store/
│   │   └── students.js        # In-memory student store
│   └── index.js               # Entry point
├── .env
├── .gitignore
└── package.json
```


## Setup

```bash
npm install
npm run dev
```

Create `.env`:
```
PORT=3000
```


## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /students | Add a new student |
| GET | /students | Get all students |
| GET | /students/:id | Get one student by ID |
| PUT | /students/:id | Update a student by ID |
| DELETE | /students/:id | Delete a student by ID |


## Student Object

```json
{
  "id": "3",
  "name": "John Doe",
  "email": "john@example.com",
  "course": "Computer Science",
  "age": 20,
  "createdAt": "2026-05-25T10:00:00.000Z"
}
```

Required fields for POST: `id`, `name`, `email`, `course`
Optional: `age`


## Request Examples

### Add Student
```
POST /students
Content-Type: application/json

{
  "id": "3",
  "name": "John Doe",
  "email": "john@example.com",
  "course": "Computer Science",
  "age": 20
}
```

### Get All Students
```
GET /students
```

### Get One Student
```
GET /students/1
```

### Update Student
```
PUT /students/1
Content-Type: application/json

{
  "course": "Data Science",
  "age": 21
}
```

### Delete Student
```
DELETE /students/1
```


## Error Handling

| Scenario | Status Code |
|----------|-------------|
| Missing required fields | 400 |
| Invalid age value | 400 |
| No fields provided for update | 400 |
| Student not found | 404 |
| Duplicate ID on POST | 409 |
| Internal server error | 500 |


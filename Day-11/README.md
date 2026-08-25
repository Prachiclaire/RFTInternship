# Student API with Database


Extends the Week 2 Student API by replacing in-memory storage with MongoDB. Uses Mongoose for schema definition, validation, and database operations. Includes pagination as a bonus.



## Concepts Covered

- Connecting Express to MongoDB using Mongoose
- Defining a schema and model
- Performing CRUD operations against a real database
- Handling MongoDB-specific errors (invalid ObjectId, duplicate key)
- Pagination using skip and limit


## What Changed From Day 6

| Day 6 | Day 11 |
|-------|--------|
| In-memory array | MongoDB database |
| Manual ID generation | MongoDB ObjectId |
| Data lost on restart | Data persists permanently |
| No schema enforcement | Mongoose schema with validation |
| No pagination | Bonus: ?page=1&limit=10 |


## Project Structure

```
day11/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   ├── logger.js          # Request logger
│   │   └── errorHandler.js    # Global error + Mongoose error handler
│   ├── models/
│   │   └── Student.js         # Mongoose schema and model
│   ├── routes/
│   │   └── students.js        # CRUD routes
│   └── index.js               # Entry point
├── .env                       # (create from .env.example)
├── .env.example
├── .gitignore
└── package.json
```


## Setup

### 1. Get a MongoDB URI

Go to https://cloud.mongodb.com, create a free cluster, then go to:
Connect > Drivers > copy the connection string.

It looks like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/studentdb
```

### 2. Create your .env file

```
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/studentdb?retryWrites=true&w=majority
```

### 3. Install and run

```bash
npm install
npm run dev
```

You should see:
```
[SERVER] Running on port 3000
[DATABASE] MongoDB connected: cluster0.xxxxx.mongodb.net
```


## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /students | Add a new student |
| GET | /students | Get all students (paginated) |
| GET | /students?page=2&limit=5 | Get page 2 with 5 per page |
| GET | /students/:id | Get one student by ID |
| PUT | /students/:id | Update a student |
| DELETE | /students/:id | Delete a student |



## Request Examples

### Add Student
```
POST /students
Content-Type: application/json

{
  "name": "Amit Sharma",
  "email": "amit@example.com",
  "course": "Computer Science",
  "age": 20
}
```

### Get All with Pagination (Bonus)
```
GET /students?page=1&limit=5
```

Response:
```json
{
  "total": 25,
  "page": 1,
  "limit": 5,
  "totalPages": 5,
  "hasNextPage": true,
  "hasPrevPage": false,
  "students": [...]
}
```


## Error Handling

| Scenario | Status |
|----------|--------|
| Missing required fields | 400 |
| Invalid MongoDB ObjectId | 400 |
| Mongoose schema validation failure | 400 |
| Duplicate email | 409 |
| Student not found | 404 |
| Internal server error | 500 |

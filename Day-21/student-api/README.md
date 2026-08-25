# Student Backend API — Day 21 (REST API Basics)

A simple REST API built with **Node.js + Express** that manages students in memory
(as an array — no database yet, per the task instructions).

Built for: **GOW AI Academy — Backend Internship — Day 21**

---

##  File Structure

```
student-api/
├── server.js                              # App entry point — starts Express, mounts routes
├── package.json                           # Project metadata & dependencies
├── .gitignore                             # Ignores node_modules, .env, logs
│
├── routes/
│   └── students.js                        # Maps HTTP verbs + paths -> controller functions
│
├── controllers/
│   └── studentController.js               # Business logic for each endpoint (CRUD)
│
├── data/
│   └── students.js                        # In-memory "database" (array of student objects)
│
├── public/
│   └── index.html                         # Challenge: frontend that fetch()es /students and renders a table
│
├── postman/
│   └── Student_API.postman_collection.json # Importable Postman collection with test assertions
│
└── README.md                              # This file
```

**Why this structure?**
- `routes/` only knows *which URL maps to which function* — no logic lives here.
- `controllers/` holds the actual request/response logic (the "C" in MVC).
- `data/` simulates a database layer so it's a one-line swap later (e.g. to MongoDB/MySQL).
- `public/` is served as static files by Express (`express.static`) for the fetch() challenge.
- `postman/` keeps the API test collection versioned alongside the code.

---

##  Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start
# or, for auto-restart on file changes during development:
npm run dev

# Server runs at:
http://localhost:3000
```

---

##  Endpoints

| Method | Endpoint         | Description              | Success | Error Codes         |
|--------|------------------|---------------------------|---------|----------------------|
| GET    | `/students`      | Get all students           | 200     | —                    |
| GET    | `/students/:id`  | Get one student by id      | 200     | 404 (not found)      |
| POST   | `/students`      | Create a new student       | 201     | 400 (missing fields) |
| PUT    | `/students/:id`  | Update an existing student | 200     | 404 (not found)      |
| DELETE | `/students/:id`  | Delete a student           | 200     | 404 (not found)      |

**Request body (POST / PUT)**
```json
{
  "name": "Priya Nair",
  "course": "DevOps",
  "marks": 81
}
```

---

##  Testing

###  Postman 
1. Open Postman → **Import** → select `postman/Student_API.postman_collection.json`.
2. Make sure the server is running (`npm start`).
3. Run each request, or click **Run collection** to execute all requests + assertions at once.
4. Each request includes a `Tests` script that checks the status code and response shape
   (e.g. "Status code is 200", "New student has an id").


###  Actual test run results (from this build)

| # | Request                              | Expected | Got  |
|---|---------------------------------------|----------|------|
| 1 | GET /students                         | 200      | 200  |
| 2 | GET /students/2                       | 200      | 200  |
| 3 | GET /students/999                     | 404      | 404  |
| 4 | POST /students (valid body)           | 201      | 201  |
| 5 | POST /students (missing name/course)  | 400      | 400  |
| 6 | PUT /students/1 (update marks)        | 200      | 200  |
| 7 | PUT /students/999                     | 404      | 404  |
| 8 | DELETE /students/3                    | 200      | 200  |
| 9 | GET / (frontend Challenge page)       | 200      | 200  |

All endpoints passed. Sample final state after the test run:
```json
{
  "count": 3,
  "data": [
    { "id": 1, "name": "Aarav Sharma", "course": "Backend Development", "marks": 95 },
    { "id": 2, "name": "Isha Verma", "course": "Frontend Development", "marks": 92 },
    { "id": 4, "name": "Priya Nair", "course": "DevOps", "marks": 81 }
  ]
}
```

---

# Challenge — Frontend + fetch()

`public/index.html` is served automatically at `http://localhost:3000/` and:
1. Calls `fetch('/students')` on page load.
2. Parses the JSON response.
3. Renders the students in an HTML table (id, name, course, marks).

This satisfies: *"Connect your frontend to the API using JavaScript fetch() and
display the students on the webpage."*

---


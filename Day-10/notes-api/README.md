# Notes API (Mini System) 

A Notes REST API built with **Node.js** and **Express.js**, combining full CRUD with validation, search, and sorting.

## Getting Started

### Install dependencies
```bash
npm install
```

### Run the server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

Server runs on: `http://localhost:3000`


## Project Structure

```
notes-api/
├── index.js
├── package.json
├── .gitignore
├── README.md
└── src/
    ├── routes/
    │   └── notes.js
    ├── controllers/
    │   └── noteController.js
    ├── models/
    │   └── noteModel.js
    └── utils/
        └── validators.js
```


## API Endpoints

### Core Features

| Method | Endpoint    | Description       |
|--------|-------------|---------------------|
| POST   | /notes      | Add a new note      |
| GET    | /notes      | Get all notes        |
| GET    | /notes/:id  | Get a single note    |
| PUT    | /notes/:id  | Update a note         |
| DELETE | /notes/:id  | Delete a note         |

### Bonus Features

| Method | Endpoint                              | Description                          |
|--------|----------------------------------------|---------------------------------------|
| GET    | /notes?search=keyword                  | Search notes by keyword (title/content) |
| GET    | /notes?sortBy=title&order=asc          | Sort notes by field and order         |

Valid `sortBy` values: `title`, `createdAt`, `updatedAt`
Valid `order` values: `asc`, `desc` (defaults to `asc`)

---

## Note Data Format

```json
{
  "id": 1,
  "title": "Meeting",
  "content": "Discuss project",
  "createdAt": "2026-06-28T00:00:00.000Z",
  "updatedAt": "2026-06-28T00:00:00.000Z"
}
```


## Request Examples

### Add Note
POST /notes
```json
{
  "title": "Groceries",
  "content": "Buy milk and bread"
}
```

### Update Note
PUT /notes/1
```json
{
  "content": "Discuss Q3 roadmap"
}
```

### Search Notes
```
GET /notes?search=meeting
```

### Sort Notes
```
GET /notes?sortBy=title&order=desc
```


## Features Implemented

- Add note (title, content required and validated)
- Get all notes
- Get single note by ID
- Update note (partial updates supported)
- Delete note
- Search notes by keyword across title and content, case-insensitive (Bonus)
- Sort notes by title, createdAt, or updatedAt, ascending or descending (Bonus)
- Timestamps on create and update
- Clear validation and 404 error handling


## Concepts Covered
- Combining CRUD + Validation
- System-Like Thinking


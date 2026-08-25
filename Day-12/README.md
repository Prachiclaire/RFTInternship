# Blog API — Day 12 | GOW AI Academy Backend Internship

A RESTful Blog API built with **Node.js** and **Express.js**.

## 🚀 Getting Started

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

---

## 📂 Project Structure

```
blog-api/
├── index.js                  # Entry point
├── routes/
│   └── posts.js              # Post routes
├── controllers/
│   └── postController.js     # Business logic
├── models/
│   └── postModel.js          # In-memory data store
├── package.json
└── README.md
```

---

## 🔗 API Endpoints

### Core Features

| Method | Endpoint      | Description       |
|--------|---------------|-------------------|
| GET    | /posts        | Get all posts     |
| GET    | /posts/:id    | Get single post   |
| POST   | /posts        | Create a post     |

### Bonus Features

| Method | Endpoint      | Description       |
|--------|---------------|-------------------|
| PUT    | /posts/:id    | Update a post     |
| DELETE | /posts/:id    | Delete a post     |

---

## 📝 Sample Data Format

```json
{
  "id": 1,
  "title": "MY BLOG",
  "content": "HELLO WORLD",
  "createdAt": "2026-05-25T00:00:00.000Z",
  "updatedAt": "2026-05-25T00:00:00.000Z"
}
```

---

## 📌 Concepts Covered
- Structured Data
- Basic Relationships
- Persistent Content Systems (in-memory)
- CRUD Operations
- Timestamps (createdAt / updatedAt)

---


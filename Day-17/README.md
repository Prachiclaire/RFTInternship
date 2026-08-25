# Blog System with Users - Day 17 | GOW AI Academy Backend Internship

A multi-entity Blog System REST API built with **Node.js**, **Express.js**, **bcryptjs**, and **JWT**.

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

---

## Project Structure

```
blog-system/
├── index.js
├── package.json
├── .gitignore
├── README.md
└── src/
    ├── routes/
    │   ├── auth.js
    │   ├── posts.js
    │   └── comments.js
    ├── controllers/
    │   ├── authController.js
    │   ├── postController.js
    │   └── commentController.js
    ├── models/
    │   └── db.js
    └── middleware/
        └── authMiddleware.js
```

---

## API Endpoints

### Auth

| Method | Endpoint        | Access  | Description          |
|--------|-----------------|---------|----------------------|
| POST   | /auth/register  | Public  | Register a new user  |
| POST   | /auth/login     | Public  | Login and get token  |

### Posts

| Method | Endpoint              | Access      | Description               |
|--------|-----------------------|-------------|---------------------------|
| GET    | /posts                | Public      | Fetch all posts            |
| GET    | /posts/:id            | Public      | Fetch single post          |
| GET    | /posts/user/:userId   | Public      | Fetch posts by user        |
| POST   | /posts                | Auth        | User creates a post        |
| PUT    | /posts/:id            | Owner only  | Edit own post (Bonus)      |
| DELETE | /posts/:id            | Owner only  | Delete own post (Bonus)    |

### Comments (Bonus)

| Method | Endpoint              | Access  | Description                  |
|--------|-----------------------|---------|------------------------------|
| GET    | /comments/:postId     | Public  | Get all comments for a post  |
| POST   | /comments/:postId     | Auth    | Add a comment to a post      |

---

## Request Examples

### Register
POST /auth/register
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

### Create Post (requires Bearer token in Authorization header)
POST /posts
```json
{
  "title": "My First Post",
  "content": "Hello World from the blog system!"
}
```

### Add Comment (requires Bearer token)
POST /comments/1
```json
{
  "content": "Great post!"
}
```

---

## Features Implemented

- User registration and login with JWT authentication
- User creates posts linked to their account (User -> Post relationship)
- Fetch all posts
- Fetch posts by a specific user
- Edit and delete only by the post owner (403 if not owner)
- Comments system linked to posts and users (Bonus)
- Password hashing with bcryptjs
- JWT token-based auth with protected routes

---

## Concepts Covered
- Relationships (User -> Post -> Comment)
- Multi-Entity System
- Linking Data
- Owner-based Access Control

---

#gowaiacademy #rftinternship
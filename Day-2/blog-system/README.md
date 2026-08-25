# Blog System with Users


A REST API for a blog platform with user authentication, post management, comments, and owner-based access control. Built on top of the Day 1 authentication system.


## Features

- User registration and login with JWT
- Create, read, update, and delete blog posts
- Fetch all posts or filter by user
- Comments system on posts
- Edit and delete restricted to the resource owner
- Unauthorized access handled with proper HTTP status codes


## Project Structure

blog-system/
├── src/
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js          # Register and login
│   │   ├── posts.js         # Post CRUD routes
│   │   └── comments.js      # Comment routes
│   ├── store.js             # In-memory data store
│   └── index.js             # Entry point
├── .env
├── .gitignore
└── package.json


## Setup

```bash
npm install
```

Create a `.env` file in the root:

```
PORT=3000
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1h
```

```bash
npm run dev
```

---

## API Reference

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and receive JWT token |

### Posts

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | /api/posts | Yes | Create a new post |
| GET | /api/posts | No | Fetch all posts |
| GET | /api/posts/:id | No | Fetch a single post with comments |
| GET | /api/posts/user/:userId | No | Fetch posts by a specific user |
| PUT | /api/posts/:id | Yes (owner) | Edit a post |
| DELETE | /api/posts/:id | Yes (owner) | Delete a post |

### Comments

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | /api/comments/:postId | Yes | Add a comment to a post |
| DELETE | /api/comments/:id | Yes (owner) | Delete a comment |

---

## Request Examples

### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john",
  "email": "john@example.com",
  "password": "secret123"
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secret123"
}
```

### Create Post
```
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Post",
  "content": "This is the body of the post."
}
```

### Add Comment
```
POST /api/comments/<postId>
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Great post!"
}
```

---

## Data Relationships

```
User
 └── has many Posts
       └── has many Comments
             └── belongs to User
```

---


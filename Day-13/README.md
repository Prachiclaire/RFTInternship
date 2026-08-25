# User Authentication with Database - Day 13 | GOW AI Academy Backend Internship

A User Authentication REST API built with **Node.js**, **Express.js**, **bcryptjs**, and **JWT**.

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
user-auth/
├── index.js                        # Entry point
├── routes/
│   └── auth.js                     # Auth routes
├── controllers/
│   └── authController.js           # Register & login logic
├── models/
│   └── userModel.js                # In-memory user store
├── middleware/
│   └── authMiddleware.js           # JWT protect middleware
├── package.json
└── README.md
```

---

## API Endpoints

| Method | Endpoint      | Access    | Description               |
|--------|---------------|-----------|---------------------------|
| POST   | /auth/register | Public   | Register a new user       |
| POST   | /auth/login    | Public   | Login and receive token   |
| GET    | /auth/me       | Protected | Get logged-in user info  |

---

## Request & Response Examples

### Register
POST /auth/register

Request body:
```json
{
  "email": "user@example.com",
  "password": "mypassword"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "<jwt_token>",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "createdAt": "2026-05-25T00:00:00.000Z"
  }
}
```

### Login
POST /auth/login

Request body:
```json
{
  "email": "user@example.com",
  "password": "mypassword"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "<jwt_token>",
  "user": {
    "id": "1",
    "email": "user@example.com"
  }
}
```

### Get Current User (Protected)
GET /auth/me

Header:
```
Authorization: Bearer <jwt_token>
```

---

## Features Implemented

- Register user with email and password
- Login user with validation
- Handle duplicate user registration (409 conflict)
- Handle invalid login credentials (401 unauthorized)
- Hash passwords using bcryptjs (Bonus)
- Return JWT token on register and login (Bonus)
- Protected route using JWT middleware (Bonus)

---

## Concepts Covered
- Secure Storage
- Auth Flow
- Real Authentication Flow
- Password Hashing with bcrypt
- Token-based Authentication with JWT

---


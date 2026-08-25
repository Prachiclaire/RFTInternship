# Login & Register API (Basic Auth Logic) 

A Login and Register REST API built with **Node.js** and **Express.js**.

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
login-register-api/
├── index.js
├── package.json
├── .gitignore
├── README.md
└── src/
    ├── routes/
    │   └── auth.js
    ├── controllers/
    │   └── authController.js
    ├── models/
    │   └── userModel.js
    └── utils/
        └── validators.js
```


## API Endpoints

| Method | Endpoint   | Description           |
|--------|------------|------------------------|
| POST   | /register  | Register a new user   |
| POST   | /login     | Login an existing user |


## Request & Response Examples

### Register
POST /register
```json
{
  "email": "user@example.com",
  "password": "mypassword"
}
```

Success response (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2026-06-28T00:00:00.000Z"
  }
}
```

### Login
POST /login
```json
{
  "email": "user@example.com",
  "password": "mypassword"
}
```

Success response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```


## Validation Rules

- Email and password are required on both endpoints
- Email must match a valid email format
- Password must be at least 6 characters long

## Error Responses

| Status | Scenario                          |
|--------|------------------------------------|
| 400    | Missing fields, invalid email, or password too short |
| 401    | Login with wrong email or password |
| 409    | Register with an email that already exists |



## Features Implemented

- Register user with email and password
- Login user with credential check
- Email format validation
- Password length validation
- Prevent duplicate user registration (Bonus)
- Proper, descriptive error messages for every failure case (Bonus)
- Users stored in memory


## Concepts Covered
- Validation
- Authentication Basics
- Authentication Flow


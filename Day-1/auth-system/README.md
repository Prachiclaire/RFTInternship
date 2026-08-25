# Full Authentication System

A secure REST API with Node.js, Express.js, MongoDB, JWT , bcrypt for user authentication and authorization.

##  Features
- User  Registration
- User Login
- JWT Authentication
- Protected Routes
- Password Hashing using bcrypt
- Middleware-based Authorization
- Error Handling

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT
- bcrypt
- dotenv

## Project Structure

src/
├── controllers/
├── routes/
├── middleware/auth.js
|--index.js

## Installation

npm install

cp .env.example .env

npm run dev

## API Endpoints

POST /api/register

POST /api/login

GET /api/profile

## Future Improvements

- Refresh Tokens
- Email Verification
- Password Reset
- Unit Testing

## What I Learned

- JWT Authentication
- Password Hashing
- Express Middleware
- REST API Design
- Environment Variables
- **POST /api/register** — Register a new user
- **POST /api/login** — Login and receive a JWT token
- **GET /api/profile** — Protected route (requires valid token)



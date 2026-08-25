# User Info API — In-Memory Storage

A simple REST API that retrieves user data from an in-memory array. Focuses on data retrieval, GET request handling, and proper error responses.

## Concepts Covered

- In-memory data storage using arrays
- GET request handling in Express
- Route parameters (`:id`)
- Error handling for missing or invalid resources


## Project Structure

```
day3/
├── src/
│   ├── routes/
│   │   └── users.js     # GET /users and GET /users/:id
│   └── index.js         # Entry point
├── .env
├── .gitignore
└── package.json
```

## Setup

```bash
npm install
npm run dev
```

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /users | Return all users |
| GET | /users/:id | Return a specific user by ID |


## Request Examples

### Get all users
```
GET http://localhost:3000/users
```

Response:
```json
{
  "total": 2,
  "users": [
    { "id": 1, "name": "Amit" },
    { "id": 2, "name": "Riya" }
  ]
}
```

### Get user by ID
```
GET http://localhost:3000/users/1
```

Response:
```json
{
  "user": { "id": 1, "name": "Amit" }
}
```

### User not found (Bonus)
```
GET http://localhost:3000/users/99
```

Response:
```json
{
  "error": "User with ID 99 not found"
}
```

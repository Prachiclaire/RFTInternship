# API Tester — Mini System


A small API system combining multiple routes from previous days into one organized project. Includes logging middleware and structured error responses.


## Concepts Covered

- Multiple routes organized in separate files
- Clean API structure with a central entry point
- Request logging middleware (method, URL, status, response time)
- Descriptive error responses for invalid inputs

## Tech Stack

- Node.js
- Express.js
- JavaScript
- dotenv

## Project Structure

```
day5/
├── src/
│   ├── middleware/
│   │   └── logger.js        # Logs every request to the console
│   ├── routes/
│   │   ├── hello.js         # GET /hello
│   │   ├── calculate.js     # GET /calculate
│   │   ├── users.js         # GET /users, GET /users/:id, POST /users
│   │   └── quote.js         # GET /quote
│   └── index.js             # Entry point, mounts all routes
├── .env
├── .gitignore
└── package.json
```

## Setup

```bash
npm install
npm run dev
```

Create a `.env` file:
```
PORT=3000
```

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Lists all available endpoints |
| GET | /hello | Returns a greeting |
| GET | /hello?name=John | Returns a personalized greeting |
| GET | /calculate?a=10&b=5&op=add | Performs a calculation |
| GET | /users | Returns all users |
| GET | /users/:id | Returns a specific user by ID |
| POST | /users | Adds a new user |
| GET | /quote | Returns a random quote |

Supported operations for `/calculate`: `add`, `subtract`, `multiply`, `divide`

## Logging Output (Bonus)

Every request prints to the terminal:

```
[2026-05-24T10:30:00.000Z] GET /calculate?a=10&b=5&op=add — Status: 200 — 3ms
[2026-05-24T10:30:02.000Z] GET /users/99 — Status: 404 — 1ms
```

## Error Responses (Bonus)

All invalid requests return structured JSON errors with descriptive messages. Example:

```json
{
  "error": "Missing parameters",
  "message": "Provide query params: a (number), b (number), op (add | subtract | multiply | divide)",
  "example": "/calculate?a=10&b=5&op=add"
}
```


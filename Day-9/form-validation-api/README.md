# Form Validation API 

A Form Validation REST API built with **Node.js** and **Express.js**, focused on defensive programming and detailed error reporting.

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
form-validation-api/
├── index.js
├── package.json
├── .gitignore
├── README.md
└── src/
    ├── routes/
    │   └── form.js
    ├── controllers/
    │   └── formController.js
    └── utils/
        └── validators.js
```


## API Endpoint

| Method | Endpoint  | Description           |
|--------|-----------|------------------------|
| POST   | /submit   | Validate and submit a form |


## Request & Response Examples

### Valid Submission
POST /submit
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 25
}
```

Success response (200):
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 25
  }
}
```

### Invalid Submission (all errors returned at once)
POST /submit
```json
{
  "name": "",
  "email": "notanemail",
  "age": 200
}
```

Error response (400):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "name",  "message": "Name is required and cannot be empty" },
    { "field": "email", "message": "A valid email address is required" },
    { "field": "age",   "message": "Age must be a whole number between 5 and 100" }
  ]
}
```


## Validation Rules

| Field | Rule                                |
|-------|--------------------------------------|
| name  | Required, must not be empty/whitespace |
| email | Required, must match valid email format |
| age   | Required, must be a whole number between 5 and 100 |



## Features Implemented

- POST /submit endpoint accepting name, email, and age
- Name validation: not empty
- Email validation: valid format
- Age validation: range 5-100, whole numbers only
- Returns success response with cleaned data on valid input
- Returns ALL validation errors at once instead of stopping at the first failure (Bonus)
- Clear, field-specific error messages



## Concepts Covered
- Input Validation
- Error Responses
- Defensive Programming


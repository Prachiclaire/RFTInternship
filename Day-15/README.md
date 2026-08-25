# Search API (Database Querying) - Day 15 | GOW AI Academy Backend Internship

A Search and Filtering REST API built with **Node.js** and **Express.js**.

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
search-api/
├── index.js
├── package.json
├── .gitignore
├── README.md
└── src/
    ├── routes/
    │   └── search.js
    ├── controllers/
    │   └── searchController.js
    └── models/
        └── db.js
```

---

## API Endpoints

### Search Products

| Method | Endpoint    | Query Params                              | Description                  |
|--------|-------------|-------------------------------------------|------------------------------|
| GET    | /search     | name                                      | Search products by name      |
| GET    | /search     | category                                  | Filter by category           |
| GET    | /search     | minPrice, maxPrice                        | Filter by price range        |
| GET    | /search     | name, category, minPrice, maxPrice        | Multiple filters combined    |

### Search Users

| Method | Endpoint         | Query Params        | Description                  |
|--------|------------------|---------------------|------------------------------|
| GET    | /search/users    | name                | Search users by name         |
| GET    | /search/users    | email               | Search users by email        |
| GET    | /search/users    | role                | Filter users by role         |
| GET    | /search/users    | name, email, role   | Multiple filters combined    |

### Search Posts

| Method | Endpoint         | Query Params        | Description                  |
|--------|------------------|---------------------|------------------------------|
| GET    | /search/posts    | title               | Search posts by title        |
| GET    | /search/posts    | author              | Search posts by author       |
| GET    | /search/posts    | title, author       | Multiple filters combined    |

---

## Example Requests

```
GET /search?name=phone
GET /search?name=phone&category=electronics
GET /search?minPrice=500&maxPrice=5000
GET /search?category=electronics&minPrice=1000&maxPrice=30000

GET /search/users?name=john
GET /search/users?email=gmail
GET /search/users?name=john&role=admin

GET /search/posts?title=hello
GET /search/posts?title=hello&author=john
```

---

## Example Response

```json
{
  "success": true,
  "query": { "name": "phone" },
  "count": 2,
  "data": [
    { "id": 1, "name": "Phone",      "category": "electronics", "price": 15000, "quantity": 20 },
    { "id": 8, "name": "Phone Case", "category": "accessories", "price": 300,   "quantity": 100 }
  ]
}
```

---

## Features Implemented

- Search products, users, and posts from in-memory DB
- Case-insensitive partial match search (Bonus)
- Multiple filters combined in one request (Bonus)
- Price range filtering with minPrice and maxPrice
- Returns count of matched results with query echo

---

## Concepts Covered
- Database Querying
- Filtering
- Efficient Data Retrieval
- Query Parameters

---

#gowaiacademy #rftinternship
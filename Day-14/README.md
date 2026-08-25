# Inventory Management API - Day 14 | GOW AI Academy Backend Internship

A RESTful Inventory Management API built with **Node.js** and **Express.js**.

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
inventory-api/
├── index.js
├── package.json
├── .gitignore
├── README.md
└── src/
    ├── routes/
    │   └── products.js
    ├── controllers/
    │   └── productController.js
    └── models/
        └── productModel.js
```

---

## API Endpoints

### Core Features

| Method | Endpoint               | Description                      |
|--------|------------------------|----------------------------------|
| GET    | /products              | Get all products                 |
| GET    | /products?sort=asc     | Get products sorted by price asc |
| GET    | /products?sort=desc    | Get products sorted by price desc|
| GET    | /products/:id          | Get single product               |
| POST   | /products              | Add a new product                |
| PATCH  | /products/:id/quantity | Update product quantity          |
| DELETE | /products/:id          | Delete a product                 |

### Bonus Features

| Method | Endpoint              | Description                      |
|--------|-----------------------|----------------------------------|
| GET    | /products/low-stock   | Get products with quantity <= 5  |

---

## Product Data Format

```json
{
  "id": 1,
  "name": "Laptop",
  "price": 75000,
  "quantity": 10,
  "lowStockAlert": false,
  "createdAt": "2026-05-25T00:00:00.000Z",
  "updatedAt": "2026-05-25T00:00:00.000Z"
}
```

---

## Request Examples

### Add Product
POST /products
```json
{
  "name": "Monitor",
  "price": 12000,
  "quantity": 8
}
```

### Update Quantity
PATCH /products/1/quantity
```json
{
  "quantity": 20
}
```

---

## Features Implemented

- Add product with name, price, and quantity
- Update product quantity
- Delete product
- Get all products
- Input validation and error handling
- Low stock alert flag on every product response (quantity <= 5)
- Dedicated low stock endpoint (Bonus)
- Sort by price ascending or descending via query param (Bonus)
- Timestamps on create and update

---

## Concepts Covered
- Database Queries (simulated with in-memory store)
- Real-World Modeling
- Business Logic
- RESTful API Design

---

#gowaiacademy #rftinternship
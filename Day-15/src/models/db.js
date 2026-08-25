// In-memory database (acts like a DB with multiple collections/tables)

const products = [
  { id: 1, name: 'Phone',        category: 'electronics', price: 15000, quantity: 20 },
  { id: 2, name: 'Smartphone',   category: 'electronics', price: 25000, quantity: 10 },
  { id: 3, name: 'Laptop',       category: 'electronics', price: 75000, quantity: 5  },
  { id: 4, name: 'Headphones',   category: 'electronics', price: 2000,  quantity: 50 },
  { id: 5, name: 'Desk Chair',   category: 'furniture',   price: 8000,  quantity: 8  },
  { id: 6, name: 'Wooden Table', category: 'furniture',   price: 12000, quantity: 3  },
  { id: 7, name: 'Notebook',     category: 'stationery',  price: 100,   quantity: 200},
  { id: 8, name: 'Phone Case',   category: 'accessories', price: 300,   quantity: 100}
];

const users = [
  { id: 1, name: 'John Doe',     email: 'john@gmail.com',    role: 'admin'  },
  { id: 2, name: 'Jane Smith',   email: 'jane@yahoo.com',    role: 'user'   },
  { id: 3, name: 'Johnny Bravo', email: 'johnny@gmail.com',  role: 'user'   },
  { id: 4, name: 'Alice Paul',   email: 'alice@outlook.com', role: 'user'   },
  { id: 5, name: 'Bob Johnson',  email: 'bob@gmail.com',     role: 'editor' }
];

const posts = [
  { id: 1, title: 'Hello World',         content: 'My first post',          author: 'John Doe'   },
  { id: 2, title: 'Hello Node.js',       content: 'Learning backend dev',   author: 'Jane Smith' },
  { id: 3, title: 'Express Guide',       content: 'How to build REST APIs', author: 'John Doe'   },
  { id: 4, title: 'Database Querying',   content: 'Filtering and searching', author: 'Alice Paul' },
  { id: 5, title: 'Hello Express',       content: 'Getting started',         author: 'Bob Johnson'}
];

module.exports = { products, users, posts };
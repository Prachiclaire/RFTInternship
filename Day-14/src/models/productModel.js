// In-memory products store (acts like a database)
let products = [
  { id: 1, name: 'Laptop',   price: 75000, quantity: 10, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 2, name: 'Mouse',    price: 500,   quantity: 3,  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 3, name: 'Keyboard', price: 1200,  quantity: 0,  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

let nextId = 4;

const LOW_STOCK_THRESHOLD = 5;

const getAll = () => products;

const getById = (id) => products.find(p => p.id === parseInt(id));

const create = ({ name, price, quantity }) => {
  const product = {
    id: nextId++,
    name,
    price: parseFloat(price),
    quantity: parseInt(quantity),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  products.push(product);
  return product;
};

const updateQuantity = (id, quantity) => {
  const index = products.findIndex(p => p.id === parseInt(id));
  if (index === -1) return null;
  products[index].quantity = parseInt(quantity);
  products[index].updatedAt = new Date().toISOString();
  return products[index];
};

const remove = (id) => {
  const index = products.findIndex(p => p.id === parseInt(id));
  if (index === -1) return null;
  const deleted = products[index];
  products.splice(index, 1);
  return deleted;
};

const getLowStock = () => products.filter(p => p.quantity <= LOW_STOCK_THRESHOLD);

const getSortedByPrice = (order = 'asc') => {
  return [...products].sort((a, b) =>
    order === 'desc' ? b.price - a.price : a.price - b.price
  );
};

const isLowStock = (product) => product.quantity <= LOW_STOCK_THRESHOLD;

module.exports = { getAll, getById, create, updateQuantity, remove, getLowStock, getSortedByPrice, isLowStock };
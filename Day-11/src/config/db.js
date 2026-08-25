const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[DATABASE] MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`[DATABASE] Connection failed: ${err.message}`);
    process.exit(1); // Exit process if DB connection fails
  }
};

module.exports = connectDB;
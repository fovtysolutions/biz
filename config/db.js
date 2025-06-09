require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // No options needed
    console.log("MongoDB connection success!");
  } catch (err) {
    console.log("MongoDB connection failed!", err.message);
    // Exit the process with failure
    process.exit(1);
  }
};

module.exports = {
  connectDB,
};

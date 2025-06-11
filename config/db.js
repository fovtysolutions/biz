require("dotenv").config();
const mongoose = require("mongoose");

let mongoStatus = {
  connected: false,
  message: "MongoDB not connected",
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // No options needed
    mongoStatus.message = `MongoDB Connected: MongoDB connection success!`;
    console.log("MongoDB connection success!");
  } catch (err) {
    console.log("MongoDB connection failed!", err.message);
    mongoStatus.message = `MongoDB Connected: ${err.message}`;
    // Exit the process with failure
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  mongoStatus
};

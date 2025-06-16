const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URL);
    console.log("Connected to MongoDB with Mongoose");
  } catch (error) {
    console.error("Error connecting to MongoDB with Mongoose:", error);
    process.exit(1);
  }
};

module.exports = connectDB;

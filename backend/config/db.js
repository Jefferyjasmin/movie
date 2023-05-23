const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGO_URI;
console.log("this is the uri", { uri });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected ${conn.connection.host} `);
  } catch (error) {
    console.log("this is the error=>", error);
    process.exit(1);
  }
};

module.exports = connectDB;

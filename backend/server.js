const express = require("express");
const path = require("path");
const connectDB = require("./config/db");

require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const userRoutes = require("./routes/userRoutes");
const app = express();

const { errorHandler } = require("./middleware/errorMiddleware");

// connecting to db

connectDB();
//middleWare
// this is need to read body data
//which is part of req object which is sent by front end
// body parser for json objects
app.use(cors());
app.use(express.json());
// urlencoded
app.use(express.urlencoded({ extended: false }));
//middleWare
//  target: "http://localhost:5000"
// [ "https://goal-setter-rest-api-backend.onrender.com"
// module.exports = function (app) {
//   app.use(
//     createProxyMiddleware(["/api/goals", "/api/users"], {
//       target: "http://localhost:5000",
//     })
//   );
// };
//  backend/server.js

app.use("/api/users", userRoutes);

/// serve frontend

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "build", "index.html")
    );
  });
} else {
  app.get("/", (req, res) => {
    res.send("Please set to production");
  });
}
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server Started on localhost:${port} `);
});

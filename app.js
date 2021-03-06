const express = require("express");
const app = express();
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");

// Added .ENV configuration
dotenv.config();

// Added path for saving images and accessing them
app.use("/uploads", express.static("./uploads"));

// Config for logging request to API
app.use(morgan("dev"));

// JSON parsing from request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS Handling
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // If the 'user' asks for OPTIONS which are allowed on this API
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }

  next();
});

// Connect MongoDB
mongoose.connect(process.env.MONGOURI);

// Routes for handling requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

// If this is reached then no file in above lines was able to handle this request
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// This handles all errors thrown by some operations
app.use((error, req, res, next) => {
  res.status(error.status);

  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;

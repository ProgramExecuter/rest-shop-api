const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");
const checkAuth = require("../middleware/checkAuth");

// Import Controllers
const {
  getAllOrders,
  addNewOrder,
  getParticularProduct,
  deleteOrder,
} = require("../controllers/orders");

//
// Get all Orders
router.get("/", checkAuth, getAllOrders);

//
// Add a new Order
router.post("/", checkAuth, addNewOrder);

//
// Get a particular product
router.get("/:orderId", checkAuth, getParticularProduct);

//
// Delete a particular order
router.delete("/:orderId", checkAuth, deleteOrder);

module.exports = router;

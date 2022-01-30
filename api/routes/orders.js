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
router.delete("/:orderId", checkAuth, (req, res, next) => {
  // Remove a particular product from DB
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then((result) => {
      res.status(200).json({ message: "Order Cancelled Successfully" });
    })
    .catch((err) => {
      console.log(err);

      res.status(500).json({ error: err });
    });
});

module.exports = router;

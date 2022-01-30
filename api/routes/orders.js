const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");
const checkAuth = require("../middleware/checkAuth");

// Import Controllers
const { getAllOrders, addNewOrder } = require("../controllers/orders");

//
// Get all Orders
router.get("/", checkAuth, getAllOrders);

//
// Add a new Order
router.post("/", checkAuth, addNewOrder);

//
// Get a particular product
router.get("/:orderId", checkAuth, (req, res, next) => {
  // Fetch the order from DB
  Order.findById(req.params.orderId)
    .select("_id product quantity")
    .populate("product", "name price")
    .exec()
    .then((order) => {
      // If the Order doesn't exist
      if (!order) {
        res.status(404).json({ message: "Order not found" });
      }

      // Response structure
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: `http://localhost:3000/orders/${order._id}`,
        },
      });
    })
    .catch((err) => {
      console.log(err);

      res.status(500).json({ error: err });
    });
});

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

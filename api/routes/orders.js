const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");

//
// Get all Orders
router.get("/", (req, res, next) => {
  Order.find()
    .select("product _id quantity")
    .exec()
    .then((docs) => {
      // Structure and data of all products
      const orders = docs.map((doc) => {
        return {
          _id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
          request: {
            type: "GET",
            url: `http://localhost:3000/orders/${doc._id}`,
          },
        };
      });

      // Structure of response
      res.status(200).json({
        count: docs.length,
        orders: orders,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

//
// Add a new Order
router.post("/", (req, res, next) => {
  // Check if given product exist
  Product.findById(req.body.productId)
    .then((product) => {
      // If the product doesn't exist then return error
      if (!product) {
        res.status(404).json({ message: "Product not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
  //
  //Reaching here means product exist

  // Creating the new order object
  const order = new Order({
    _id: mongoose.Types.ObjectId(),
    quantity: req.body.quantity,
    product: req.body.productId,
  });

  // Saving new Order
  order
    .save()
    .then((result) => {
      // Response structure
      res.status(200).json({
        message: "New Order Received",
        createdOrder: {
          _id: result._id,
          quantity: result.quantity,
          product: result.product,
        },
        request: {
          type: "GET",
          url: `http://localhost:3000/orders/${result._id}`,
        },
      });
    })
    .catch((err) => {
      error: err;
    });
});

//
// Get a particular product
router.get("/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId)
    .select("_id product quantity")
    .exec()
    .then((order) => {
      // If the order doesn't exist
      if (!order) {
        res.status(404).json({ error: err });
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
      res.status(500).json({ error: err });
    });
});

//
// Delete a particular order
router.delete("/:orderId", (req, res, next) => {
  // Remove a particular product
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then((result) => {
      res.status(200).json({ message: "Order Cancelled Successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;

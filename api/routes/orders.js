const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");

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
            url: `localhost:3000/orders/${doc._id}`,
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
  // Creating the new order object
  const order = new Order({
    _id: mongoose.Types.ObjectId(),
    quantity: req.body.quantity,
    product: req.body.productId,
  });

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
          url: `localhost:3000/orders/${result._id}`,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.get("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: `GET ${req.params.orderId}`,
  });
});

router.delete("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: `Deleted order ${req.params.orderId}`,
  });
});

module.exports = router;

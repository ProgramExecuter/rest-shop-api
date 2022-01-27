const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "GET /orders",
  });
});

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
      console.log(result);

      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);

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

const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "GET /orders",
  });
});

router.post("/", (req, res, next) => {
  // Creating the new order object
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity,
  };

  res.status(200).json({
    message: "POST /orders",
    newOrder: order,
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

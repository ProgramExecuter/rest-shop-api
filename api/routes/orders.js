const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "GET /orders",
  });
});

router.post("/", (req, res, next) => {
  res.status(200).json({
    message: "POST /orders",
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

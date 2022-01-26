const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "GET /products",
  });
});

router.post("/", (req, res, next) => {
  res.status(200).json({
    message: "POST /products",
  });
});

router.get("/:productId", (req, res, next) => {
  res.status(200).json({
    message: `GET ${req.params.productId}`,
  });
});

router.patch("/:productId", (req, res, next) => {
  res.status(200).json({
    message: `Updated product ${req.params.productId}`,
  });
});

router.delete("/:productId", (req, res, next) => {
  res.status(200).json({
    message: `Deleted ${req.params.productId}`,
  });
});

module.exports = router;

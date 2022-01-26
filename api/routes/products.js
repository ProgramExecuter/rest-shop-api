const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/product");

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "GET /products",
  });
});

router.post("/", (req, res, next) => {
  // Creating the new product object
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });

  // Store this in DB
  product
    .save()
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

  res.status(201).json({
    message: "POST /products",
    createdProduct: product,
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

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/product");

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "GET /products",
  });
});

//
// Add a new product
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
    .then((doc) => {
      console.log(doc);

      res.status(201).json({
        message: "New Product Added",
        createdProduct: product,
      });
    })
    .catch((err) => {
      console.log(err);

      res.status(500).json({ error: err });
    });
});

//
// Get a particular product
router.get("/:productId", (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .exec()
    .then((doc) => {
      console.log(doc);

      // Check if the product exist
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "No Product Found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
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

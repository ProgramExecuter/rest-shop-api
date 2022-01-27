const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/product");

//
// Get a list of products
router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id")
    .exec()
    .then((docs) => {
      // Products structure and data
      const products = docs.map((doc) => {
        return {
          name: doc.name,
          price: doc.price,
          _id: doc._id,
          request: {
            type: "GET",
            url: `http://localhost:3000/products/${doc._id}`,
          },
        };
      });

      // Response structure and data to send
      const response = {
        count: docs.length,
        products: products,
      };

      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);

      res.status(500).json({ error: err });
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
    .then((result) => {
      res.status(201).json({
        message: "Created Product Successfully",
        createdProduct: {
          _id: result._id,
          name: result.name,
          price: result.price,
          request: {
            type: "GET",
            url: `http://localhost:3000/products/${result._id}`,
          },
        },
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

//
// Edit a particular product info
router.patch("/:productId", (req, res, next) => {
  const productId = req.params.productId;

  Product.findByIdAndUpdate(productId, req.body, { new: true })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//
// Delete a particular product
router.delete("/:productId", (req, res, next) => {
  const productId = req.params.productId;

  Product.remove({ _id: productId })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;

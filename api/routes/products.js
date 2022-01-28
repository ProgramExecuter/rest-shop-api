const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const Product = require("../models/product");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const newName = Date.now() + file.originalname;
    cb(null, newName);
  },
});

//
// Filter types of files, and allow 'jpeg' and 'png'
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter,
});

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
      res.status(500).json({ error: err });
    });
});

//
// Add a new product
router.post("/", upload.single("productImage"), (req, res, next) => {
  // console.log(req.file);

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
      res.status(500).json({ error: err });
    });
});

//
// Get a particular product
router.get("/:productId", (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .select("name price _id")
    .exec()
    .then((doc) => {
      // Check if the product exist
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: `http://localhost:3000/products/${doc._id}`,
          },
        });
      } else {
        res.status(404).json({ message: "No Product Found" });
      }
    })
    .catch((err) => {
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
      res.status(200).json({
        message: "Product Details Updated Successfully",
        request: {
          type: "GET",
          url: `http://localhost:3000/products/${productId}`,
        },
      });
    })
    .catch((err) => {
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
      res.status(200).json({ message: "Deleted Product Successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;

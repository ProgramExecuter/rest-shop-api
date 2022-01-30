const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const checkAuth = require("../middleware/checkAuth");

const Product = require("../models/product");

// Multer config
const upload = require("../controllers/multer");

// Import Controllers
const {
  getAllProducts,
  addNewProduct,
  getParticularProduct,
  editProduct,
  deleteProduct,
} = require("../controllers/products");

//
// Get a list of products
router.get("/", getAllProducts);

//
// Add a new product
router.post("/", checkAuth, upload.single("productImage"), addNewProduct);

//
// Get a particular product
router.get("/:productId", getParticularProduct);

//
// Edit a particular product info
router.patch("/:productId", checkAuth, editProduct);

//
// Delete a particular product
router.delete("/:productId", checkAuth, deleteProduct);

module.exports = router;

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const checkAuth = require("../middleware/checkAuth");

const Product = require("../models/product");

// Import Controllers
const {
  getAllProducts,
  addNewProduct,
  getParticularProduct,
  editProduct,
  deleteProduct,
} = require("../controllers/products");

const storage = multer.diskStorage({
  // Save the images in ./uploads folder
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },

  // File name assignment
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
  // Images <= 5MB are saved
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter,
});

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

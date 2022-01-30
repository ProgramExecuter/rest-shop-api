const mongoose = require("mongoose");

const Product = require("../models/product");

///
// GET ALL PRODUCTS
///
const getAllProducts = (req, res, next) => {
  // Fetch all products from DB
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then((docs) => {
      // Products structure and data
      const products = docs.map((doc) => {
        return {
          name: doc.name,
          price: doc.price,
          _id: doc._id,
          productImage: doc.productImage,
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
};

///
// ADD NEW PRODUCT
///
const addNewProduct = (req, res, next) => {
  // Creating the new product object
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
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
          productImage: result.productImage,
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
};

///
// GET A PRODUCT
///
const getParticularProduct = (req, res, next) => {
  // Fetch the product from DB
  Product.findById(req.params.productId)
    // Only forward 'price', '_id' and 'productImage'
    .select("name price _id productImage")
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
      console.log(err);

      res.status(500).json({ error: err });
    });
};

///
// EDIT A PRODUCT
///
const editProduct = (req, res, next) => {
  const productId = req.params.productId;

  // Update the product in DB
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
      console.log(err);

      res.status(500).json({ error: err });
    });
};

///
// DELETE PRODUCT
///
const deleteProduct = (req, res, next) => {
  // Delete product from DB
  Product.findByIdAndDelete(req.params.productId)
    .exec()
    .then((result) => {
      res.status(200).json({ message: "Deleted Product Successfully" });
    })
    .catch((err) => {
      console.log(err);

      res.status(500).json({ error: err });
    });
};

module.exports = {
  getAllProducts,
  addNewProduct,
  getParticularProduct,
  editProduct,
  deleteProduct,
};

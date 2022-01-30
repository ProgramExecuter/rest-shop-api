const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");

const getAllOrders = (req, res, next) => {
  // get all the orders from DB
  Order.find()
    .populate("product", "name")
    .select("product _id quantity")
    .exec()
    .then((docs) => {
      // Structure and data of all products
      const orders = docs.map((doc) => {
        return {
          _id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
          request: {
            type: "GET",
            url: `http://localhost:3000/orders/${doc._id}`,
          },
        };
      });

      // Structure of response
      res.status(200).json({
        count: docs.length,
        orders: orders,
      });
    })
    .catch((err) => {
      console.log(err);

      res.status(500).json({ error: err });
    });
};

const addNewOrder = (req, res, next) => {
  // Check if given product exist
  Product.findById(req.body.productId)
    .then((product) => {
      // If the product doesn't exist then return error
      if (!product) {
        res.status(404).json({ message: "Product not found" });
      }
    })
    .catch((err) => {
      console.log(err);

      res.status(500).json({ error: err });
    });

  //Reaching here means product exists

  // Creating the new order object
  const order = new Order({
    _id: mongoose.Types.ObjectId(),
    quantity: req.body.quantity,
    product: req.body.productId,
  });

  // Saving new Order
  order
    .save()
    .then((result) => {
      // Response structure
      res.status(200).json({
        message: "New Order Received",
        createdOrder: {
          _id: result._id,
          quantity: result.quantity,
          product: result.product,
        },
        request: {
          type: "GET",
          url: `http://localhost:3000/orders/${result._id}`,
        },
      });
    })
    .catch((err) => {
      console.log(err);

      res.status(500).json({ error: err });
    });
};

module.exports = {
  getAllOrders,
  addNewOrder,
};

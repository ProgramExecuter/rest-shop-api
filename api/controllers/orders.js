const Order = require("../models/order");

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

module.exports = {
  getAllOrders,
};

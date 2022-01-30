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

module.exports = {
  getAllProducts,
};

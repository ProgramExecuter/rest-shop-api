const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");

//
// Create New User(Sign Up)
router.post("/signup", (req, res, next) => {
  // Hash the password
  bcrypt.hash(req.body.password, (err, hash) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      // If we were able to hash the password
      // then create new User
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hash,
      });

      user
        .save()
        .then((result) => {
          console.log(result);
          res.json(201).json({ message: "User Created" });
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
    }
  });
});

module.exports = router;

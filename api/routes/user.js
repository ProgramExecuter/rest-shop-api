const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");

//
// Create New User(Sign Up)
router.post("/signup", (req, res, next) => {
  // Check if this email is already registered
  User.find({ email: req.body.email })
    .then((user) => {
      if (user.length >= 1) {
        // this 'email' is registered
        return res.status(422).json({ message: "Email already registered" });
      } else {
        // If this 'email' isn't registered

        // Hash the password
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            console.log(err);
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
                res.status(201).json({ message: "User Created" });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({ error: err });
              });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;

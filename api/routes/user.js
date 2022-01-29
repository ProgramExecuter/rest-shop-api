const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      }

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
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//
// Sign In user
router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      // This email isn't registered
      if (user == null) {
        return res.status(401).json({ message: "Auth Failed" });
      }

      // Compare the password with hashed password in DB
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        // If any error occured, return
        if (err) {
          return res.status(401).json({ message: "Auth Failed" });
        }

        // If the password matches
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({ message: "Auth Success", token });
        } else {
          return res.status(401).json({ message: "Auth Failed" });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//
// Delete a particular User
router.delete("/:userId", (req, res, next) => {
  User.findByIdAndDelete(req.params.userId)
    .exec()
    .then((result) => {
      let message;
      if (result == null) {
        message = "User not found";
      } else {
        message = "User Deleted";
      }
      res.status(200).json({ message });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;

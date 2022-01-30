const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

///
// SIGNUP USER
///
const signUp = (req, res, next) => {
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

          // Save the user in DB
          user
            .save()
            .then((result) => {
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
};

///
// LOGIN USER
///
const userLogin = (req, res, next) => {
  // Find if a user is registered with this email
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      // This email isn't registered
      if (user == null) {
        return res.status(401).json({ message: "Auth Failed" });
      }

      // Email is registered

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
            // Expire this token after '1 Hour'
            { expiresIn: "1h" }
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
};

///
// DELETE A USER
///
const deleteUser = (req, res, next) => {
  // Delete user from DB
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
};

module.exports = {
  signUp,
  userLogin,
  deleteUser,
};

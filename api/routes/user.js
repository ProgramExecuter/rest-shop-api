const express = require("express");
const router = express.Router();

// Import Controllers
const { signUp } = require("../controllers/user");

//
// Create New User(Sign Up)
router.post("/signup", signUp);

//
// Sign In user
router.post("/login", (req, res, next) => {
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
});

//
// Delete a particular User
router.delete("/:userId", (req, res, next) => {
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
});

module.exports = router;

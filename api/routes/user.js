const express = require("express");
const router = express.Router();

// Import Controllers
const { signUp, userLogin } = require("../controllers/user");

//
// Create New User(Sign Up)
router.post("/signup", signUp);

//
// Sign In user
router.post("/login", userLogin);

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

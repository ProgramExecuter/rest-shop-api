const express = require("express");
const router = express.Router();

// Import Controllers
const { signUp, userLogin, deleteUser } = require("../controllers/user");

//
// Create New User(Sign Up)
router.post("/signup", signUp);

//
// Sign In user
router.post("/login", userLogin);

//
// Delete a particular User
router.delete("/:userId", deleteUser);

module.exports = router;

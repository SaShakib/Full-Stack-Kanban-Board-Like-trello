// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const validator = require("validator"); // Add a validator library

// Use environment variables for sensitive information
const secretKey = process.env.JWT_SECRET || "shakib";

// Sign Up
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Validate name (you can customize this validation as needed)
    if (!name.trim()) {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    const user = new User({ name, email, password });
    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Sign In
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log("Invalid email or pass");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "24h",
    });
    console.log("Login successful on: ", email);
    res.json({ email, token, _id: user._id, name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error signing in" });
  }
});

// Verify Token
router.post("/verify", (req, res) => {
  const { token } = req.body;

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.json({ message: "Token is valid", decoded });
  });
});

router.post("/check-email", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email exists in the database
    const existingUser = await User.findOne({ email });
    // Return a boolean indicating whether the email exists or not
    res.json({ emailExists: !!existingUser });
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

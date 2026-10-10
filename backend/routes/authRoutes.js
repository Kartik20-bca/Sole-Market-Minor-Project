const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Fail before creating a database record if signing tokens is not configured.
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(503).json({ message: "Authentication is not configured on the server." });
    }

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields (Name, Email, Password) are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists. Please sign in.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: "user",
    });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      message: "Registration successful. Welcome to Sole Market!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Registration failed on server: " + (error.message || "Unknown error"),
    });
  }
});

// LOGIN (For Customers and Owner/Developer)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(503).json({ message: "Authentication is not configured on the server." });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: user.role === "admin" ? "Owner/Developer login successful." : "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed.",
    });
  }
});


// Return the authenticated user's current database role, not a role trusted from browser storage.
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Session is no longer valid. Please sign in again." });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Session verification error:", error);
    res.status(500).json({ message: "Unable to verify the current session." });
  }
});

module.exports = router;
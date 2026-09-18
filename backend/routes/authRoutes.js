const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

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

    const jwtSecret = process.env.JWT_SECRET || "solemarket_jwt_secret_dev_key";
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

    // Auto-create default admin/owner if logging in for the first time
    if (!user && cleanEmail === "admin@solemarket.com" && password === "Admin@12345") {
      const hashedPassword = await bcrypt.hash("Admin@12345", 10);
      user = await User.create({
        name: "Sole Market Owner & Dev",
        email: "admin@solemarket.com",
        password: hashedPassword,
        role: "admin",
      });
    }

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

    const jwtSecret = process.env.JWT_SECRET || "solemarket_jwt_secret_dev_key";

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

module.exports = router;
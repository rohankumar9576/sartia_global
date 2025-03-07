const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../emailservice");
const router = express.Router();
const crypto = require("crypto");
const db = require("../db");
const nodemailer = require("nodemailer");
const SECRET_KEY = process.env.SECRET_KEY || "jwtsecret";

//user registration
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.createUser(name, email, hashedPassword, role);
    await sendEmail(
      email,
      "Welcome to Bookstore!",
      `Hello ${name}, your account has been created. Your role: ${role}.`,
      `<h3>Hello ${name},</h3><p>Your account has been created. Your role: <b>${role}</b>.</p>`
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//user login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentails" });
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });
    req.session.userId = user.id;
    res.json({ token });
  } catch (err) {
    console.log("error :", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: "Internal server error" });
    } else {
      res.json({ message: "Logged out successfully" });
    }
  });
});

// Request Password Reset
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  // Generate Token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const expiryTime = new Date(Date.now() + 3600000); // 1 hour from now

  try {
    db.query(
      "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
      [resetToken, expiryTime, email]
    );

    // Send Reset Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: "your_email@gmail.com", pass: "your_password" },
    });

    const resetLink = `http://localhost:5000/reset-password/${resetToken}`;
    const mailOptions = {
      from: "your_email@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Click the link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset email sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in password reset" });
  }
});

// Reset Password API
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    db.query(
      "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()",
      [token],
      (err, result) => {
        if (err || result.length === 0) {
          return res.status(400).json({ message: "Invalid or expired token" });
        }

        const hashedPassword = require("bcryptjs").hashSync(newPassword, 10);
        db.query(
          "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ?",
          [hashedPassword, token]
        );

        res.status(200).json({ message: "Password updated successfully" });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error resetting password" });
  }
});

module.exports = router;

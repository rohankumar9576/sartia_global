const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const nodemailer = require("nodemailer");

// Order Book API
router.post("/place", async (req, res) => {
  const { userId, bookId, quantity, totalPrice, email } = req.body;

  try {
    const result = await Order.createOrder(
      userId,
      bookId,
      quantity,
      totalPrice
    );

    // Send Order Confirmation Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: "your_email@gmail.com", pass: "your_password" },
    });

    const mailOptions = {
      from: "your_email@gmail.com",
      to: email,
      subject: "Order Confirmation",
      text: `Your order for Book ID ${bookId} has been placed successfully!`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Order placed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error placing order" });
  }
});

module.exports = router;

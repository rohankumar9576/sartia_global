const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const sendEmail = require("../emailservice");

router.post("/addbook", async (req, res) => {
  const { title, author, price, description } = req.body;
  try {
    const book = await Book.createBook(
      title,
      author,
      price,
      description,
      new Date(),
      new Date()
    );
    res
      .status(201)
      .json({ message: "Book added successfully (pending approval)" });
  } catch (error) {
    console.log("Error", error.message);

    res.status(500).json({ message: "Error in adding book" });
  }
});

router.put("approve-reject/:id", async (req, res) => {
  const { id } = req.params;
  const { status, adminEmail } = req.body;
  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  try {
    await Book.updateBookStatus(id, status);
    const message = status === "approved" ? "approved" : "rejected";
    await sendEmail(
      adminEmail,
      `Book ${message}`,
      `<h3>Hello,</h3><p>Your book (ID: <b>${id}</b>) has been <b>${status}</b>.</p>`
    );
    res.json({ message: `Book ${message} successfully` });
  } catch (error) {
    res.status(500).json({ message: "Error in updating book status" });
  }
});

module.exports = router;

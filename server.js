require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secretkey",
    resave: false,
    saveUninitialized: false,
  })
);

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const bookRoutes = require("./routes/books");
app.use("/books", bookRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

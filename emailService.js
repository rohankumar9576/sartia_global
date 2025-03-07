require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.log("Error in sending email", error.message);
  }
};

module.exports = sendEmail;

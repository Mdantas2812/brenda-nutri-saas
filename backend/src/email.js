const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendEmail({ to, subject, html }) {
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes("seuemail")) {
    console.log("E-mail simulado:", { to, subject });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html });
}

module.exports = { sendEmail };

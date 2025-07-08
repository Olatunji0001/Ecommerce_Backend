import nodemailer from "nodemailer";
import sendEmail from "../nodeMailer/sendEmail.js";

export const handleSendEmail = async (req, res) => {
  const { to, subject, text, html } = req.body;

  try {
    const info = await sendEmail(to, subject, text, html);
    res.status(200).json({ message: "Email sent successfully", info });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
};

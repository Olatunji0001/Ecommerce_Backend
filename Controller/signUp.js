import bcrypt from "bcrypt";
import userModel from "../model/userModel.js";
import get6RandomNumber from "../generateNumber/number.js";
import sendEmail from "../nodeMailer/sendEmail.js";

export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await userModel.findOne({ email: normalizedEmail });

    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "This email is already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = get6RandomNumber();

    if (existingUser && !existingUser.isVerified) {
      // ✨ Re-signup: update user info and resend verification code
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.password = hashedPassword;
      existingUser.verificationCode = verificationCode;

      await existingUser.save();
    } else {
      // 🆕 New user
      const newUser = new userModel({
        firstName,
        lastName,
        email: normalizedEmail,
        password: hashedPassword,
        isVerified: false,
        verificationCode,
      });

      await newUser.save();
    }

    // ✉️ Send verification email
    await sendEmail(
      normalizedEmail, // ✅ Always use normalized email
      "🌟 NexusBuy Email Verification - Complete Your Signup!",
      `Welcome to NexusBuy! Your verification code is: ${verificationCode}`,
      `
      <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e0e0e0; max-width: 600px; margin: auto;">
        <h2 style="color: #E17100; font-size: 24px; margin-bottom: 10px;">
          Welcome to <strong>NexusBuy</strong> 👋
        </h2>

        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          We're excited to have you with us! To finish setting up your account, please use the verification code below:
        </p>

        <div style="font-size: 26px; font-weight: bold; color: #E17100; margin: 30px 0; text-align: center;">
          ${verificationCode}
        </div>

        <p style="font-size: 15px; color: #555; line-height: 1.6;">
          Enter this code on the verification page to confirm your email and start exploring trusted stores, trending products, and exclusive deals.
        </p>

        <p style="font-size: 13px; color: #888; margin-top: 24px;">
          Didn’t request this? No worries — you can safely ignore this email.
        </p>

        <p style="font-size: 14px; color: #555; margin-top: 32px;">
          Cheers,<br />
          The <strong>NexusBuy</strong> Team 🚀
        </p>
      </div>
      `
    );

    return res.status(201).json({
      message: "Verification code sent. Check your email.",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

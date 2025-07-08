import sellersModel from "../model/sellersModel.js";
import bcrypt from "bcrypt";
import get6RandomNumber from "../generateNumber/number.js";
import sendEmail from "../nodeMailer/sendEmail.js";

export const sellersAccount = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Trim and normalize email
    const normalizedEmail = email.trim().toLowerCase();

    const existingSeller = await sellersModel.findOne({
      email: normalizedEmail,
    });
    if (existingSeller && existingSeller.isVerified) {
      return res.status(400).json({ message: "This email is already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = get6RandomNumber();

    if (existingSeller && !existingSeller.isVerified) {
      // ✨ Re-signup: update seller info and resend verification code
      existingSeller.fullname = fullname;
      existingSeller.password = hashedPassword;
      existingSeller.verificationCode = verificationCode;

      await existingSeller.save();
    } else {
      const newSeller = new sellersModel({
        fullname,
        email: normalizedEmail,
        password: hashedPassword,
        isVerified: false,
        verificationCode,
      });

      await newSeller.save();
    }

    await sendEmail(
      normalizedEmail,
      "🌟 NexusBuy Vendor Verification - Activate Your Store!",
      `Welcome to NexusBuy! Your vendor verification code is: ${verificationCode}`,
      `
      <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e0e0e0; max-width: 600px; margin: auto;">
        <h2 style="color: #E17100; font-size: 24px; margin-bottom: 10px;">
          Welcome to <strong>NexusBuy Sellers</strong> 👋
        </h2>

        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Thanks for registering your vendor account! To activate your store and start selling, please use the verification code below:
        </p>

        <div style="font-size: 26px; font-weight: bold; color: #E17100; margin: 30px 0; text-align: center;">
          ${verificationCode}
        </div>

        <p style="font-size: 15px; color: #555; line-height: 1.6;">
          Enter this code on the verification page to confirm your email and begin listing your products.
        </p>

        <p style="font-size: 13px; color: #888; margin-top: 24px;">
          Didn’t request this? You can safely ignore this email.
        </p>

        <p style="font-size: 14px; color: #555; margin-top: 32px;">
          Cheers,<br />
          The <strong>NexusBuy Team</strong> 🚀
        </p>
      </div>
      `
    );

    return res.status(201).json({ message: "Verification code sent. Check your email." });
  } catch (error) {
    console.error("Error during seller registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

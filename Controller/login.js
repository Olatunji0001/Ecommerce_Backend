import userModel from "../model/userModel.js";
import bcrypt from "bcrypt"; // ✅ Corrected spelling
import jwt from "jsonwebtoken";

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const findUser = await userModel.findOne({ email });
    if (!findUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const confirmPassword = await bcrypt.compare(password, findUser.password);
    if (!confirmPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!findUser.isVerified) {
      return res.status(403).json({
        message:
          "Your email has not been verified. You can sign up again with this email to receive a new verification code.",
      });
    }

    const token = jwt.sign(
      { userId: findUser._id, email: findUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "33d" }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}


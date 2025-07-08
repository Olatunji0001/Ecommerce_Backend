import userModel from "../model/userModel.js";
import sellersModel from "../model/sellersModel.js";
import jwt from "jsonwebtoken";

export const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: "Email and code are required" });
  }

  try {
    // First, check in userModel
    let user = await userModel.findOne({ email });
    let userType = "user";

    // If not found in userModel, check in sellersModel
    if (!user) {
      user = await sellersModel.findOne({ email });
      userType = "seller";
    }

    if (!user) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Update user or seller
    user.isVerified = true;
    user.verificationCode = ""; // Optional: clear the code
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: userType },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({ message: "Email verified", token });
  } catch (error) {
    console.error("Verify Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

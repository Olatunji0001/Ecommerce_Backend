import userModel from "../model/userModel.js";
import sellersModel from "../model/sellersModel.js";
import get6RandomNumber from "../generateNumber/number.js";
import sendEmail from "../nodeMailer/sendEmail.js";

export const resendCode = async (req, res) => {
  let { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    // Check if email exists in user or seller model
    let account = await userModel.findOne({ email: normalizedEmail });
    let accountType = "user";

    if (!account) {
      account = await sellersModel.findOne({ email: normalizedEmail });
      accountType = "seller";
    }

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (account.isVerified) {
      return res.status(400).json({ message: "Account is already verified" });
    }

    const newCode = get6RandomNumber();
    account.verificationCode = newCode;
    await account.save();

    await sendEmail(
      normalizedEmail,
      "🔁 Your New NexusBuy Verification Code",
      `Here's your new NexusBuy verification code: ${newCode}`,
      `
      <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #ffffff; border-radius: 8px; border: 1px solid #ddd; max-width: 600px; margin: auto;">
        <h2 style="color: #E17100; font-size: 22px;">Hey again 👋</h2>

        <p style="font-size: 16px; color: #333; line-height: 1.5;">
          Looks like you requested a new verification code. No problem — we’ve got you covered!
        </p>

        <p style="font-size: 16px; color: #333; margin-top: 10px;">
          Use the code below to verify your <strong>NexusBuy account</strong> and continue your journey:
        </p>

        <div style="font-size: 26px; font-weight: bold; color: #E17100; margin: 30px 0; text-align: center;">
          ${newCode}
        </div>

        <p style="font-size: 14px; color: #666;">
          This code is valid for a limited time. If you didn’t request it, feel free to ignore this email.
        </p>

        <p style="font-size: 14px; color: #555; margin-top: 30px;">
          See you inside 😉,<br/>
          <strong>The NexusBuy Team</strong>
        </p>
      </div>
      `
    );

    return res.status(200).json({ message: "Verification code resent" });
  } catch (err) {
    console.error("Resend error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

import * as authService from "../services/auth.service.js";
import User from "../models/user.model.js";
import PasswordResetTokenModel from "../models/passwordResetToke.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { console } from "inspector";

export const registerUser = async (req, res) => {
  try {
    return await authService.registerUser(req, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    // console.log(req)
    const result = await authService.loginUser(req, res);
    // authService handles the response; keep compatibility
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
};

export const sendEmailController = async (req, res) => {
  try {
    const { subject, message, email } = req.body;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>${message}</p>
      </div>
    `;

    const result = await sendEmail({ to: email, subject, html });

    if (!result.success) {
      return res.status(500).json({
        message: "We're having trouble sending your email. Please try again later.",
        success: false,
      });
    }

    res.status(200).json({
      message: "Email sent successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in emailSender:", error);
    res.status(500).json({
      message: "We're experiencing technical difficulties. Please try again later.",
      success: false,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "We couldn't find an account with this email address. Please check your email and try again." });
    }

    await PasswordResetTokenModel.deleteMany({ userId: user._id });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

    await PasswordResetTokenModel.create({
      userId: user._id,
      token: resetToken,
      expiresAt,
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const subject = "Password Reset Request";
    const html = `
      <h2>Password Reset</h2>
      <p>You requested to reset your password.</p>
      <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
      <p>This link will expire in 15 minutes.</p>
    `;

    await sendEmail({ to: user.email, subject, html });

    res.json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
};

export const verifyResetToken = async (req, res) => {
  try {
    console.log(req.body);
    const { token } = req.body;
    const resetToken = await PasswordResetTokenModel.findOne({ token });

    if (!resetToken) {
      return res.status(400).json({ success: false, message: "This reset link is invalid. Please request a new password reset." });
    }

    if (resetToken.expiresAt < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "This reset link has expired. Please request a new password reset." });
    }

    if (resetToken.usedAt) {
      return res
        .status(400)
        .json({ success: false, message: "This reset link has already been used. Please request a new password reset." });
    }

    return res.json({ success: true, message: "Valid token" });
  } catch (err) {
    console.error("Verify Reset Token Error:", err);
    res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;
    if (!password || !confirmPassword || password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "The passwords you entered don't match. Please make sure both password fields are identical." });
    }

    const resetToken = await PasswordResetTokenModel.findOne({ token });

    if (!resetToken) {
      return res.status(400).json({ success: false, message: "This reset link is invalid. Please request a new password reset." });
    }

    if (resetToken.expiresAt < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "This reset link has expired. Please request a new password reset." });
    }

    if (resetToken.usedAt) {
      return res
        .status(400)
        .json({ success: false, message: "This reset link has already been used. Please request a new password reset." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.findByIdAndUpdate(resetToken.userId, {
      password: hashedPassword,
    });

    resetToken.usedAt = new Date();
    await resetToken.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
};

import { Router } from "express";
const router = Router();
import * as authController from "../controllers/auth.controller.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/emailSender", authController.sendEmailController);
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-reset-token", authController.verifyResetToken);
router.post("/reset-password", authController.resetPassword);
router.post("/refresh", async (req, res) => {
  try {
    const token = req.cookies?.refresh_token;
    if (!token) return res.status(401).json({ message: "Missing refresh token" });

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ message: "Invalid refresh token" });
    if ((user.tokenVersion || 0) !== payload.tokenVersion) {
      return res.status(401).json({ message: "Refresh token revoked" });
    }

    const accessPayload = {
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
    const accessToken = jwt.sign(accessPayload, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(401).json({ message: "Could not refresh token" });
  }
});
router.post("/logout", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (userId) {
      await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
    }
  } catch (_) {}
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("access_token", { httpOnly: true, secure: isProd, sameSite: "lax" });
  res.clearCookie("refresh_token", { httpOnly: true, secure: isProd, sameSite: "lax", path: "/api/auth/refresh" });
  return res.status(200).json({ ok: true });
});


export default router;
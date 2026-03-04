import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export async function registerUser(req, res) {
  const { fullName, email, phone, password, state } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      const field = existingUser.email === email ? "email" : "phone";
      return res
        .status(400)
        .json({ 
          success: false,
          message: `An account with this ${field} already exists. Please use a different ${field} or try logging in.`,
          field: field
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      phone,
      password: hashedPassword,
      state,
    });

    await newUser.save();

    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ msg: "Server error: JWT secret not defined" });
    }

    // Invalidate previous sessions by bumping tokenVersion
    await User.findByIdAndUpdate(newUser._id, { $inc: { tokenVersion: 1 } });
    const freshUser = await User.findById(newUser._id);

    const accessPayload = {
      user: {
        id: freshUser._id,
        email: freshUser.email,
        fullName: freshUser.fullName,
        role: freshUser.role,
      },
    };
    const accessToken = jwt.sign(accessPayload, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { userId: freshUser._id, tokenVersion: freshUser.tokenVersion || 0 },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const csrfToken = crypto
      .createHmac("sha256", process.env.JWT_SECRET)
      .update(String(newUser._id))
      .digest("hex");

    // set cookies
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth/refresh",
    });

    res.status(201).json({
      csrfToken,
      user: {
        id: freshUser._id,
        fullName: freshUser.fullName,
        email: freshUser.email,
        phone: freshUser.phone,
        role: freshUser.role,
        state: freshUser.state,
        status: freshUser.status,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ 
      success: false,
      message: "We're experiencing technical difficulties. Please try again later."
    });
  }
}

export async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ 
      success: false,
      message: "The email or password you entered is incorrect. Please check your credentials and try again."
    });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ 
      success: false,
      message: "The email or password you entered is incorrect. Please check your credentials and try again."
    });

    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ 
          success: false,
          message: "We're experiencing technical difficulties. Please try again later."
        });
    }

    // Invalidate previous sessions by bumping tokenVersion for single-session control
    await User.findByIdAndUpdate(user._id, { $inc: { tokenVersion: 1 } });
    const freshUser = await User.findById(user._id);

    const accessPayload = {
      user: {
        id: freshUser._id,
        email: freshUser.email,
        fullName: freshUser.fullName,
        role: freshUser.role,
      },
    };
    const accessToken = jwt.sign(accessPayload, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { userId: freshUser._id, tokenVersion: freshUser.tokenVersion || 0 },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const csrfToken = crypto
      .createHmac("sha256", process.env.JWT_SECRET)
      .update(String(user._id))
      .digest("hex");

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth/refresh",
    });

    res.json({
      csrfToken,
      user: {
        fullName: freshUser.fullName,
        email: freshUser.email,
        role: freshUser.role,
        status: freshUser.status,
      },
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "We're experiencing technical difficulties. Please try again later."
    });
  }
}

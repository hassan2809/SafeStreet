import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  subMonths,
  endOfMonth,
} from "date-fns";

export async function getUser(id) {
  return await User.findById(id).select("-password");
}

export async function getAllClientsAndAdmins() {
  return await User.find({
    role: { $in: ["admin", "client", "user"] },
  }).select("-password");
}

export async function updateUser(userId, updateData) {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // If user wants to update password, validate old password first
  if (updateData.oldPassword && updateData.password) {
    const isMatch = await bcrypt.compare(updateData.oldPassword, user.password);
    if (!isMatch) {
      throw new Error("Incorrect old password.");
    }

    // Hash new password before updating
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }

  return await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");
}

// To Check new signup for Admin -- (weekly,daily,monthly) --

// Count users based on filter
export async function countUsers(filter) {
  return await User.countDocuments(filter);
}

// Fetch new signups stats (daily, weekly, monthly, last month, and change)
export async function getNewSignupsStats() {
  try {
    // Define time ranges using date-fns
    const today = startOfDay(new Date());
    const startOfWeekDate = startOfWeek(new Date());
    const startOfMonthDate = startOfMonth(new Date());
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

    // Fetch counts
    const dailySignups = await countUsers({ createdAt: { $gte: today } });
    const weeklySignups = await countUsers({
      createdAt: { $gte: startOfWeekDate },
    });
    const monthlySignups = await countUsers({
      createdAt: { $gte: startOfMonthDate },
    });
    const lastMonthSignups = await countUsers({
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
    });

    // Calculate percentage change
    const changePercentage = lastMonthSignups
      ? (
        ((monthlySignups - lastMonthSignups) / lastMonthSignups) *
        100
      ).toFixed(2)
      : 0;

    return {
      daily: dailySignups,
      weekly: weeklySignups,
      monthly: monthlySignups,
      lastMonth: lastMonthSignups,
      changePercentage,
      positive: changePercentage >= 0,
    };
  } catch (error) {
    throw new Error(`Error fetching signup stats: ${error.message}`);
  }
}

export async function createUserByAdmin(requestingUser, data) {
  if (requestingUser.role !== "super-admin") {
    throw new Error("Access denied: only super-admin can create users");
  }

  const { fullName, email, password, role } = data;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
    role,
  });

  await newUser.save();

  return {
    id: newUser._id,
    fullName: newUser.fullName,
    email: newUser.email,
    role: newUser.role,
    status: newUser.status,
  };
}

export async function updateUserByAdmin(requestingUser, userId, data) {
  if (requestingUser.role !== "super-admin") {
    throw new Error("Access denied: only super-admin can update users");
  }

  const { fullName, email, role, status } = data;
  const updateData = {};

  if (fullName) updateData.fullName = fullName;
  if (email) updateData.email = email;
  if (role) updateData.role = role;
  if (status) updateData.status = status;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-password");

  return updatedUser;
}

export async function deleteUserByAdmin(requestingUser, userId) {
  if (requestingUser.role !== "super-admin") {
    throw new Error("Access denied: only super-admin can delete users");
  }

  const deletedUser = await User.findByIdAndDelete(userId).select("-password");
  return deletedUser;
}

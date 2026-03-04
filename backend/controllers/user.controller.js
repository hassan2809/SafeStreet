import * as userService from "../services/user.service.js";

export async function getUser(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "You need to be logged in to access this information." });
    }

    const user = await userService.getUser(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "We couldn't find your account information. Please try logging in again." });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUser:", error.message);
    res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

export async function updateUser(req, res) {
  try {
    const userId = req.params.id || req.user.id;

    const updatedUser = await userService.updateUser(userId, req.body);

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "We couldn't find the user you're trying to update." });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "There was an issue updating your information. Please check your input and try again." });
  }
}

export async function getNewSignups(req, res) {
  try {
    const stats = await userService.getNewSignupsStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching new signups:", error);
    res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

export async function getAllClientsAndAdmins(req, res) {
  try {
    if (req.user?.role !== "super-admin") {
      return res
        .status(403)
        .json({ success: false, message: "You don't have permission to access this information. Only super-admins can view this data." });
    }
    const users = await userService.getAllClientsAndAdmins();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

export async function createUserByAdmin(req, res) {
  try {
    const createdUser = await userService.createUserByAdmin(req.user, req.body);

    res.status(201).json(createdUser);
  } catch (error) {
    console.error("Error in createUserByAdmin:", error);
    res.status(400).json({ message: error.message });
  }
}

export async function updateUserByAdmin(req, res) {
  try {
    const userId = req.params.id;
    const updatedUser = await userService.updateUserByAdmin(
      req.user,
      userId,
      req.body
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "We couldn't find the user you're trying to update." });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "There was an issue updating your information. Please check your input and try again." });
  }
}

export async function deleteUserByAdmin(req, res) {
  try {
    const userId = req.params.id;
    const deletedUser = await userService.deleteUserByAdmin(req.user, userId);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "We couldn't find the user you're trying to delete." });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "There was an issue updating your information. Please check your input and try again." });
  }
}

import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import authenticateUser from "../middlewares/authenticateUser.middleware.js";
import requireCsrf from "../middlewares/csrf.middleware.js";
import authorizeRoles from "../middlewares/authorizeRoles.middleware.js";

const router = Router();
router.get("/", authenticateUser, userController.getUser);
router.get(
  "/getClientsAndAdmins",
  authenticateUser,
  authorizeRoles("super-admin"),
  userController.getAllClientsAndAdmins
);
router.patch("/", authenticateUser, requireCsrf, userController.updateUser);
router.patch("/:id", authenticateUser, requireCsrf, userController.updateUser);
router.get(
  "/new-signups",
  authenticateUser,
  authorizeRoles("super-admin", "admin"),
  userController.getNewSignups
);
router.post(
  "/createUserByAdmin",
  authenticateUser,
  authorizeRoles("super-admin"),
  requireCsrf,
  userController.createUserByAdmin
);
router.put(
  "/updateUserByAdmin/:id",
  authenticateUser,
  authorizeRoles("super-admin"),
  requireCsrf,
  userController.updateUserByAdmin
);
router.delete(
  "/deleteUserByAdmin/:id",
  authenticateUser,
  authorizeRoles("super-admin"),
  requireCsrf,
  userController.deleteUserByAdmin
);

export default router;

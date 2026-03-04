import express from "express";
import * as adsController from "../controllers/advertisement.controller.js";
import handleUpload from "../middlewares/upload.middleware.js";
import authenticateUser from "../middlewares/authenticateUser.middleware.js";
import requireCsrf from "../middlewares/csrf.middleware.js";
import authorizeRoles from "../middlewares/authorizeRoles.middleware.js";

const router = express.Router();

router.get("/", authenticateUser, adsController.fetchActiveAds);
router.post(
  "/",
  authenticateUser,
  authorizeRoles("admin", "super-admin"),
  requireCsrf,
  handleUpload("ads", 1, 5),
  adsController.uploadAdvertisement
);

router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("admin", "super-admin"),
  requireCsrf,
  adsController.modifyAdvertisement
);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("admin", "super-admin"),
  requireCsrf,
  adsController.removeAdvertisement
);

export default router;

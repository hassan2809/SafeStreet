import { Router } from "express";
import * as mediaRequestController from "../controllers/mediaRequest.controller.js";
import authenticateUser from "../middlewares/authenticateUser.middleware.js";
import handleUpload from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/:id/payment-details", authenticateUser, mediaRequestController.getUploaderPaymentDetails);
router.post("/request", authenticateUser, mediaRequestController.requestMedia);
router.get("/getAllMediaRequests", authenticateUser, mediaRequestController.getAllMediaRequests);
router.get("/", authenticateUser, mediaRequestController.getUserMediaRequests);
router.get(
  "/client",
  authenticateUser,
  mediaRequestController.getClientMediaRequests
);
router.get(
  "/pending",
  authenticateUser,
  mediaRequestController.getPendingUploads
);

router.get(
  "/uploaded",
  authenticateUser,
  mediaRequestController.getUploadedMediaRequests
);

router.get("/media-requests-stats", mediaRequestController.getMediaRequests);

router.post(
  "/upload/:id",
  authenticateUser,
  handleUpload("media_uploads", 10, 50),
  mediaRequestController.uploadMedia
);

router.patch(
  "/:id/status",
  authenticateUser,
  mediaRequestController.changeMediaStatus
);

router.post("/sendEmailAndRequestMediaByAdmin", authenticateUser, mediaRequestController.sendEmailAndRequestMediaByAdmin);
router.delete("/:id", authenticateUser, mediaRequestController.deleteMediaRequest);

export default router;

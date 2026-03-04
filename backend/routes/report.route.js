import { Router } from "express";
const router = Router();
import * as reportController from "../controllers/report.controller.js";
import authenticateUser from "../middlewares/authenticateUser.middleware.js";
import requireCsrf from "../middlewares/csrf.middleware.js";
import authorizeRoles from "../middlewares/authorizeRoles.middleware.js";
import {
  addWitnessInfo,
  getReportStatsForHome,
} from "../services/report.service.js";

router.post("/witness/:id", addWitnessInfo);
router.get("/statsForHome", getReportStatsForHome);
router.get("/reportsForHeatMap", reportController.reportsForHeatMap);
router.post("", authenticateUser, requireCsrf, reportController.createReport);
router.get("", authenticateUser, reportController.getUserReports);
router.get("/all", authenticateUser, authorizeRoles("admin","client", "super-admin"), reportController.getAllReports);
router.get("/stats", authenticateUser, reportController.getUserReportStats);
router.get("/filter", authenticateUser, reportController.filterReports);
router.get(
  "/total-reports",
  authenticateUser,
  reportController.getTotalReports
);
router.get("/:id", authenticateUser, reportController.getReport);
router.put("/:id", authenticateUser, requireCsrf, reportController.updateReport);
router.delete("/:id", authenticateUser, requireCsrf, reportController.deleteReport);
router.post("/comments/:id", authenticateUser, authorizeRoles("admin", "super-admin"), requireCsrf, reportController.addComment);
router.delete("/deleteReportByAdmin/:id", authenticateUser, authorizeRoles("admin", "super-admin"), requireCsrf, reportController.deleteByAdmin);

export default router;

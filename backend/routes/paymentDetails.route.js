import { Router } from "express";
const router = Router();
import authenticateUser from "../middlewares/authenticateUser.middleware.js";
import requireCsrf from "../middlewares/csrf.middleware.js";
import {
  getPaymentDetails,
  savePaymentDetails,
} from "../controllers/paymentDetails.controller.js";

router.post("/savePaymentDetails", authenticateUser, requireCsrf, savePaymentDetails);
router.get("/getPaymentDetails", authenticateUser, getPaymentDetails);

export default router;

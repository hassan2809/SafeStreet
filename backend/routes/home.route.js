import { Router } from "express";
const router = Router();
import { sendContactMessage } from "../services/contact-us.service.js";
import { fetchLatestStats } from "../controllers/deathStats.controller.js";

router.post("/contact", sendContactMessage);
router.get("/latestDeathStats", fetchLatestStats);

export default router;

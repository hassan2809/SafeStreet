import { Router} from "express";
const router = Router();
import * as rewardController from "../controllers/reward.controller.js";
import authenticateUser from "../middlewares/authenticateUser.middleware.js";

router.post("", authenticateUser, rewardController.createReward);
router.get("", authenticateUser, rewardController.getRewards);
router.get("/:id", authenticateUser, rewardController.getReward);
router.put("/:id", rewardController.updateReward);

export default router;
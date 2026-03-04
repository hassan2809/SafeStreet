import { Router } from "express";
const router = Router();
import * as transactionController from "../controllers/transaction.controller.js";
import authenticateUser from "../middlewares/authenticateUser.middleware.js";

router.post(
  "/media-access",
  authenticateUser,
  transactionController.createTransaction
);
router.get("", authenticateUser, transactionController.getTransactions);
router.get("/:id", transactionController.getTransaction);

export default router;

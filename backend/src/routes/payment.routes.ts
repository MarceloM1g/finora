import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createPayment,
  deletePayment,
  getPayments,
  updatePayment,
} from "../controllers/payment.controller.js";

const router = Router();

router.post("/", authMiddleware, createPayment);
router.get("/", authMiddleware, getPayments);
router.delete("/:id", authMiddleware, deletePayment);
router.put("/:id", authMiddleware, updatePayment);

export default router;

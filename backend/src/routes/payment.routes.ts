import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createPayment,
  deletePayment,
  getPayments,
  updatePayment,
  finalizePayment,
} from "../controllers/payment.controller.js";

const router = Router();

router.post("/", authMiddleware, createPayment);
router.get("/", authMiddleware, getPayments);
router.delete("/:id", authMiddleware, deletePayment);
router.put("/:id", authMiddleware, updatePayment);
router.patch("/:id/finalize", authMiddleware, finalizePayment);

export default router;

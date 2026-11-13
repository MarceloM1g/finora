import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createClient,
  getClient,
  deleteClient,
  editClient,
} from "../controllers/client.controller.js";

const router = Router();

router.post("/", authMiddleware, createClient);
router.get("/", authMiddleware, getClient);
router.delete("/:id", authMiddleware, deleteClient);
router.put("/:id", authMiddleware, editClient);

export default router;

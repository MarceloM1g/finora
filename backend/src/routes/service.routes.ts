import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { createService, deleteService, getService, editService } from "../controllers/service.controller.js"

const router = Router();

router.post("/", authMiddleware, createService);
router.get("/", authMiddleware, getService);
router.delete("/:id", authMiddleware, deleteService);
router.put("/:id", authMiddleware, editService);

export default router
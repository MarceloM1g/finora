import { Router } from "express";

import { register } from "../controllers/auth.controller.js";
import { login } from "../controllers/auth.controller.js";
import { getMe } from "../controllers/auth.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js";
import { logout } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get('/me', authMiddleware, getMe);
router.post('/logout', logout);

export default router;
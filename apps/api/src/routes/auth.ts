import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  getCurrentUser,
  login,
  logout,
  register,
} from "../services/authService.js";

const router = Router();

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

router.post(
  "/register",
  validate({ body: registerSchema }),
  async (req, res, next) => {
    try {
      const result = await register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/login",
  validate({ body: loginSchema }),
  async (req, res, next) => {
    try {
      const result = await login(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

router.post("/logout", requireAuth, async (req, res, next) => {
  try {
    const header = req.headers.authorization ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    await logout(token);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await getCurrentUser(req.user!.id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

export default router;

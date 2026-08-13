import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { listActivityForUser } from "../services/activityService.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const activity = await listActivityForUser(req.user!.id);
    res.json({ activity });
  } catch (error) {
    next(error);
  }
});

export default router;
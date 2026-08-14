import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getDashboardOverview } from "../services/overviewService.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const overview = await getDashboardOverview(req.user!.id);
    res.json(overview);
  } catch (error) {
    next(error);
  }
});

export default router;

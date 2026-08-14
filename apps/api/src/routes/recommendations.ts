import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  listRecommendationsForAnalysis,
  listRecommendationsForUser,
} from "../services/recommendationService.js";

const router = Router();

const analysisIdParamsSchema = z.object({ analysisId: z.string().min(1) });

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const recommendations = await listRecommendationsForUser(req.user!.id);
    res.json({ recommendations });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/analysis/:analysisId",
  validate({ params: analysisIdParamsSchema }),
  async (req, res, next) => {
    try {
      const recommendations = await listRecommendationsForAnalysis(
        req.params.analysisId,
        req.user!.id,
      );
      res.json({ recommendations });
    } catch (error) {
      next(error);
    }
  },
);

export default router;

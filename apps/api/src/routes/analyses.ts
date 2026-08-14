import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  createAnalysis,
  getAnalysisDetail,
  listAnalysesForProject,
  listAnalysesForUser,
} from "../services/analysisService.js";

const router = Router();

const projectIdParamsSchema = z.object({ projectId: z.string().min(1) });
const idParamsSchema = z.object({ id: z.string().min(1) });

const createAnalysisSchema = z.object({
  branch: z.string().trim().min(1).max(200).optional(),
  commitSha: z.string().trim().min(1).max(64).optional(),
});

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const analyses = await listAnalysesForUser(req.user!.id);
    res.json({ analyses });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/project/:projectId",
  validate({ params: projectIdParamsSchema }),
  async (req, res, next) => {
    try {
      const analyses = await listAnalysesForProject(
        req.params.projectId,
        req.user!.id,
      );
      if (analyses === null) {
        res.status(404).json({ error: { message: "Proyecto no encontrado" } });
        return;
      }
      res.json({ analyses });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/project/:projectId",
  validate({ params: projectIdParamsSchema, body: createAnalysisSchema }),
  async (req, res, next) => {
    try {
      const analysis = await createAnalysis({
        projectId: req.params.projectId,
        ownerId: req.user!.id,
        ...req.body,
      });
      if (analysis === null) {
        res.status(404).json({ error: { message: "Proyecto no encontrado" } });
        return;
      }
      res.status(201).json({ analysis });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:id",
  validate({ params: idParamsSchema }),
  async (req, res, next) => {
    try {
      const analysis = await getAnalysisDetail(req.params.id, req.user!.id);
      if (!analysis) {
        res.status(404).json({ error: { message: "Análisis no encontrado" } });
        return;
      }
      res.json({ analysis });
    } catch (error) {
      next(error);
    }
  },
);

export default router;

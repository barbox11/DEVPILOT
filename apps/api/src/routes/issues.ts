import { Router } from "express";
import { IssueCategory, IssueStatus, Severity } from "@prisma/client";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  listIssuesForAnalysis,
  listIssuesForUser,
  updateIssueStatus,
} from "../services/issueService.js";

const router = Router();

const analysisIdParamsSchema = z.object({ analysisId: z.string().min(1) });
const idParamsSchema = z.object({ id: z.string().min(1) });

const listQuerySchema = z.object({
  category: z.nativeEnum(IssueCategory).optional(),
  severity: z.nativeEnum(Severity).optional(),
});

const updateStatusSchema = z.object({
  status: z.nativeEnum(IssueStatus),
});

router.use(requireAuth);

router.get(
  "/",
  validate({ query: listQuerySchema }),
  async (req, res, next) => {
    try {
      const issues = await listIssuesForUser(req.user!.id, {
        category: req.query.category as never,
        severity: req.query.severity as never,
      });
      res.json({ issues });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/analysis/:analysisId",
  validate({ params: analysisIdParamsSchema }),
  async (req, res, next) => {
    try {
      const issues = await listIssuesForAnalysis(
        req.params.analysisId,
        req.user!.id,
      );
      res.json({ issues });
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  "/:id/status",
  validate({ params: idParamsSchema, body: updateStatusSchema }),
  async (req, res, next) => {
    try {
      const issue = await updateIssueStatus(
        req.params.id,
        req.body.status,
        req.user!.id,
      );
      if (!issue) {
        res.status(404).json({ error: { message: "Hallazgo no encontrado" } });
        return;
      }
      res.json({ issue });
    } catch (error) {
      next(error);
    }
  },
);

export default router;

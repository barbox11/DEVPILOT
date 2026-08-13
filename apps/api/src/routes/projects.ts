import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  createProject,
  getProjectDetail,
  listProjectsForUser,
} from "../services/projectService.js";

const router = Router();

const createProjectSchema = z.object({
  name: z.string().trim().min(1).max(100),
  repoUrl: z.string().url().optional(),
  defaultBranch: z.string().trim().min(1).max(100).optional(),
});

const idParamsSchema = z.object({ id: z.string().min(1) });

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const projects = await listProjectsForUser(req.user!.id);
    res.json({ projects });
  } catch (error) {
    next(error);
  }
});

router.post("/", validate({ body: createProjectSchema }), async (req, res, next) => {
  try {
    const project = await createProject({
      ...req.body,
      ownerId: req.user!.id,
    });
    res.status(201).json({ project });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", validate({ params: idParamsSchema }), async (req, res, next) => {
  try {
    const project = await getProjectDetail(req.params.id, req.user!.id);
    if (!project) {
      res.status(404).json({ error: { message: "Proyecto no encontrado" } });
      return;
    }
    res.json({ project });
  } catch (error) {
    next(error);
  }
});

export default router;
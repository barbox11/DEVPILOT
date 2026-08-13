import { Router } from "express";
import activityRouter from "./activity.js";
import analysesRouter from "./analyses.js";
import issuesRouter from "./issues.js";
import projectsRouter from "./projects.js";
import recommendationsRouter from "./recommendations.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "devpilot-api",
    timestamp: new Date().toISOString(),
  });
});

router.get("/", (_req, res) => {
  res.json({ name: "DevPilot API", version: "0.1.0" });
});

router.use("/projects", projectsRouter);
router.use("/analyses", analysesRouter);
router.use("/issues", issuesRouter);
router.use("/recommendations", recommendationsRouter);
router.use("/activity", activityRouter);

export default router;
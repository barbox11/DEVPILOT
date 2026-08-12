import { Router } from "express";

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

export default router;

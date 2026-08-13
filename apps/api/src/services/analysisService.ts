import type { AnalysisStatus } from "@prisma/client";
import { getPrisma } from "../lib/prisma.js";

export type CreateAnalysisInput = {
  projectId: string;
  branch?: string;
  commitSha?: string;
  status?: AnalysisStatus;
  ownerId: string;
};

export async function createAnalysis(input: CreateAnalysisInput) {
  const project = await getPrisma().project.findFirst({
    where: { id: input.projectId, ownerId: input.ownerId },
  });
  if (!project) return null;

  return getPrisma().analysis.create({
    data: {
      projectId: input.projectId,
      branch: input.branch ?? null,
      commitSha: input.commitSha ?? null,
      status: input.status ?? "PENDING",
    },
  });
}

export async function listAnalysesForProject(
  projectId: string,
  ownerId: string,
) {
  const project = await getPrisma().project.findFirst({
    where: { id: projectId, ownerId },
  });
  if (!project) return null;

  return getPrisma().analysis.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAnalysisDetail(id: string, ownerId: string) {
  return getPrisma().analysis.findFirst({
    where: { id, project: { ownerId } },
    include: {
      issues: { orderBy: { createdAt: "desc" } },
      recommendations: { orderBy: { createdAt: "desc" } },
      generatedTests: true,
    },
  });
}
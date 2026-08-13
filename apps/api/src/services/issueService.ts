import type { IssueStatus } from "@prisma/client";
import { getPrisma } from "../lib/prisma.js";

export async function listIssuesForAnalysis(
  analysisId: string,
  ownerId: string,
) {
  return getPrisma().issue.findMany({
    where: { analysis: { id: analysisId, project: { ownerId } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateIssueStatus(
  id: string,
  status: IssueStatus,
  ownerId: string,
) {
  const issue = await getPrisma().issue.findFirst({
    where: { id, analysis: { project: { ownerId } } },
  });
  if (!issue) return null;

  return getPrisma().issue.update({ where: { id }, data: { status } });
}
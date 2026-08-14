import type { IssueCategory, IssueStatus, Severity } from "@prisma/client";
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

export async function listIssuesForUser(
  ownerId: string,
  params: { category?: IssueCategory; severity?: Severity } = {},
) {
  return getPrisma().issue.findMany({
    where: {
      analysis: { project: { ownerId } },
      ...(params.category ? { category: params.category } : {}),
      ...(params.severity ? { severity: params.severity } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      analysis: {
        select: {
          id: true,
          project: { select: { id: true, name: true } },
        },
      },
    },
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

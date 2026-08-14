import { getPrisma } from "../lib/prisma.js";

export async function listRecommendationsForAnalysis(
  analysisId: string,
  ownerId: string,
) {
  return getPrisma().recommendation.findMany({
    where: { analysis: { id: analysisId, project: { ownerId } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function listRecommendationsForUser(ownerId: string, take = 50) {
  return getPrisma().recommendation.findMany({
    where: { analysis: { project: { ownerId } } },
    orderBy: { createdAt: "desc" },
    take,
    include: {
      issue: {
        select: {
          id: true,
          severity: true,
          category: true,
          file: true,
          lineStart: true,
          title: true,
          description: true,
          suggestedFix: true,
        },
      },
      analysis: {
        select: {
          id: true,
          project: { select: { id: true, name: true } },
        },
      },
    },
  });
}

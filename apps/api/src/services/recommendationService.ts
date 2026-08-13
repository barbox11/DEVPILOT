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
import { getPrisma } from "../lib/prisma.js";

export async function getDashboardOverview(userId: string) {
  const prisma = getPrisma();

  const [projects, completedAnalyses, issues, recommendations] =
    await Promise.all([
      prisma.project.count({ where: { ownerId: userId } }),
      prisma.analysis.count({
        where: { project: { ownerId: userId }, status: "COMPLETED" },
      }),
      prisma.issue.count({
        where: { analysis: { project: { ownerId: userId } }, status: "OPEN" },
      }),
      prisma.recommendation.count({
        where: { analysis: { project: { ownerId: userId } } },
      }),
    ]);

  const latestAnalyses = await prisma.analysis.findMany({
    where: { project: { ownerId: userId }, status: "COMPLETED" },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { healthScore: true },
  });

  const scored = latestAnalyses.filter((a) => a.healthScore != null);
  const avgHealth =
    scored.length > 0
      ? Math.round(
          scored.reduce((sum, a) => sum + (a.healthScore ?? 0), 0) /
            scored.length,
        )
      : null;

  const recentProjects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      repoUrl: true,
      createdAt: true,
      _count: { select: { analyses: true } },
    },
  });

  const recentActivity = await prisma.activity.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return {
    metrics: {
      projects,
      completedAnalyses,
      openIssues: issues,
      recommendations,
      avgHealth,
    },
    recentProjects,
    recentActivity,
  };
}

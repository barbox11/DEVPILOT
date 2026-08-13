import { getPrisma } from "../lib/prisma.js";

export type CreateProjectInput = {
  name: string;
  repoUrl?: string;
  defaultBranch?: string;
  ownerId: string;
};

export async function createProject(input: CreateProjectInput) {
  return getPrisma().project.create({
    data: {
      name: input.name,
      repoUrl: input.repoUrl ?? null,
      defaultBranch: input.defaultBranch ?? "main",
      ownerId: input.ownerId,
    },
  });
}

export async function listProjectsForUser(userId: string) {
  return getPrisma().project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { analyses: true } } },
  });
}

export async function getProjectDetail(id: string, userId: string) {
  return getPrisma().project.findFirst({
    where: { id, ownerId: userId },
    include: {
      analyses: { orderBy: { createdAt: "desc" }, take: 10 },
      _count: { select: { analyses: true } },
    },
  });
}
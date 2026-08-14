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
      analyses: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          issues: { orderBy: { createdAt: "desc" } },
          recommendations: { orderBy: { createdAt: "desc" } },
        },
      },
      _count: { select: { analyses: true } },
    },
  });
}

export type UpdateProjectInput = {
  name?: string;
  repoUrl?: string | null;
  defaultBranch?: string;
};

export async function updateProject(
  id: string,
  input: UpdateProjectInput,
  userId: string,
) {
  const project = await getPrisma().project.findFirst({
    where: { id, ownerId: userId },
  });
  if (!project) return null;

  return getPrisma().project.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.repoUrl !== undefined
        ? { repoUrl: input.repoUrl || null }
        : {}),
      ...(input.defaultBranch !== undefined
        ? { defaultBranch: input.defaultBranch }
        : {}),
    },
  });
}

export async function deleteProject(id: string, userId: string) {
  const project = await getPrisma().project.findFirst({
    where: { id, ownerId: userId },
  });
  if (!project) return null;

  await getPrisma().project.delete({ where: { id } });
  return project;
}

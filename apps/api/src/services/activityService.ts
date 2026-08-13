import { Prisma } from "@prisma/client";
import { getPrisma } from "../lib/prisma.js";

type RecordActivityInput = {
  userId?: string;
  projectId?: string;
  analysisId?: string;
  action: string;
  metadata?: Prisma.InputJsonValue;
};

export async function recordActivity(input: RecordActivityInput) {
  return getPrisma().activity.create({
    data: {
      userId: input.userId ?? null,
      projectId: input.projectId ?? null,
      analysisId: input.analysisId ?? null,
      action: input.action,
      metadata: input.metadata ?? Prisma.JsonNull,
    },
  });
}

export async function listActivityForUser(userId: string, take = 20) {
  return getPrisma().activity.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
  });
}
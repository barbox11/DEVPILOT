import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  __devpilotPrisma?: PrismaClient;
};

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.__devpilotPrisma) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL no está configurada en el entorno");
    }
    globalForPrisma.__devpilotPrisma = new PrismaClient();
  }
  return globalForPrisma.__devpilotPrisma;
}

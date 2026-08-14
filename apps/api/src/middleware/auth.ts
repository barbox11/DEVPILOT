import type { NextFunction, Request, Response } from "express";
import { getPrisma } from "../lib/prisma.js";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      email: string;
      name: string;
      role: "OWNER" | "MEMBER";
    };
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

    if (!token) {
      res.status(401).json({
        error: { message: "No autorizado: falta el token de sesión" },
      });
      return;
    }

    const session = await getPrisma().session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      res
        .status(401)
        .json({ error: { message: "Sesión inválida o expirada" } });
      return;
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
    };
    next();
  } catch (error) {
    next(error);
  }
}

import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

type Schemas = {
  body?: ZodType;
  params?: ZodType;
};

export function validate({ body, params }: Schemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (body) req.body = body.parse(req.body);
      if (params) req.params = params.parse(req.params) as typeof req.params;
      next();
    } catch (error) {
      const validationError = new Error(
        `Solicitud inválida: ${error instanceof Error ? error.message : "datos incorrectos"}`,
      ) as Error & { status?: number };
      validationError.status = 400;
      next(validationError);
    }
  };
}
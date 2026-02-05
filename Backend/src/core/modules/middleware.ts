import { Request, Response, NextFunction } from "express";
import { prisma } from "../../app";

export const checkModule = (moduleKey: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const companyId = req.companyId;
    if (!companyId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const module = await prisma.companyModule.findFirst({
      where: {
        companyId,
        module: {
          key: moduleKey,
        },
        isActive: true,
      },
    });

    if (!module) {
      return res
        .status(403)
        .json({
          error: `Module '${moduleKey}' is not active for this company`,
        });
    }

    next();
  };
};

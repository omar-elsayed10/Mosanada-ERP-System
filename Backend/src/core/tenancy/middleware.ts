import { Request, Response, NextFunction } from "express";

export const requireCompany = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.companyId) {
    return res.status(400).json({ error: "Company context missing" });
  }
  next();
};

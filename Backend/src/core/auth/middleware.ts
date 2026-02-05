import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./utils";
import { prisma } from "../../app";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded: any = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = user;
    req.companyId = user.companyId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

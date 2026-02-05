/// <reference path="./types/express.d.ts" />
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
const app = express();

import authRoutes from "./core/auth/routes";
import accountingRoutes from "./modules/accounting/routes";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "ERP Core Platform Running" });
});

// Routes will be mounted here
app.use("/api/auth", authRoutes);
app.use("/api/accounting", accountingRoutes);

export default app;

import { Router } from "express";
import { prisma } from "../../app";
import { hashPassword, comparePassword, generateToken } from "./utils";

const router = Router();

router.post("/register-company", async (req, res) => {
  const { companyName, email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    // Transaction to create Company, User, and Activate Module
    const result = await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: { name: companyName },
      });

      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "ADMIN",
          companyId: company.id,
        },
      });

      // Ensure 'accounting' module exists
      let accountingModule = await tx.module.findUnique({
        where: { key: "accounting" },
      });
      if (!accountingModule) {
        accountingModule = await tx.module.create({
          data: { key: "accounting", name: "Accounting Module" },
        });
      }

      // Activate Accounting Module
      await tx.companyModule.create({
        data: {
          companyId: company.id,
          moduleId: accountingModule.id,
          isActive: true,
        },
      });

      return { company, user };
    });

    const token = generateToken({
      userId: result.user.id,
      email: result.user.email,
    });
    res.json({
      message: "Company registered successfully",
      token,
      user: result.user,
      company: result.company,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken({ userId: user.id, email: user.email });
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;

import { Router } from "express";
import { prisma } from "../../app";
import { requireCompany } from "../../core/tenancy/middleware";
import { checkModule } from "../../core/modules/middleware";
import { authenticate } from "../../core/auth/middleware";

const router = Router();

// All routes require Auth, Company Context, and 'accounting' module
router.use(authenticate);
router.use(requireCompany);
router.use(checkModule("accounting"));

// 1. Chart of Accounts
router.post("/accounts", async (req, res) => {
  const { code, name, type } = req.body;
  const companyId = req.companyId!;

  if (!["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"].includes(type)) {
    return res.status(400).json({ error: "Invalid account type" });
  }

  try {
    const account = await prisma.account.create({
      data: { code, name, type, companyId },
    });
    res.json(account);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Account creation failed (Duplicate code?)" });
  }
});

router.get("/accounts", async (req, res) => {
  const accounts = await prisma.account.findMany({
    where: { companyId: req.companyId! },
  });
  res.json(accounts);
});

// 2. Journal Entries
router.post("/journals", async (req, res) => {
  const { date, description, lines } = req.body; // lines: [{ accountId, debit, credit }]
  const companyId = req.companyId!;

  // Validation: Sum Debit == Sum Credit
  const totalDebit = lines.reduce(
    (sum: number, line: any) => sum + Number(line.debit),
    0,
  );
  const totalCredit = lines.reduce(
    (sum: number, line: any) => sum + Number(line.credit),
    0,
  );

  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    // Floating point tolerance
    return res
      .status(400)
      .json({
        error: "Journal entry must be balanced",
        diff: totalDebit - totalCredit,
      });
  }

  try {
    const journal = await prisma.journalEntry.create({
      data: {
        date: new Date(date),
        description,
        companyId,
        lines: {
          create: lines.map((line: any) => ({
            accountId: line.accountId,
            debit: line.debit,
            credit: line.credit,
          })),
        },
      },
      include: { lines: true },
    });
    res.json(journal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create journal entry" });
  }
});

router.get("/journals", async (req, res) => {
  const journals = await prisma.journalEntry.findMany({
    where: { companyId: req.companyId! },
    include: { lines: { include: { account: true } } },
    orderBy: { date: "desc" },
  });
  res.json(journals);
});

// 3. Trial Balance
router.get("/trial-balance", async (req, res) => {
  const companyId = req.companyId!;

  try {
    const accounts = await prisma.account.findMany({
      where: { companyId },
      include: {
        journalLines: {
          select: { debit: true, credit: true },
        },
      },
    });

    const trialBalance = accounts.map((acc: any) => {
      const totalDebit = acc.journalLines.reduce(
        (sum: number, line: any) => sum + Number(line.debit),
        0,
      );
      const totalCredit = acc.journalLines.reduce(
        (sum: number, line: any) => sum + Number(line.credit),
        0,
      );
      return {
        ...acc,
        totalDebit,
        totalCredit,
        netBalance: totalDebit - totalCredit,
      };
    });

    res.json(trialBalance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch trial balance" });
  }
});

// 4. Invoices (Auto Journal)
router.post("/invoices", async (req, res) => {
  const { amount, description, receivableAccountId, revenueAccountId } =
    req.body;
  const companyId = req.companyId!;

  try {
    const journal = await prisma.journalEntry.create({
      data: {
        date: new Date(),
        description: `Invoice: ${description}`,
        companyId,
        lines: {
          create: [
            { accountId: receivableAccountId, debit: amount, credit: 0 },
            { accountId: revenueAccountId, debit: 0, credit: amount },
          ],
        },
      },
      include: { lines: true },
    });
    res.json(journal);
  } catch (error) {
    res.status(500).json({ error: "Failed to create invoice" });
  }
});

// 5. Payments (Auto Journal)
router.post("/payments", async (req, res) => {
  const { amount, description, cashAccountId, receivableAccountId } = req.body;
  const companyId = req.companyId!;

  try {
    const journal = await prisma.journalEntry.create({
      data: {
        date: new Date(),
        description: `Payment: ${description}`,
        companyId,
        lines: {
          create: [
            { accountId: cashAccountId, debit: amount, credit: 0 },
            { accountId: receivableAccountId, debit: 0, credit: amount },
          ],
        },
      },
      include: { lines: true },
    });
    res.json(journal);
  } catch (error) {
    res.status(500).json({ error: "Failed to record payment" });
  }
});

export default router;

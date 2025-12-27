const { Router } = require("express");
const { z } = require("zod");

const { moneyIntSchema, periodSchema, zodBody } = require("../lib/validation");
const { db } = require("../db");
const crypto = require("crypto");

const periodsRouter = Router();

function ensurePeriod(req, res, next) {
  const parsed = periodSchema.safeParse(req.params.period);
  if (!parsed.success) {
    return res.status(400).json({ error: "INVALID_PERIOD" });
  }
  req.params.period = parsed.data;
  next();
}

periodsRouter.get("/:period/summary", ensurePeriod, async (req, res, next) => {
  try {
    const { period } = req.params;

    const feeRow = db
      .prepare("SELECT amount FROM monthly_fee WHERE period = ?")
      .get(period);
    const peopleRows = db
      .prepare("SELECT id, name, monthly_fee AS monthlyFee FROM person WHERE active = 1 ORDER BY name ASC")
      .all();
    const paymentRows = db
      .prepare(
        "SELECT id, person_id AS personId, amount, paid_at AS paidAt, note FROM payment WHERE period = ?"
      )
      .all(period);
    const expenseRows = db
      .prepare(
        "SELECT id, amount, description, spent_at AS spentAt FROM expense WHERE period = ? ORDER BY spent_at DESC"
      )
      .all(period);

    const otherIncomeRows = db
      .prepare(
        "SELECT id, amount, description, received_at AS receivedAt FROM other_income WHERE period = ? ORDER BY received_at DESC"
      )
      .all(period);

    const totalIn =
      db.prepare("SELECT COALESCE(SUM(amount), 0) AS totalIn FROM payment").get().totalIn ?? 0;
    const totalOtherIncome =
      db.prepare("SELECT COALESCE(SUM(amount), 0) AS total FROM other_income").get().total ?? 0;
    const totalOut =
      db.prepare("SELECT COALESCE(SUM(amount), 0) AS totalOut FROM expense").get().totalOut ?? 0;

    const paymentByPerson = new Map(paymentRows.map((p) => [p.personId, p]));
    const totalCollected = paymentRows.reduce((acc, p) => acc + p.amount, 0);
    const totalOtherIncomeMonth = otherIncomeRows.reduce((acc, i) => acc + i.amount, 0);
    const totalExpenses = expenseRows.reduce((acc, e) => acc + e.amount, 0);

    res.json({
      period,
      feeAmount: feeRow?.amount ?? null,
      totals: {
        monthIn: totalCollected,
        otherIncome: totalOtherIncomeMonth,
        monthOut: totalExpenses,
        monthNet: totalCollected + totalOtherIncomeMonth - totalExpenses,
        totalIn,
        totalOtherIncome,
        totalOut,
        balance: totalIn + totalOtherIncome - totalOut,
      },
      people: peopleRows.map((person) => {
        const payment = paymentByPerson.get(person.id);
        return {
          id: person.id,
          name: person.name,
          monthlyFee: person.monthlyFee,
          paid: Boolean(payment),
          payment: payment
            ? {
                id: payment.id,
                amount: payment.amount,
                paidAt: payment.paidAt,
                note: payment.note,
              }
            : null,
        };
      }),
      expenses: expenseRows,
      otherIncomes: otherIncomeRows,
    });
  } catch (err) {
    next(err);
  }
});

periodsRouter.put(
  "/:period/fee",
  ensurePeriod,
  zodBody(z.object({ amount: moneyIntSchema })),
  async (req, res, next) => {
    try {
      const { period } = req.params;
      const { amount } = req.body;

      const now = new Date().toISOString();
      db.prepare(
        "INSERT INTO monthly_fee (period, amount, created_at, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(period) DO UPDATE SET amount = excluded.amount, updated_at = excluded.updated_at"
      ).run(period, amount, now, now);

      res.json({ fee: { period, amount } });
    } catch (err) {
      next(err);
    }
  }
);

periodsRouter.post(
  "/:period/payments",
  ensurePeriod,
  zodBody(
    z.object({
      personId: z.string().trim().min(1),
      amount: moneyIntSchema.optional(),
      note: z.string().trim().max(200).optional(),
    })
  ),
  async (req, res, next) => {
    try {
      const { period } = req.params;
      const { personId, note } = req.body;

      let amount = req.body.amount;
      if (amount === undefined) {
        // Usar la cuota individual de la persona
        const person = db.prepare("SELECT monthly_fee AS monthlyFee FROM person WHERE id = ?").get(personId);
        if (!person) {
          return res.status(400).json({ error: "INVALID_PERSON" });
        }
        if (!person.monthlyFee) {
          // Si no tiene cuota individual, intentar usar la cuota general del periodo
          const fee = db.prepare("SELECT amount FROM monthly_fee WHERE period = ?").get(period);
          if (!fee) {
            return res
              .status(400)
              .json({ error: "FEE_NOT_SET", message: "Define la cuota de esta persona primero" });
          }
          amount = fee.amount;
        } else {
          amount = person.monthlyFee;
        }
      }

      const now = new Date().toISOString();
      const id = crypto.randomUUID();
      try {
        db.prepare(
          "INSERT INTO payment (id, person_id, period, amount, paid_at, note) VALUES (?, ?, ?, ?, ?, ?)"
        ).run(id, personId, period, amount, now, note ?? null);
      } catch (e) {
        if (String(e?.message || "").includes("UNIQUE")) {
          return res.status(409).json({ error: "ALREADY_PAID" });
        }
        throw e;
      }

      res.status(201).json({
        payment: { id, period, personId, amount, paidAt: now, note: note ?? null },
      });
    } catch (err) {
      next(err);
    }
  }
);

periodsRouter.delete("/payments/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const info = db.prepare("DELETE FROM payment WHERE id = ?").run(id);
    if (info.changes === 0) {
      return res.status(404).json({ error: "PAYMENT_NOT_FOUND" });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

periodsRouter.post(
  "/:period/expenses",
  ensurePeriod,
  zodBody(
    z.object({
      amount: moneyIntSchema,
      description: z.string().trim().min(1).max(200),
      spentAt: z.coerce.date().optional(),
    })
  ),
  async (req, res, next) => {
    try {
      const { period } = req.params;
      const { amount, description } = req.body;
      const spentAt = (req.body.spentAt ?? new Date()).toISOString();

      const id = crypto.randomUUID();
      db.prepare(
        "INSERT INTO expense (id, period, amount, description, spent_at) VALUES (?, ?, ?, ?, ?)"
      ).run(id, period, amount, description, spentAt);

      res.status(201).json({
        expense: { id, period, amount, description, spentAt },
      });
    } catch (err) {
      next(err);
    }
  }
);

periodsRouter.delete("/expenses/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const info = db.prepare("DELETE FROM expense WHERE id = ?").run(id);
    if (info.changes === 0) {
      return res.status(404).json({ error: "EXPENSE_NOT_FOUND" });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

periodsRouter.post(
  "/:period/other-incomes",
  ensurePeriod,
  zodBody(
    z.object({
      amount: moneyIntSchema,
      description: z.string().trim().min(1).max(200),
      receivedAt: z.coerce.date().optional(),
    })
  ),
  async (req, res, next) => {
    try {
      const { period } = req.params;
      const { amount, description } = req.body;
      const receivedAt = (req.body.receivedAt ?? new Date()).toISOString();

      const id = crypto.randomUUID();
      db.prepare(
        "INSERT INTO other_income (id, period, amount, description, received_at) VALUES (?, ?, ?, ?, ?)"
      ).run(id, period, amount, description, receivedAt);

      res.status(201).json({
        otherIncome: { id, period, amount, description, receivedAt },
      });
    } catch (err) {
      next(err);
    }
  }
);

periodsRouter.delete("/other-incomes/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const info = db.prepare("DELETE FROM other_income WHERE id = ?").run(id);
    if (info.changes === 0) {
      return res.status(404).json({ error: "OTHER_INCOME_NOT_FOUND" });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = { periodsRouter };

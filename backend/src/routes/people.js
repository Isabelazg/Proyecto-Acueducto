const { Router } = require("express");
const { z } = require("zod");
const { zodBody } = require("../lib/validation");
const { db } = require("../db");
const crypto = require("crypto");

const peopleRouter = Router();

peopleRouter.get("/", async (req, res, next) => {
  try {
    const activeParam = req.query.active;
    const where =
      activeParam === undefined
        ? {}
        : { active: activeParam === "true" || activeParam === true };

    const rows =
      Object.keys(where).length === 0
        ? db
            .prepare(
              "SELECT id, name, active, monthly_fee AS monthlyFee, created_at AS createdAt FROM person ORDER BY active DESC, name ASC"
            )
            .all()
        : db
            .prepare(
              "SELECT id, name, active, monthly_fee AS monthlyFee, created_at AS createdAt FROM person WHERE active = ? ORDER BY active DESC, name ASC"
            )
            .all(where.active ? 1 : 0);

    res.json({
      people: rows.map((r) => ({ ...r, active: Boolean(r.active) })),
    });
  } catch (err) {
    next(err);
  }
});

peopleRouter.post(
  "/",
  zodBody(
    z.object({
      name: z.string().trim().min(1, "Nombre requerido").max(120),
      monthlyFee: z.number().int().min(0).optional(),
    })
  ),
  async (req, res, next) => {
    try {
      const { name, monthlyFee } = req.body;

      const now = new Date().toISOString();
      const id = crypto.randomUUID();
      try {
        db.prepare(
          "INSERT INTO person (id, name, active, monthly_fee, created_at, updated_at) VALUES (?, ?, 1, ?, ?, ?)"
        ).run(id, name, monthlyFee ?? null, now, now);
      } catch (e) {
        if (String(e?.message || "").includes("UNIQUE")) {
          return res.status(409).json({ error: "PERSON_ALREADY_EXISTS" });
        }
        throw e;
      }

      res.status(201).json({
        person: { id, name, active: true, monthlyFee: monthlyFee ?? null, createdAt: now },
      });
    } catch (err) {
      next(err);
    }
  }
);

peopleRouter.patch(
  "/:id",
  zodBody(
    z.object({
      name: z.string().trim().min(1).max(120).optional(),
      active: z.boolean().optional(),
      monthlyFee: z.number().int().min(0).optional().nullable(),
    })
  ),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const existing = db
        .prepare("SELECT id, name, active, monthly_fee AS monthlyFee, created_at AS createdAt FROM person WHERE id = ?")
        .get(id);
      if (!existing) {
        return res.status(404).json({ error: "PERSON_NOT_FOUND" });
      }

      const newName = req.body.name ?? existing.name;
      const newActive = req.body.active ?? Boolean(existing.active);
      const newMonthlyFee = req.body.monthlyFee !== undefined ? req.body.monthlyFee : existing.monthlyFee;
      const now = new Date().toISOString();

      try {
        db.prepare(
          "UPDATE person SET name = ?, active = ?, monthly_fee = ?, updated_at = ? WHERE id = ?"
        ).run(newName, newActive ? 1 : 0, newMonthlyFee, now, id);
      } catch (e) {
        if (String(e?.message || "").includes("UNIQUE")) {
          return res.status(409).json({ error: "PERSON_ALREADY_EXISTS" });
        }
        throw e;
      }

      res.json({
        person: {
          id,
          name: newName,
          active: Boolean(newActive),
          monthlyFee: newMonthlyFee,
          createdAt: existing.createdAt,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = { peopleRouter };

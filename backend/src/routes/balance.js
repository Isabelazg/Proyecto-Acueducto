const { Router } = require("express");
const { db } = require("../db");

const balanceRouter = Router();

balanceRouter.get("/", async (req, res, next) => {
  try {
    const totalIn =
      db.prepare("SELECT COALESCE(SUM(amount), 0) AS totalIn FROM payment").get().totalIn ?? 0;
    const totalOut =
      db.prepare("SELECT COALESCE(SUM(amount), 0) AS totalOut FROM expense").get().totalOut ?? 0;

    res.json({ totalIn, totalOut, balance: totalIn - totalOut });
  } catch (err) {
    next(err);
  }
});

module.exports = { balanceRouter };

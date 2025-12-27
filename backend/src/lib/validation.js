const { z } = require("zod");

const periodSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}$/, "El periodo debe ser YYYY-MM")
  .refine((value) => {
    const month = Number(value.slice(5, 7));
    return month >= 1 && month <= 12;
  }, "Mes inválido en el periodo");

const moneyIntSchema = z
  .number({ invalid_type_error: "Debe ser un número" })
  .int("Debe ser un entero")
  .nonnegative("Debe ser >= 0");

const cuidSchema = z.string().trim().min(1);

function zodBody(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        details: parsed.error.flatten(),
      });
    }
    req.body = parsed.data;
    next();
  };
}

module.exports = { periodSchema, moneyIntSchema, cuidSchema, zodBody };

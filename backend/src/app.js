const express = require("express");
const cors = require("cors");
const path = require("path");

const { peopleRouter } = require("./routes/people");
const { periodsRouter } = require("./routes/periods");
const { balanceRouter } = require("./routes/balance");

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:3001"],
      credentials: false,
    })
  );
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/people", peopleRouter);
  app.use("/api/periods", periodsRouter);
  app.use("/api/balance", balanceRouter);

  // Servir frontend en producción
  if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '..', 'public');
    app.use(express.static(frontendPath));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    });
  } else {
    // 404 solo en desarrollo
    app.use((req, res) => {
      res.status(404).json({ error: "NOT_FOUND" });
    });
  }

  // Error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  });

  return app;
}

module.exports = { createApp };

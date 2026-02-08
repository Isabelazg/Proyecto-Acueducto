const { createApp } = require("./app");

const port = process.env.PORT ? Number(process.env.PORT) : 3001;

async function startServer() {
  const app = await createApp();
  
  app.listen(port, () => {
    console.log(`Backend escuchando en http://localhost:${port}`);
  });
}

startServer().catch(err => {
  console.error('Error al iniciar el servidor:', err);
  process.exit(1);
});

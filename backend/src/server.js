const { createApp } = require("./app");

// Forzar modo producción cuando se ejecuta como .exe
if (process.pkg) {
  process.env.NODE_ENV = 'production';
}

const port = process.env.PORT ? Number(process.env.PORT) : 3001;
const app = createApp();

app.listen(port, () => {
  console.log(`Backend escuchando en http://localhost:${port}`);
});

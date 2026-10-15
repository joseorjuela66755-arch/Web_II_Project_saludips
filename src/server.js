// src/server.js — Semana 4: punto de arranque
import 'dotenv/config';
import app from './app.js';

const PUERTO = process.env.PORT ?? 3000;
app.listen(PUERTO, () => {
  console.log(`SaludIPS API en http://localhost:${PUERTO}`);
});

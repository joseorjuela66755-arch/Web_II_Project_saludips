// src/middlewares/logger.js — Semana 4: logger propio además de morgan (requisito explícito del taller)
export function logger(req, res, next) {
  const inicio = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - inicio;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${ms}ms)`);
  });
  next();
}

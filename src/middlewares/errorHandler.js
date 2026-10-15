// src/middlewares/errorHandler.js — Semana 4: manejador de errores centralizado (4 parámetros, siempre al final)
import { ErrorHttp } from '../utils/errors.js';

export function errorHandler(err, req, res, next) {
  if (err instanceof ErrorHttp) {
    return res.status(err.codigo).json({ error: err.message });
  }
  // Errores conocidos de Prisma (Semana 6): violación de restricción única
  if (err.code === 'P2002') {
    return res.status(409).json({ error: `Valor duplicado en el campo: ${err.meta?.target}` });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Recurso no encontrado' });
  }
  console.error('Error no controlado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
}

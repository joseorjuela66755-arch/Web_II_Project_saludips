// src/middlewares/validateId.js — Semana 4: valida que :id de la URL sea un entero positivo
import { datosInvalidos } from '../utils/errors.js';

export function validateId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return next(datosInvalidos('El id debe ser un entero positivo'));
  }
  next();
}

// src/controllers/examenes.controller.js
import * as servicio from '../services/examenes.service.js';

export async function registrar(req, res, next) {
  try { res.status(201).json(await servicio.registrar(Number(req.params.id), req.body)); }
  catch (error) { next(error); }
}

export async function listarPorCita(req, res, next) {
  try { res.json(await servicio.listarPorCita(Number(req.params.id))); }
  catch (error) { next(error); }
}

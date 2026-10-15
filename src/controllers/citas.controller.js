// src/controllers/citas.controller.js
import * as servicio from '../services/citas.service.js';
import { noEncontrado } from '../utils/errors.js';

export async function listar(req, res, next) {
  try {
    const { medicoId, pacienteId, estado } = req.query;
    res.json(await servicio.listar({
      medicoId: medicoId ? Number(medicoId) : undefined,
      pacienteId: pacienteId ? Number(pacienteId) : undefined,
      estado: estado || undefined,
    }));
  } catch (error) { next(error); }
}

export async function obtener(req, res, next) {
  try {
    const cita = await servicio.buscarPorId(Number(req.params.id));
    if (!cita) throw noEncontrado('Cita no encontrada');
    res.json(cita);
  } catch (error) { next(error); }
}

export async function crear(req, res, next) {
  try { res.status(201).json(await servicio.crear(req.body)); }
  catch (error) { next(error); }
}

export async function cambiarEstado(req, res, next) {
  try {
    const resultado = await servicio.cambiarEstado(Number(req.params.id), req.body.estado);
    res.json(resultado);
  } catch (error) { next(error); }
}

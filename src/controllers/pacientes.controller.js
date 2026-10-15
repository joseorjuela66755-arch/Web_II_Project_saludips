// src/controllers/pacientes.controller.js
import * as servicio from '../services/pacientes.service.js';
import { noEncontrado } from '../utils/errors.js';

export async function listar(req, res, next) {
  try { res.json(await servicio.listar()); }
  catch (error) { next(error); }
}

export async function obtener(req, res, next) {
  try {
    const paciente = await servicio.buscarPorId(Number(req.params.id));
    if (!paciente) throw noEncontrado('Paciente no encontrado');
    res.json(paciente);
  } catch (error) { next(error); }
}

export async function crear(req, res, next) {
  try { res.status(201).json(await servicio.crear(req.body)); }
  catch (error) { next(error); }
}

export async function actualizar(req, res, next) {
  try { res.json(await servicio.actualizar(Number(req.params.id), req.body)); }
  catch (error) { next(error); }
}

export async function eliminar(req, res, next) {
  try { await servicio.eliminar(Number(req.params.id)); res.status(204).end(); }
  catch (error) { next(error); }
}

// src/controllers/facturas.controller.js
import * as servicio from '../services/facturas.service.js';

export async function generar(req, res, next) {
  try { res.status(201).json(await servicio.generar(Number(req.params.id), req.body)); }
  catch (error) { next(error); }
}

export async function obtener(req, res, next) {
  try {
    const factura = await servicio.buscarPorCita(Number(req.params.id));
    if (!factura) return res.status(404).json({ error: 'Esta cita no tiene factura' });
    res.json(factura);
  } catch (error) { next(error); }
}

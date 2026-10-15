// src/services/facturas.service.js — Semana 6
// Caso de uso "Generar factura PDF a EPS": solo procede cuando la cita se cerró como ATENDIDA
// (docs/proceso-bpmn.png: "Cerrar cita como ATENDIDA" → "Generar factura PDF" → "Enviar factura a EPS").
import prisma from '../config/database.js';
import { noEncontrado, conflicto } from '../utils/errors.js';

export async function generar(citaId, { monto }) {
  const cita = await prisma.cita.findUnique({ where: { id: citaId }, include: { factura: true } });
  if (!cita) throw noEncontrado('Cita no encontrada');
  if (cita.estado !== 'ATENDIDA') throw conflicto('Solo se factura una cita en estado ATENDIDA');
  if (cita.factura) throw conflicto('Esta cita ya tiene una factura generada');

  const numero = `FAC-${citaId}-${Date.now()}`;
  return prisma.factura.create({
    data: { citaId, monto, numero, estado: 'PENDIENTE', pdfUrl: `/facturas/${numero}.pdf` },
  });
}

export async function buscarPorCita(citaId) {
  return prisma.factura.findUnique({ where: { citaId } });
}

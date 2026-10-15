// src/services/examenes.service.js — Semana 6
// Caso de uso "Registrar resultado de examen": se genera a partir de una Cita (docs/diagrama-clases.png: Cita 1 → 0..1 Examen).
import prisma from '../config/database.js';
import { noEncontrado, conflicto, datosInvalidos } from '../utils/errors.js';

export async function registrar(citaId, datos) {
  const cita = await prisma.cita.findUnique({ where: { id: citaId } });
  if (!cita) throw noEncontrado('Cita no encontrada');
  if (cita.tipo !== 'EXAMEN') throw datosInvalidos('La cita no es de tipo EXAMEN');
  if (cita.estado === 'CANCELADA' || cita.estado === 'NO_ASISTIO') {
    throw conflicto('No se puede registrar un examen sobre una cita cancelada o no asistida');
  }
  return prisma.examen.create({ data: { ...datos, citaId } });
}

export async function listarPorCita(citaId) {
  return prisma.examen.findMany({ where: { citaId }, orderBy: { id: 'asc' } });
}

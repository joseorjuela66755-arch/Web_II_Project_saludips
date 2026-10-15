// src/services/citas.service.js — Semana 6
// Trazabilidad: docs/diagrama-secuencia.png (agendarCita valida disponibilidad del médico
// antes de crear) y docs/proceso-bpmn.png (marcar NO_ASISTIO → reasignar cita prioritaria).
import prisma from '../config/database.js';
import { noEncontrado, conflicto, datosInvalidos } from '../utils/errors.js';

export async function listar({ medicoId, pacienteId, estado } = {}) {
  return prisma.cita.findMany({
    where: {
      medicoId: medicoId ?? undefined,
      pacienteId: pacienteId ?? undefined,
      estado: estado ?? undefined,
    },
    include: { paciente: true, medico: true },
    orderBy: [{ fecha: 'asc' }, { hora: 'asc' }],
  });
}

export async function buscarPorId(id) {
  return prisma.cita.findUnique({
    where: { id },
    include: { paciente: true, medico: true, examenes: true, factura: true },
  });
}

// Regla de negocio (diagrama de secuencia): no se permite doble-agenda para el mismo
// médico en la misma fecha y hora.
export async function crear({ pacienteId, medicoId, fecha, hora, tipo, prioridad }) {
  const paciente = await prisma.paciente.findUnique({ where: { id: pacienteId } });
  if (!paciente) throw datosInvalidos(`No existe el paciente ${pacienteId}`);

  const medico = await prisma.usuario.findUnique({ where: { id: medicoId } });
  if (!medico || medico.rol !== 'MEDICO') throw datosInvalidos(`No existe el médico ${medicoId}`);

  const ocupada = await prisma.cita.findFirst({
    where: { medicoId, fecha, hora, estado: 'PROGRAMADA' },
  });
  if (ocupada) throw conflicto('El médico ya tiene una cita programada en ese horario');

  return prisma.cita.create({
    data: { pacienteId, medicoId, fecha, hora, tipo, prioridad: prioridad ?? false, estado: 'PROGRAMADA' },
  });
}

// Reto del BPMN: al marcar NO_ASISTIO, si existe una cita prioritaria posterior del mismo
// médico en el mismo día, se reasigna al horario que quedó libre.
export async function cambiarEstado(id, estado) {
  const cita = await buscarPorId(id);
  if (!cita) throw noEncontrado('Cita no encontrada');

  const actualizada = await prisma.cita.update({ where: { id }, data: { estado } });

  if (estado !== 'NO_ASISTIO') return { cita: actualizada, reasignada: null };

  const siguientePrioritaria = await prisma.cita.findFirst({
    where: {
      medicoId: cita.medicoId,
      fecha: cita.fecha,
      estado: 'PROGRAMADA',
      prioridad: true,
      hora: { gt: cita.hora },
    },
    orderBy: { hora: 'asc' },
  });

  if (!siguientePrioritaria) return { cita: actualizada, reasignada: null };

  const reasignada = await prisma.cita.update({
    where: { id: siguientePrioritaria.id },
    data: { hora: cita.hora },
  });

  return { cita: actualizada, reasignada };
}

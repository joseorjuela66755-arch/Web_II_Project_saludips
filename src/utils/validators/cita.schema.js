// src/utils/validators/cita.schema.js — Semana 5
// Campos tomados de docs/diagrama-secuencia.png: POST /api/citas {pacienteId, medicoId, fecha, hora, tipo}
import { z } from 'zod';

export const citaSchema = z.object({
  pacienteId: z.number().int().positive(),
  medicoId: z.number().int().positive(),
  fecha: z.coerce.date(),
  hora: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'hora debe tener formato HH:MM'),
  tipo: z.enum(['CONSULTA', 'EXAMEN']),
  prioridad: z.boolean().optional().default(false),
});

export const citaEstadoSchema = z.object({
  estado: z.enum(['PROGRAMADA', 'ATENDIDA', 'CANCELADA', 'NO_ASISTIO']),
});

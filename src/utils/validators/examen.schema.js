// src/utils/validators/examen.schema.js — Semana 5/6: registrar resultado de examen sobre una cita (caso de uso "Registrar resultado de examen")
import { z } from 'zod';

export const examenSchema = z.object({
  tipoExamen: z.string().trim().min(1).max(80),
  resultado: z.string().trim().min(1),
  recomendacionIA: z.string().trim().optional(),
  fechaRealizacion: z.coerce.date().optional(),
});

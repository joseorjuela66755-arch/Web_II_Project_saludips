// src/utils/validators/paciente.schema.js — Semana 5
import { z } from 'zod';

export const pacienteSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(120),
  documento: z.string().trim().min(5, 'El documento debe tener al menos 5 caracteres').max(20),
  epsNombre: z.string().trim().max(80).optional(),
  fechaNacimiento: z.coerce.date().optional(),
});

export const pacienteActualizarSchema = pacienteSchema.partial();

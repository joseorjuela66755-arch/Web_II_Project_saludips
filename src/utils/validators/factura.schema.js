// src/utils/validators/factura.schema.js — Semana 5/6: generar factura al cerrar una cita (caso de uso "Generar factura PDF a EPS")
import { z } from 'zod';

export const facturaSchema = z.object({
  monto: z.number().int().positive('El monto debe ser mayor a 0'),
});

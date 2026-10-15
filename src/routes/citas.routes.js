// src/routes/citas.routes.js — Semana 5
// Examenes y Factura anidados un solo nivel bajo /citas/:id, igual que en el diagrama de clases
// (Cita 1 → 0..1 Examen, Cita 1 → 0..1 Factura): son subrecursos de una cita, no recursos propios.
import { Router } from 'express';
import * as citas from '../controllers/citas.controller.js';
import * as examenes from '../controllers/examenes.controller.js';
import * as facturas from '../controllers/facturas.controller.js';
import { validate } from '../middlewares/validate.js';
import { validateId } from '../middlewares/validateId.js';
import { citaSchema, citaEstadoSchema } from '../utils/validators/cita.schema.js';
import { examenSchema } from '../utils/validators/examen.schema.js';
import { facturaSchema } from '../utils/validators/factura.schema.js';

const router = Router();

router.get('/', citas.listar);
router.get('/:id', validateId, citas.obtener);
router.post('/', validate(citaSchema), citas.crear);
router.patch('/:id/estado', validateId, validate(citaEstadoSchema), citas.cambiarEstado);

router.post('/:id/examenes', validateId, validate(examenSchema), examenes.registrar);
router.get('/:id/examenes', validateId, examenes.listarPorCita);

router.post('/:id/factura', validateId, validate(facturaSchema), facturas.generar);
router.get('/:id/factura', validateId, facturas.obtener);

export default router;

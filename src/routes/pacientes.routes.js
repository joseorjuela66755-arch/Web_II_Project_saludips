// src/routes/pacientes.routes.js — Semana 5: reglas Zod → validate → validateId → controller
import { Router } from 'express';
import * as controlador from '../controllers/pacientes.controller.js';
import { validate } from '../middlewares/validate.js';
import { validateId } from '../middlewares/validateId.js';
import { pacienteSchema, pacienteActualizarSchema } from '../utils/validators/paciente.schema.js';

const router = Router();

router.get('/', controlador.listar);
router.get('/:id', validateId, controlador.obtener);
router.post('/', validate(pacienteSchema), controlador.crear);
router.put('/:id', validateId, validate(pacienteActualizarSchema), controlador.actualizar);
router.delete('/:id', validateId, controlador.eliminar);

export default router;

// src/app.js — Semana 4: ensamblaje de la app Express por capas
import express from 'express';
import morgan from 'morgan';
import pacientesRouter from './routes/pacientes.routes.js';
import citasRouter from './routes/citas.routes.js';
import { logger } from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(morgan('dev'));
app.use(logger);
app.use(express.json());

app.get('/', (req, res) => res.json({ nombre: 'SaludIPS API', version: '1.0' }));
app.use('/api/pacientes', pacientesRouter);
app.use('/api/citas', citasRouter);

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
app.use(errorHandler); // Semana 4: siempre al final de la cadena

export default app;

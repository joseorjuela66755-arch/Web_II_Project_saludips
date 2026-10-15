// src/config/database.js — Semana 6: instancia única (singleton) de PrismaClient
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

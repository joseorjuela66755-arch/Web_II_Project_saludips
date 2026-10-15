// src/services/pacientes.service.js — Semana 6: persistido con Prisma (reemplaza el arreglo en memoria de la Semana 4)
import prisma from '../config/database.js';
import { noEncontrado, conflicto } from '../utils/errors.js';

export async function listar() {
  return prisma.paciente.findMany({ orderBy: { id: 'asc' } });
}

export async function buscarPorId(id) {
  return prisma.paciente.findUnique({ where: { id } });
}

export async function crear(datos) {
  const existente = await prisma.paciente.findUnique({ where: { documento: datos.documento } });
  if (existente) throw conflicto(`Ya existe un paciente con documento "${datos.documento}"`);
  return prisma.paciente.create({ data: datos });
}

export async function actualizar(id, cambios) {
  const paciente = await buscarPorId(id);
  if (!paciente) throw noEncontrado('Paciente no encontrado');
  return prisma.paciente.update({ where: { id }, data: cambios });
}

export async function eliminar(id) {
  const paciente = await buscarPorId(id);
  if (!paciente) throw noEncontrado('Paciente no encontrado');
  await prisma.paciente.delete({ where: { id } });
}

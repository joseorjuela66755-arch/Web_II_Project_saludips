// prisma/seed.js — datos iniciales para probar relaciones Usuario–Paciente–Cita
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.usuario.createMany({
    data: [
      { nombre: 'Dra. Ana Restrepo', email: 'ana.restrepo@saludips.co', passwordHash: 'x', rol: 'MEDICO', especialidad: 'Medicina General' },
      { nombre: 'Jhonatan Gómez', email: 'jhonatan@saludips.co', passwordHash: 'x', rol: 'ADMINISTRATIVO' },
      { nombre: 'Alejandro Orjuela', email: 'alejandro@saludips.co', passwordHash: 'x', rol: 'ADMIN' },
    ],
    skipDuplicates: true,
  });
  await prisma.paciente.createMany({
    data: [
      { nombre: 'Laura Gómez', documento: '1053812345', epsNombre: 'Nueva EPS', fechaNacimiento: new Date('1994-03-12') },
      { nombre: 'Carlos Ramírez', documento: '1053898765', epsNombre: 'Sura', fechaNacimiento: new Date('1988-07-25') },
    ],
    skipDuplicates: true,
  });
  console.log('Seed aplicado.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

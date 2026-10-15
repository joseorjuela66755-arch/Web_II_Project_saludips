# SaludIPS

Plataforma de gestión de citas médicas, historial clínico y facturación electrónica para una IPS colombiana.

## Integrantes
- Alejandro Orjuela Moreno
- Jhonatan Gómez Toro

**Curso:** Programación Web 2 (238G8F) · Universidad de Caldas · 2026-2

## Descripción del dominio
SaludIPS centraliza el agendamiento de citas médicas y exámenes de una IPS, permite a los médicos consultar el historial clínico y apoyarse en recomendaciones de IA sobre resultados de exámenes, y genera facturación electrónica en PDF hacia la EPS. Tiene tres roles: Administrador, Médico y Personal Administrativo. La transacción central es agendar una cita, con reasignación automática a pacientes con cita prioritaria si hay inasistencia.

## Diagramas (docs/)
- `casos-de-uso.png`, `diagrama-clases.png`, `diagrama-secuencia.png`, `proceso-bpmn.png` — Hito 1
- `arquitectura.md` — arquitectura por capas y trazabilidad Hito 1 → código (Semana 2)
- `api.md` — contrato REST de la API (Semana 5)

## Puesta en marcha

```bash
npm install
cp .env.example .env
docker compose up -d
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Servidor nativo de la Semana 3 (sin Express, sin Prisma): `npm run nativo`.

## Estructura

```
saludips/
├── docs/                      Hito 1: diagramas + arquitectura.md + api.md
├── prisma/schema.prisma       modelos Usuario, Paciente, Cita, Examen, Factura
├── prisma/seed.js
├── docker-compose.yml         PostgreSQL 16
├── src/servidor-nativo.js     Semana 3: HTTP nativo
├── src/app.js, src/server.js  Semana 4: Express
├── src/config/database.js     Semana 6: PrismaClient singleton
├── src/routes/
├── src/controllers/
├── src/services/              reglas de negocio + Prisma
├── src/middlewares/           logger, validateId, validate, errorHandler
└── src/utils/
    ├── errors.js               ErrorHttp + factories semánticas
    └── validators/             esquemas Zod
```

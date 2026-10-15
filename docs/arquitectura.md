# Arquitectura — SaludIPS (Semana 2 → Hito 1)

## Arquitectura por capas

```
Cliente HTTP
   │
   ▼
routes/        ← define URL + método, aplica validate/validateId, delega al controller
   │
   ▼
controllers/    ← traduce HTTP (req/res) ↔ llamada de negocio; nunca contiene reglas de negocio
   │
   ▼
services/       ← reglas de negocio puras; no conoce req/res/códigos HTTP; lanza ErrorHttp
   │
   ▼
Prisma (config/database.js) → PostgreSQL
```

**Por qué esta arquitectura:** separa "cómo llega la petición" (routes/controllers) de "qué significa para el negocio" (services), permitiendo cambiar el transporte (HTTP nativo → Express) o el almacenamiento (memoria → PostgreSQL) sin tocar las otras capas — así fue posible migrar `pacientes.service.js` de un arreglo en memoria a Prisma en la Semana 6 sin modificar `pacientes.controller.js` ni `pacientes.routes.js`.

## Trazabilidad con el Hito 1 (docs/)

| Artefacto Hito 1 | Elemento técnico resultante |
|---|---|
| `docs/diagrama-clases.png` — clases Usuario, Paciente, Cita, Examen, Factura | `prisma/schema.prisma` (modelos 1:1 con los atributos del diagrama) |
| `docs/diagrama-clases.png` — relación Usuario 1→0..* Cita (atiende), Paciente 1→0..* Cita (agenda) | Claves foráneas `medicoId` y `pacienteId` en el modelo `Cita` |
| `docs/casos-de-uso.png` — "Agendar cita (consulta/examen)" | `POST /api/citas` (`src/routes/citas.routes.js` → `citas.service.js:crear`) |
| `docs/casos-de-uso.png` — "Cancelar / marcar inasistencia" | `PATCH /api/citas/:id/estado` |
| `docs/casos-de-uso.png` — "Reasignar cita prioritaria" | Lógica de reasignación en `citas.service.js:cambiarEstado` cuando `estado === 'NO_ASISTIO'` |
| `docs/casos-de-uso.png` — "Registrar resultado de examen" | `POST /api/citas/:id/examenes` |
| `docs/casos-de-uso.png` — "Generar factura PDF a EPS" | `POST /api/citas/:id/factura` |
| `docs/proceso-bpmn.png` — "Verificar disponibilidad" antes de agendar | Validación en `citas.service.js:crear` (rechaza doble-agenda del mismo médico en la misma fecha/hora) |
| `docs/proceso-bpmn.png` — rama "No asistió" → "¿Hay lista de espera?" → reasignar turno | `citas.service.js:cambiarEstado`: busca la próxima cita `prioridad: true` del mismo médico/día y le asigna la hora liberada |
| `docs/diagrama-secuencia.png` | Orden de las llamadas dentro de cada `service` (validar existencia → validar regla de negocio → persistir) |

## Decisión: Paciente como recurso principal de las Semanas 3–5

El dominio tiene varias entidades (Usuario, Paciente, Cita, Examen, Factura). Se eligió **Paciente** como recurso guía de las Semanas 3 a 5 (servidor nativo → Express → validación) por ser la entidad con menos dependencias (no requiere que existan Usuario ni Cita previamente), igual que lo pide el enunciado del taller con el ejemplo `/api/pacientes`. El resto del modelo (Cita, Examen, Factura, y la relación con Usuario) se incorpora completo en la Semana 6, una vez que hay persistencia real y tiene sentido modelar relaciones entre tablas.

## Nota de adaptación del dominio

El enunciado genérico del taller sugiere entidades `Sede`, `Servicio` y `HistoriaClinica` independientes. **No se usan** porque el diagrama de clases real del Hito 1 (`docs/diagrama-clases.png`) no las contempla: el "historial clínico" (caso de uso de `docs/casos-de-uso.png`) se resuelve consultando las Citas y Exámenes de un Paciente, y "Médico" no es una entidad propia sino un `Usuario` con `rol: MEDICO` y el campo `especialidad`. Se respeta el modelo ya aprobado en el Hito 1 en vez de imponer el genérico.

# API SaludIPS — Semana 5

Base URL: `http://localhost:3000/api`

## Pacientes

| Método | Ruta | 2xx | 4xx/5xx |
|---|---|---|---|
| GET | `/pacientes` | 200 | — |
| GET | `/pacientes/:id` | 200 | 400 (id inválido), 404 |
| POST | `/pacientes` | 201 | 400 (Zod), 409 (documento duplicado) |
| PUT | `/pacientes/:id` | 200 | 400, 404 |
| DELETE | `/pacientes/:id` | 204 | 400, 404 |

**POST /pacientes** — request:
```json
{ "nombre": "Mariana Pérez", "documento": "1017654321", "epsNombre": "Sanitas", "fechaNacimiento": "1999-05-02" }
```
response `201`:
```json
{ "id": 3, "nombre": "Mariana Pérez", "documento": "1017654321", "epsNombre": "Sanitas", "fechaNacimiento": "1999-05-02T00:00:00.000Z", "creadoEn": "2026-10-15T..." }
```
response `409` (documento repetido):
```json
{ "error": "Ya existe un paciente con documento \"1017654321\"" }
```

## Citas

| Método | Ruta | 2xx | 4xx/5xx |
|---|---|---|---|
| GET | `/citas?medicoId=&pacienteId=&estado=` | 200 | — |
| GET | `/citas/:id` | 200 | 400, 404 |
| POST | `/citas` | 201 | 400 (Zod / paciente o médico inexistente), 409 (médico ya ocupado) |
| PATCH | `/citas/:id/estado` | 200 | 400, 404 |

**POST /citas** — request:
```json
{ "pacienteId": 1, "medicoId": 1, "fecha": "2026-10-20", "hora": "09:00", "tipo": "CONSULTA" }
```
response `409` (choque de horario):
```json
{ "error": "El médico ya tiene una cita programada en ese horario" }
```

**PATCH /citas/:id/estado** — marcar inasistencia (dispara reasignación automática si hay una cita prioritaria posterior el mismo día):
```json
{ "estado": "NO_ASISTIO" }
```
response `200`:
```json
{ "cita": { "id": 5, "estado": "NO_ASISTIO", ... }, "reasignada": { "id": 8, "hora": "09:00", ... } }
```
`reasignada: null` cuando no había ninguna cita prioritaria esperando ese horario.

## Exámenes (subrecurso de Cita)

| Método | Ruta | 2xx | 4xx/5xx |
|---|---|---|---|
| POST | `/citas/:id/examenes` | 201 | 400 (cita no es tipo EXAMEN), 404, 409 (cita cancelada/no asistida) |
| GET | `/citas/:id/examenes` | 200 | 400 |

## Factura (subrecurso de Cita)

| Método | Ruta | 2xx | 4xx/5xx |
|---|---|---|---|
| POST | `/citas/:id/factura` | 201 | 400 (Zod), 404, 409 (cita no ATENDIDA o ya facturada) |
| GET | `/citas/:id/factura` | 200 | 404 (sin factura) |

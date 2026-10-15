// src/servidor-nativo.js — Semana 3: servidor HTTP nativo (sin Express) para /api/pacientes
// Trazabilidad: entidad Paciente tomada de docs/diagrama-clases.png (id, nombre, documento, epsNombre, fechaNacimiento)
import http from 'node:http';

let pacientes = [
  { id: 1, nombre: 'Laura Gómez', documento: '1053812345', epsNombre: 'Nueva EPS', fechaNacimiento: '1994-03-12' },
  { id: 2, nombre: 'Carlos Ramírez', documento: '1053898765', epsNombre: 'Sura', fechaNacimiento: '1988-07-25' },
];
let siguienteId = 3;

function responderJson(res, codigo, datos) {
  res.writeHead(codigo, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(datos === null ? '' : JSON.stringify(datos));
}

function leerBody(req) {
  return new Promise((resolve, reject) => {
    let cuerpo = '';
    req.on('data', (pedazo) => { cuerpo += pedazo; });
    req.on('end', () => {
      if (cuerpo === '') return resolve(null);
      try { resolve(JSON.parse(cuerpo)); } catch { reject(new Error('JSON inválido')); }
    });
    req.on('error', reject);
  });
}

const servidor = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const partes = url.pathname.split('/').filter(Boolean);

  if (partes[0] !== 'api' || partes[1] !== 'pacientes') {
    return responderJson(res, 404, { error: 'Ruta no encontrada' });
  }
  const id = partes[2] ? Number(partes[2]) : null;

  try {
    if (req.method === 'GET' && id === null) {
      return responderJson(res, 200, pacientes);
    }
    if (req.method === 'GET') {
      const paciente = pacientes.find((p) => p.id === id);
      if (!paciente) return responderJson(res, 404, { error: 'Paciente no encontrado' });
      return responderJson(res, 200, paciente);
    }
    if (req.method === 'POST' && id === null) {
      const body = await leerBody(req);
      if (!body || !body.nombre || !body.documento) {
        return responderJson(res, 400, { error: 'nombre y documento son obligatorios' });
      }
      if (pacientes.some((p) => p.documento === body.documento)) {
        return responderJson(res, 409, { error: `Ya existe un paciente con documento "${body.documento}"` });
      }
      const nuevo = {
        id: siguienteId++,
        nombre: body.nombre,
        documento: body.documento,
        epsNombre: body.epsNombre ?? null,
        fechaNacimiento: body.fechaNacimiento ?? null,
      };
      pacientes.push(nuevo);
      return responderJson(res, 201, nuevo);
    }
    if (req.method === 'PUT' && id !== null) {
      const paciente = pacientes.find((p) => p.id === id);
      if (!paciente) return responderJson(res, 404, { error: 'Paciente no encontrado' });
      const body = await leerBody(req);
      if (!body) return responderJson(res, 400, { error: 'Body requerido' });
      Object.assign(paciente, body, { id: paciente.id });
      return responderJson(res, 200, paciente);
    }
    if (req.method === 'DELETE' && id !== null) {
      const existe = pacientes.some((p) => p.id === id);
      if (!existe) return responderJson(res, 404, { error: 'Paciente no encontrado' });
      pacientes = pacientes.filter((p) => p.id !== id);
      return responderJson(res, 204, null);
    }
    return responderJson(res, 405, { error: `Método ${req.method} no permitido` });
  } catch (error) {
    const codigo = error.message === 'JSON inválido' ? 400 : 500;
    return responderJson(res, codigo, { error: error.message });
  }
});

servidor.listen(3000, () => {
  console.log('SaludIPS (nativo) en http://localhost:3000');
});

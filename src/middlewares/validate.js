// src/middlewares/validate.js — Semana 5: valida req.body contra un esquema Zod
export function validate(esquema) {
  return (req, res, next) => {
    const resultado = esquema.safeParse(req.body);
    if (!resultado.success) {
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles: resultado.error.issues.map((i) => ({
          campo: i.path.join('.'),
          mensaje: i.message,
        })),
      });
    }
    req.body = resultado.data; // body ya saneado/convertido por Zod
    next();
  };
}

import { query } from 'express-validator';

export const reporteRevisionValidator = [
  query('fecha_inicio')
    .optional()
    .isISO8601()
    .withMessage('fecha_inicio debe ser una fecha válida en formato ISO 8601'),
  
  query('fecha_fin')
    .optional()
    .isISO8601()
    .withMessage('fecha_fin debe ser una fecha válida en formato ISO 8601'),
  
  query('estado_revision')
    .optional()
    .isIn(['EN_REGISTRO', 'PENDIENTE_REVISION', 'APROBADO', 'RECHAZADO'])
    .withMessage('estado_revision debe ser uno de: EN_REGISTRO, PENDIENTE_REVISION, APROBADO, RECHAZADO'),
];

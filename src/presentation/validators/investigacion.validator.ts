import { body, query, param } from 'express-validator';

export const createInvestigacionValidator = [
  body('codigo_caso')
    .notEmpty().withMessage('El código de caso es obligatorio')
    .isLength({ max: 50 }).withMessage('El código de caso no puede exceder 50 caracteres'),
  
  body('nombre_caso')
    .notEmpty().withMessage('El nombre del caso es obligatorio')
    .isLength({ max: 255 }).withMessage('El nombre del caso no puede exceder 255 caracteres'),
  
  body('fecha_inicio')
    .notEmpty().withMessage('La fecha de inicio es obligatoria')
    .isISO8601().withMessage('La fecha de inicio debe ser una fecha válida'),
  
  body('id_fiscalia')
    .notEmpty().withMessage('La fiscalía es obligatoria')
    .isInt({ min: 1 }).withMessage('La fiscalía debe ser un ID válido'),
  
  body('descripcion_hechos')
    .optional()
    .isString().withMessage('La descripción debe ser texto'),
];

export const updateInvestigacionValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de expediente inválido'),
  
  body('nombre_caso')
    .optional()
    .isLength({ max: 255 }).withMessage('El nombre del caso no puede exceder 255 caracteres'),
  
  body('fecha_inicio')
    .optional()
    .isISO8601().withMessage('La fecha de inicio debe ser una fecha válida'),
  
  body('id_fiscalia')
    .optional()
    .isInt({ min: 1 }).withMessage('La fiscalía debe ser un ID válido'),
  
  body('descripcion_hechos')
    .optional()
    .isString().withMessage('La descripción debe ser texto'),
  
  body('activo')
    .optional()
    .isBoolean().withMessage('El campo activo debe ser booleano'),
];

export const sendToReviewValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de expediente inválido'),
];

export const approveInvestigacionValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de expediente inválido'),
];

export const rejectInvestigacionValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de expediente inválido'),
  
  body('justificacion')
    .notEmpty().withMessage('La justificación es obligatoria')
    .isLength({ min: 10 }).withMessage('La justificación debe tener al menos 10 caracteres'),
];

export const investigacionFiltersValidator = [
  query('activo')
    .optional()
    .isBoolean().withMessage('El filtro activo debe ser booleano'),
  
  query('estado_revision')
    .optional()
    .isIn(['EN_REGISTRO', 'PENDIENTE_REVISION', 'APROBADO', 'RECHAZADO'])
    .withMessage('Estado de revisión inválido'),
  
  query('id_usuario_registro')
    .optional()
    .isInt({ min: 1 }).withMessage('El ID de usuario debe ser un número válido'),
  
  query('id_fiscalia')
    .optional()
    .isInt({ min: 1 }).withMessage('El ID de fiscalía debe ser un número válido'),
];

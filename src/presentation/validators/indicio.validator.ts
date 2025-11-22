import { body, query, param } from 'express-validator';

export const createIndicioValidator = [
  body('codigo_indicio')
    .notEmpty().withMessage('El código de indicio es obligatorio')
    .isLength({ max: 50 }).withMessage('El código no puede exceder 50 caracteres'),
  
  body('id_escena')
    .notEmpty().withMessage('El ID de escena es obligatorio')
    .isInt({ min: 1 }).withMessage('El ID de escena debe ser un número válido'),
  
  body('id_tipo_indicio')
    .notEmpty().withMessage('El tipo de indicio es obligatorio')
    .isInt({ min: 1 }).withMessage('El tipo de indicio debe ser un ID válido'),
  
  body('descripcion_corta')
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ max: 255 }).withMessage('La descripción no puede exceder 255 caracteres'),
  
  body('ubicacion_especifica')
    .optional()
    .isLength({ max: 100 }).withMessage('La ubicación no puede exceder 100 caracteres'),
  
  body('fecha_hora_recoleccion')
    .optional()
    .isISO8601().withMessage('La fecha de recolección debe ser válida'),
];

export const updateIndicioValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de indicio inválido'),
  
  body('descripcion_corta')
    .optional()
    .isLength({ max: 255 }).withMessage('La descripción no puede exceder 255 caracteres'),
  
  body('ubicacion_especifica')
    .optional()
    .isLength({ max: 100 }).withMessage('La ubicación no puede exceder 100 caracteres'),
  
  body('fecha_hora_recoleccion')
    .optional()
    .isISO8601().withMessage('La fecha de recolección debe ser válida'),
  
  body('id_tipo_indicio')
    .optional()
    .isInt({ min: 1 }).withMessage('El tipo de indicio debe ser un ID válido'),
  
  body('estado_actual')
    .optional()
    .isIn(['RECOLECTADO', 'EN_CUSTODIA', 'EN_ANALISIS', 'ANALIZADO', 'DEVUELTO'])
    .withMessage('Estado de indicio inválido'),
];

export const indicioFiltersValidator = [
  query('activo')
    .optional()
    .isBoolean().withMessage('El filtro activo debe ser booleano'),
  
  query('id_escena')
    .optional()
    .isInt({ min: 1 }).withMessage('El ID de escena debe ser un número válido'),
  
  query('id_tipo_indicio')
    .optional()
    .isInt({ min: 1 }).withMessage('El ID de tipo debe ser un número válido'),
  
  query('estado_actual')
    .optional()
    .isIn(['RECOLECTADO', 'EN_CUSTODIA', 'EN_ANALISIS', 'ANALIZADO', 'DEVUELTO'])
    .withMessage('Estado de indicio inválido'),
];

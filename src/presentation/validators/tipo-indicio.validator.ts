import { body, query } from 'express-validator';

export const createTipoIndicioValidator = [
  body('nombre_tipo')
    .notEmpty()
    .withMessage('El nombre del tipo de indicio es requerido')
    .trim()
    .isLength({ max: 100 })
    .withMessage('El nombre del tipo no puede exceder 100 caracteres'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La descripción no puede exceder 255 caracteres'),
];

export const updateTipoIndicioValidator = [
  body('nombre_tipo')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El nombre del tipo no puede exceder 100 caracteres'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La descripción no puede exceder 255 caracteres'),

  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe ser un booleano'),
];

export const tipoIndicioFiltersValidator = [
  query('activo')
    .optional()
    .isBoolean()
    .withMessage('El parámetro activo debe ser un booleano'),
];

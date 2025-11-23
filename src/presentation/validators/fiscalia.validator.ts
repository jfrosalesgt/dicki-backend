import { body, query } from 'express-validator';

export const createFiscaliaValidator = [
  body('nombre_fiscalia')
    .notEmpty()
    .withMessage('El nombre de la fiscalía es requerido')
    .trim()
    .isLength({ max: 150 })
    .withMessage('El nombre de la fiscalía no puede exceder 150 caracteres'),

  body('direccion')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La dirección no puede exceder 255 caracteres'),

  body('telefono')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('El teléfono no puede exceder 20 caracteres')
    .matches(/^[0-9+\-\s()]*$/)
    .withMessage('El teléfono solo puede contener números y caracteres válidos'),
];

export const updateFiscaliaValidator = [
  body('nombre_fiscalia')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('El nombre de la fiscalía no puede exceder 150 caracteres'),

  body('direccion')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La dirección no puede exceder 255 caracteres'),

  body('telefono')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('El teléfono no puede exceder 20 caracteres')
    .matches(/^[0-9+\-\s()]*$/)
    .withMessage('El teléfono solo puede contener números y caracteres válidos'),

  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe ser un booleano'),
];

export const fiscaliaFiltersValidator = [
  query('activo')
    .optional()
    .isBoolean()
    .withMessage('El parámetro activo debe ser un booleano'),
];

import { body } from 'express-validator';

export const createEscenaValidator = [
  body('nombre_escena')
    .notEmpty()
    .withMessage('El nombre de la escena es requerido')
    .isString()
    .withMessage('El nombre debe ser un texto')
    .isLength({ max: 150 })
    .withMessage('El nombre no puede exceder 150 caracteres'),

  body('direccion_escena')
    .notEmpty()
    .withMessage('La dirección de la escena es requerida')
    .isString()
    .withMessage('La dirección debe ser un texto')
    .isLength({ max: 255 })
    .withMessage('La dirección no puede exceder 255 caracteres'),

  body('fecha_hora_inicio')
    .notEmpty()
    .withMessage('La fecha/hora de inicio es requerida')
    .isISO8601()
    .withMessage('Formato de fecha/hora inválido (usar ISO 8601)'),

  body('fecha_hora_fin')
    .optional()
    .isISO8601()
    .withMessage('Formato de fecha/hora inválido (usar ISO 8601)'),

  body('descripcion')
    .optional()
    .isString()
    .withMessage('La descripción debe ser un texto'),
];

export const updateEscenaValidator = [
  body('nombre_escena')
    .optional()
    .isString()
    .withMessage('El nombre debe ser un texto')
    .isLength({ max: 150 })
    .withMessage('El nombre no puede exceder 150 caracteres'),

  body('direccion_escena')
    .optional()
    .isString()
    .withMessage('La dirección debe ser un texto')
    .isLength({ max: 255 })
    .withMessage('La dirección no puede exceder 255 caracteres'),

  body('fecha_hora_inicio')
    .optional()
    .isISO8601()
    .withMessage('Formato de fecha/hora inválido (usar ISO 8601)'),

  body('fecha_hora_fin')
    .optional()
    .isISO8601()
    .withMessage('Formato de fecha/hora inválido (usar ISO 8601)'),

  body('descripcion')
    .optional()
    .isString()
    .withMessage('La descripción debe ser un texto'),
];

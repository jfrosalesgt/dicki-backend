import { body } from 'express-validator';

export const loginValidator = [
  body('nombre_usuario')
    .notEmpty()
    .withMessage('El nombre de usuario es requerido')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres'),
  
  body('clave')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
];

export const changePasswordValidator = [
  body('clave_actual')
    .notEmpty()
    .withMessage('La contraseña actual es requerida')
    .isLength({ min: 6 })
    .withMessage('La contraseña actual debe tener al menos 6 caracteres'),
  
  body('clave_nueva')
    .notEmpty()
    .withMessage('La nueva contraseña es requerida')
    .isLength({ min: 6 })
    .withMessage('La nueva contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La nueva contraseña debe contener al menos una mayúscula, una minúscula y un número'),
];

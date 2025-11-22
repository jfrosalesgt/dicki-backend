import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ApiError } from '../../shared/utils/ApiError';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    // Ejecutar todas las validaciones
    await Promise.all(validations.map(validation => validation.run(req)));

    // Verificar errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => ({
        field: error.type === 'field' ? (error as any).path : 'unknown',
        message: error.msg,
      }));

      const error = ApiError.badRequest('Errores de validación');
      (error as any).details = errorMessages;
      next(error);
      return;
    }

    next();
  };
};

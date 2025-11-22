import { AuthRequest } from './auth.middleware';
import { Response, NextFunction } from 'express';
import { ApiError } from '../../shared/utils/ApiError';

/**
 * Middleware para verificar si el usuario tiene alguno de los roles especificados
 */
export const checkRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('Usuario no autenticado');
      }

      const userRoles = req.user.roles || [];
      const hasRole = allowedRoles.some(role => userRoles.includes(role));

      if (!hasRole) {
        throw ApiError.forbidden('No tiene permisos para acceder a este recurso');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

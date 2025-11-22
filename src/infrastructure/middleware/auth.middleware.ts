import { Request, Response, NextFunction } from 'express';
import { JwtUtils } from '../../shared/utils/jwt.utils';
import { ApiError } from '../../shared/utils/ApiError';

export interface AuthRequest extends Request {
  user?: {
    id_usuario: number;
    nombre_usuario: string;
    email: string;
    perfiles: number[];
    roles: string[];
  };
}

export const authMiddleware = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Token no proporcionado');
    }

    const token = authHeader.substring(7); // Remover 'Bearer '

    // Verificar token
    const decoded = JwtUtils.verifyToken(token);

    // Agregar información del usuario al request
    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

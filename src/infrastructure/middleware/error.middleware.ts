import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../shared/utils/ApiError';
import { ResponseHandler } from '../../shared/utils/ResponseHandler';

export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Si es un ApiError conocido
  if (err instanceof ApiError) {
    res.status(err.statusCode).json(
      ResponseHandler.error(err.message)
    );
    return;
  }

  // Error no manejado
  console.error('Error no manejado:', err);
  res.status(500).json(
    ResponseHandler.error('Error interno del servidor')
  );
};

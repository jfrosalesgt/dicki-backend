import { Response, NextFunction } from 'express';
import { TipoIndicioService } from '../../application/services/TipoIndicioService';
import { ResponseHandler } from '../../shared/utils/ResponseHandler';
import { CreateTipoIndicioDTO, UpdateTipoIndicioDTO } from '../../domain/entities/TipoIndicio';
import { AuthRequest } from '../../infrastructure/middleware/auth.middleware';

export class TipoIndicioController {
  private tipoIndicioService: TipoIndicioService;

  constructor() {
    this.tipoIndicioService = new TipoIndicioService();
  }

  getAllTiposIndicio = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { activo } = req.query;
      const filters = {
        activo: activo !== undefined ? activo === 'true' : undefined,
      };

      const tiposIndicio = await this.tipoIndicioService.getAllTiposIndicio(filters);
      res.json(ResponseHandler.success(tiposIndicio, 'Tipos de indicio obtenidos exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  getTipoIndicioById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const tipoIndicio = await this.tipoIndicioService.getTipoIndicioById(parseInt(id));
      res.json(ResponseHandler.success(tipoIndicio, 'Tipo de indicio encontrado'));
    } catch (error) {
      next(error);
    }
  };

  createTipoIndicio = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const dto: CreateTipoIndicioDTO = {
        ...req.body,
        usuario_creacion: req.user?.nombre_usuario || 'SYSTEM',
      };

      const tipoIndicio = await this.tipoIndicioService.createTipoIndicio(dto);
      res.status(201).json(ResponseHandler.success(tipoIndicio, 'Tipo de indicio creado exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  updateTipoIndicio = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const dto: UpdateTipoIndicioDTO = {
        ...req.body,
        usuario_actualizacion: req.user?.nombre_usuario || 'SYSTEM',
      };

      const tipoIndicio = await this.tipoIndicioService.updateTipoIndicio(parseInt(id), dto);
      res.json(ResponseHandler.success(tipoIndicio, 'Tipo de indicio actualizado exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  deleteTipoIndicio = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const usuario = req.user?.nombre_usuario || 'SYSTEM';

      await this.tipoIndicioService.deleteTipoIndicio(parseInt(id), usuario);
      res.json(ResponseHandler.success(null, 'Tipo de indicio desactivado exitosamente'));
    } catch (error) {
      next(error);
    }
  };
}

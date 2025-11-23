import { Response, NextFunction } from 'express';
import { FiscaliaService } from '../../application/services/FiscaliaService';
import { ResponseHandler } from '../../shared/utils/ResponseHandler';
import { CreateFiscaliaDTO, UpdateFiscaliaDTO } from '../../domain/entities/Fiscalia';
import { AuthRequest } from '../../infrastructure/middleware/auth.middleware';

export class FiscaliaController {
  private fiscaliaService: FiscaliaService;

  constructor() {
    this.fiscaliaService = new FiscaliaService();
  }

  getAllFiscalias = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { activo } = req.query;
      const filters = {
        activo: activo !== undefined ? activo === 'true' : undefined,
      };

      const fiscalias = await this.fiscaliaService.getAllFiscalias(filters);
      res.json(ResponseHandler.success(fiscalias, 'Fiscalías obtenidas exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  getFiscaliaById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const fiscalia = await this.fiscaliaService.getFiscaliaById(parseInt(id));
      res.json(ResponseHandler.success(fiscalia, 'Fiscalía encontrada'));
    } catch (error) {
      next(error);
    }
  };

  createFiscalia = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const dto: CreateFiscaliaDTO = {
        ...req.body,
        usuario_creacion: req.user?.nombre_usuario || 'SYSTEM',
      };

      const fiscalia = await this.fiscaliaService.createFiscalia(dto);
      res.status(201).json(ResponseHandler.success(fiscalia, 'Fiscalía creada exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  updateFiscalia = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const dto: UpdateFiscaliaDTO = {
        ...req.body,
        usuario_actualizacion: req.user?.nombre_usuario || 'SYSTEM',
      };

      const fiscalia = await this.fiscaliaService.updateFiscalia(parseInt(id), dto);
      res.json(ResponseHandler.success(fiscalia, 'Fiscalía actualizada exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  deleteFiscalia = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const usuario = req.user?.nombre_usuario || 'SYSTEM';

      await this.fiscaliaService.deleteFiscalia(parseInt(id), usuario);
      res.json(ResponseHandler.success(null, 'Fiscalía desactivada exitosamente'));
    } catch (error) {
      next(error);
    }
  };
}

import { Request, Response, NextFunction } from 'express';
import { IndicioService } from '../../application/services/IndicioService';
import { IndicioRepository } from '../../infrastructure/repositories/IndicioRepository';
import { EscenaRepository } from '../../infrastructure/repositories/EscenaRepository';
import { InvestigacionRepository } from '../../infrastructure/repositories/InvestigacionRepository';
import { CreateIndicioDTO, UpdateIndicioDTO, IndicioFilters } from '../../domain/entities/Indicio';
import { ResponseHandler } from '../../shared/utils/ResponseHandler';
import { AuthRequest } from '../../infrastructure/middleware/auth.middleware';

export class IndicioController {
  private indicioService: IndicioService;

  constructor() {
    const indicioRepository = new IndicioRepository();
    const escenaRepository = new EscenaRepository();
    const investigacionRepository = new InvestigacionRepository();
    this.indicioService = new IndicioService(indicioRepository, escenaRepository, investigacionRepository);
  }

  /**
   * GET /api/indicios
   * Obtener todos los indicios con filtros opcionales
   */
  getAllIndicios = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters: IndicioFilters = {
        activo: req.query.activo === 'true' ? true : req.query.activo === 'false' ? false : undefined,
        id_escena: req.query.id_escena ? parseInt(req.query.id_escena as string) : undefined,
        id_tipo_indicio: req.query.id_tipo_indicio ? parseInt(req.query.id_tipo_indicio as string) : undefined,
        estado_actual: req.query.estado_actual as string,
      };

      const indicios = await this.indicioService.getAllIndicios(filters);
      
      res.json(ResponseHandler.success(indicios, 'Indicios obtenidos exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/indicios/:id
   * Obtener un indicio por ID
   */
  getIndicioById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const indicio = await this.indicioService.getIndicioById(id);
      
      res.json(ResponseHandler.success(indicio, 'Indicio obtenido exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/expedientes/:id/indicios
   * Obtener todos los indicios de un expediente
   */
  getIndiciosByExpediente = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const idExpediente = parseInt(req.params.id);
      const indicios = await this.indicioService.getIndiciosByExpediente(idExpediente);
      
      res.json(ResponseHandler.success(indicios, 'Indicios del expediente obtenidos exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/expedientes/:id/indicios
   * Crear un nuevo indicio asociado a un expediente (a través de una escena)
   */
  createIndicio = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('Usuario no autenticado');
      }

      const indicioData: CreateIndicioDTO = {
        codigo_indicio: req.body.codigo_indicio,
        id_escena: req.body.id_escena,
        id_tipo_indicio: req.body.id_tipo_indicio,
        descripcion_corta: req.body.descripcion_corta,
        ubicacion_especifica: req.body.ubicacion_especifica,
        fecha_hora_recoleccion: req.body.fecha_hora_recoleccion ? new Date(req.body.fecha_hora_recoleccion) : new Date(),
        usuario_creacion: req.user.nombre_usuario,
      };

      const newIndicio = await this.indicioService.createIndicio(indicioData, req.user.id_usuario);
      
      res.status(201).json(ResponseHandler.success(newIndicio, 'Indicio creado exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/indicios/:id
   * Actualizar un indicio
   */
  updateIndicio = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('Usuario no autenticado');
      }

      const id = parseInt(req.params.id);
      const indicioData: UpdateIndicioDTO = {
        ...req.body,
        usuario_actualizacion: req.user.nombre_usuario,
      };

      await this.indicioService.updateIndicio(id, indicioData);
      
      res.json(ResponseHandler.success(null, 'Indicio actualizado exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/indicios/:id
   * Eliminar (desactivar) un indicio
   */
  deleteIndicio = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('Usuario no autenticado');
      }

      const id = parseInt(req.params.id);
      await this.indicioService.deleteIndicio(id, req.user.nombre_usuario);
      
      res.json(ResponseHandler.success(null, 'Indicio desactivado exitosamente'));
    } catch (error) {
      next(error);
    }
  };
}

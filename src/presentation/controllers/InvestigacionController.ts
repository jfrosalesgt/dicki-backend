import { Request, Response, NextFunction } from 'express';
import { InvestigacionService } from '../../application/services/InvestigacionService';
import { InvestigacionRepository } from '../../infrastructure/repositories/InvestigacionRepository';
import { CreateInvestigacionDTO, UpdateInvestigacionDTO, InvestigacionFilters } from '../../domain/entities/Investigacion';
import { ResponseHandler } from '../../shared/utils/ResponseHandler';
import { AuthRequest } from '../../infrastructure/middleware/auth.middleware';

export class InvestigacionController {
  private investigacionService: InvestigacionService;

  constructor() {
    const investigacionRepository = new InvestigacionRepository();
    this.investigacionService = new InvestigacionService(investigacionRepository);
  }

  /**
   * GET /api/expedientes
   * Obtener todos los expedientes con filtros opcionales
   */
  getAllInvestigaciones = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters: InvestigacionFilters = {
        activo: req.query.activo === 'true' ? true : req.query.activo === 'false' ? false : undefined,
        estado_revision: req.query.estado_revision as string,
        id_usuario_registro: req.query.id_usuario_registro ? parseInt(req.query.id_usuario_registro as string) : undefined,
        id_fiscalia: req.query.id_fiscalia ? parseInt(req.query.id_fiscalia as string) : undefined,
      };

      const investigaciones = await this.investigacionService.getAllInvestigaciones(filters);
      
      res.json(ResponseHandler.success(investigaciones, 'Expedientes obtenidos exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/expedientes/:id
   * Obtener un expediente por ID
   */
  getInvestigacionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const investigacion = await this.investigacionService.getInvestigacionById(id);
      
      res.json(ResponseHandler.success(investigacion, 'Expediente obtenido exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/expedientes
   * Crear un nuevo expediente
   */
  createInvestigacion = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('Usuario no autenticado');
      }

      const investigacionData: CreateInvestigacionDTO = {
        codigo_caso: req.body.codigo_caso,
        nombre_caso: req.body.nombre_caso,
        fecha_inicio: new Date(req.body.fecha_inicio),
        id_fiscalia: req.body.id_fiscalia,
        id_usuario_registro: req.user.id_usuario,
        descripcion_hechos: req.body.descripcion_hechos,
        usuario_creacion: req.user.nombre_usuario,
      }

      const newInvestigacion = await this.investigacionService.createInvestigacion(investigacionData);
      
      res.status(201).json(ResponseHandler.success(newInvestigacion, 'Expediente creado exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/expedientes/:id
   * Actualizar un expediente
   */
  updateInvestigacion = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('Usuario no autenticado');
      }

      const id = parseInt(req.params.id);
      const investigacionData: UpdateInvestigacionDTO = {
        ...req.body,
        usuario_actualizacion: req.user.nombre_usuario,
      };

      await this.investigacionService.updateInvestigacion(id, investigacionData);
      
      res.json(ResponseHandler.success(null, 'Expediente actualizado exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/expedientes/:id
   * Eliminar (desactivar) un expediente
   */
  deleteInvestigacion = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('Usuario no autenticado');
      }

      const id = parseInt(req.params.id);
      await this.investigacionService.deleteInvestigacion(id, req.user.nombre_usuario);
      
      res.json(ResponseHandler.success(null, 'Expediente desactivado exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/expedientes/:id/enviar-revision
   * Enviar expediente a revisión
   */
  sendToReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('Usuario no autenticado');
      }

      const id = parseInt(req.params.id);
      await this.investigacionService.sendToReview(id, req.user.nombre_usuario);
      
      res.json(ResponseHandler.success(null, 'Expediente enviado a revisión exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/expedientes/:id/aprobar
   * Aprobar expediente (solo coordinador)
   */
  approveInvestigacion = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('Usuario no autenticado');
      }

      const id = parseInt(req.params.id);
      await this.investigacionService.approveInvestigacion(
        id,
        req.user.id_usuario,
        req.user.nombre_usuario
      );
      
      res.json(ResponseHandler.success(null, 'Expediente aprobado exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/expedientes/:id/rechazar
   * Rechazar expediente (solo coordinador)
   */
  rejectInvestigacion = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('Usuario no autenticado');
      }

      const id = parseInt(req.params.id);
      const { justificacion } = req.body;

      await this.investigacionService.rejectInvestigacion(
        id,
        req.user.id_usuario,
        justificacion,
        req.user.nombre_usuario
      );
      
      res.json(ResponseHandler.success(null, 'Expediente rechazado exitosamente'));
    } catch (error) {
      next(error);
    }
  };
}

import { Request, Response, NextFunction } from 'express';
import { EscenaService } from '../../application/services/EscenaService';
import { EscenaRepository } from '../../infrastructure/repositories/EscenaRepository';
import { InvestigacionRepository } from '../../infrastructure/repositories/InvestigacionRepository';
import { CreateEscenaDTO, UpdateEscenaDTO } from '../../domain/entities/Escena';
import { ResponseHandler } from '../../shared/utils/ResponseHandler';
import { AuthRequest } from '../../infrastructure/middleware/auth.middleware';

export class EscenaController {
  private escenaService: EscenaService;

  constructor() {
    const escenaRepository = new EscenaRepository();
    const investigacionRepository = new InvestigacionRepository();
    this.escenaService = new EscenaService(escenaRepository, investigacionRepository);
  }

  /**
   * GET /api/expedientes/:id/escenas
   * Obtener todas las escenas de un expediente
   */
  getEscenasByExpediente = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const idExpediente = parseInt(req.params.id);
      const escenas = await this.escenaService.getEscenasByExpediente(idExpediente);
      
      res.json(ResponseHandler.success(escenas, 'Escenas del expediente obtenidas exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/escenas/:id
   * Obtener una escena por ID
   */
  getEscenaById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const escena = await this.escenaService.getEscenaById(id);
      
      res.json(ResponseHandler.success(escena, 'Escena obtenida exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/expedientes/:id/escenas
   * Crear una nueva escena asociada a un expediente
   */
  createEscena = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('Usuario no autenticado');
      }

      const idExpediente = parseInt(req.params.id);

      const escenaData: CreateEscenaDTO = {
        id_investigacion: idExpediente,
        nombre_escena: req.body.nombre_escena,
        direccion_escena: req.body.direccion_escena,
        fecha_hora_inicio: new Date(req.body.fecha_hora_inicio),
        fecha_hora_fin: req.body.fecha_hora_fin ? new Date(req.body.fecha_hora_fin) : undefined,
        descripcion: req.body.descripcion,
        usuario_creacion: req.user.nombre_usuario,
      };

      const newEscena = await this.escenaService.createEscena(escenaData);
      
      res.status(201).json(ResponseHandler.success(newEscena, 'Escena creada exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/escenas/:id
   * Actualizar una escena
   */
  updateEscena = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('Usuario no autenticado');
      }

      const id = parseInt(req.params.id);
      const escenaData: UpdateEscenaDTO = {
        nombre_escena: req.body.nombre_escena,
        direccion_escena: req.body.direccion_escena,
        fecha_hora_inicio: req.body.fecha_hora_inicio ? new Date(req.body.fecha_hora_inicio) : undefined,
        fecha_hora_fin: req.body.fecha_hora_fin ? new Date(req.body.fecha_hora_fin) : undefined,
        descripcion: req.body.descripcion,
        usuario_actualizacion: req.user.nombre_usuario,
      };

      await this.escenaService.updateEscena(id, escenaData);
      
      res.json(ResponseHandler.success(null, 'Escena actualizada exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/escenas/:id
   * Eliminar (desactivar) una escena
   */
  deleteEscena = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('Usuario no autenticado');
      }

      const id = parseInt(req.params.id);
      await this.escenaService.deleteEscena(id, req.user.nombre_usuario);
      
      res.json(ResponseHandler.success(null, 'Escena desactivada exitosamente'));
    } catch (error) {
      next(error);
    }
  };
}

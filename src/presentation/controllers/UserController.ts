import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../application/services/UserService';
import { UsuarioRepository } from '../../infrastructure/repositories/UsuarioRepository';
import { CreateUsuarioDTO, UpdateUsuarioDTO } from '../../domain/entities/Usuario';
import { ResponseHandler } from '../../shared/utils/ResponseHandler';
import { AuthRequest } from '../../infrastructure/middleware/auth.middleware';

export class UserController {
  private userService: UserService;

  constructor() {
    const usuarioRepository = new UsuarioRepository();
    this.userService = new UserService(usuarioRepository);
  }

  /**
   * GET /api/users
   * Obtiene todos los usuarios
   */
  getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const activo = req.query.activo === 'true' ? true : req.query.activo === 'false' ? false : undefined;
      const usuarios = await this.userService.getAllUsers(activo);
      
      res.json(ResponseHandler.success(usuarios, 'Usuarios obtenidos exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/users/:id
   * Obtiene un usuario por ID
   */
  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const usuario = await this.userService.getUserById(id);
      
      res.json(ResponseHandler.success(usuario, 'Usuario obtenido exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/users
   * Crea un nuevo usuario
   */
  createUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUsuarioDTO = {
        ...req.body,
        usuario_creacion: req.user?.nombre_usuario || 'SYSTEM',
      };

      const newUser = await this.userService.createUser(userData);
      
      res.status(201).json(ResponseHandler.success(newUser, 'Usuario creado exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/users/:id
   * Actualiza un usuario
   */
  updateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const userData: UpdateUsuarioDTO = {
        ...req.body,
        usuario_actualizacion: req.user?.nombre_usuario || 'SYSTEM',
      };

      await this.userService.updateUser(id, userData);
      
      res.json(ResponseHandler.success(null, 'Usuario actualizado exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/users/:id/activate
   * Activa un usuario
   */
  activateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.userService.activateUser(id, req.user?.nombre_usuario || 'SYSTEM');
      
      res.json(ResponseHandler.success(null, 'Usuario activado exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/users/:id/deactivate
   * Desactiva un usuario
   */
  deactivateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.userService.deactivateUser(id, req.user?.nombre_usuario || 'SYSTEM');
      
      res.json(ResponseHandler.success(null, 'Usuario desactivado exitosamente'));
    } catch (error) {
      next(error);
    }
  };
}

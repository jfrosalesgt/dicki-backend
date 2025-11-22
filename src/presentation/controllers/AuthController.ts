import { Request, Response, NextFunction } from 'express';
import { AuthService, LoginDTO, ChangePaswordDTO } from '../../application/services/AuthService';
import { UsuarioRepository } from '../../infrastructure/repositories/UsuarioRepository';
import { PerfilRepository } from '../../infrastructure/repositories/PerfilRepository';
import { RoleRepository } from '../../infrastructure/repositories/RoleRepository';
import { ResponseHandler } from '../../shared/utils/ResponseHandler';
import { AuthRequest } from '../../infrastructure/middleware/auth.middleware';
import { logger } from '../../shared/utils/logger';

export class AuthController {
  private authService: AuthService;

  constructor() {
    const usuarioRepository = new UsuarioRepository();
    const perfilRepository = new PerfilRepository();
    const roleRepository = new RoleRepository();
    
    this.authService = new AuthService(
      usuarioRepository,
      perfilRepository,
      roleRepository
    );
  }

  /**
   * POST /api/auth/login
   * Login de usuario
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginData: LoginDTO = req.body;
      const result = await this.authService.login(loginData);

      logger.success('Login exitoso', { usuario: loginData.nombre_usuario });
      
      res.json(ResponseHandler.success(result, '✨ Login exitoso ✨'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/auth/change-password
   * Cambio de contraseña del usuario autenticado
   */
  changePassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('Usuario no autenticado');
      }

      const changePasswordData: ChangePaswordDTO = {
        id_usuario: req.user.id_usuario,
        clave_actual: req.body.clave_actual,
        clave_nueva: req.body.clave_nueva,
        usuario_actualizacion: req.user.nombre_usuario,
      };

      await this.authService.changePassword(changePasswordData);
      
      res.json(ResponseHandler.success(null, 'Contraseña cambiada exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/auth/verify
   * Verifica el token del usuario
   */
  verifyToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Si llegó hasta aquí, el token es válido (pasó por el middleware de auth)
      res.json(ResponseHandler.success(req.user, 'Token válido'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/auth/me
   * Obtiene información del usuario autenticado
   */
  getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('Usuario no autenticado');
      }

      res.json(ResponseHandler.success(req.user, 'Información del usuario'));
    } catch (error) {
      next(error);
    }
  };
}

import { AuthService, LoginDTO } from '.././../application/services/AuthService';
import { IUsuarioRepository } from '.././../domain/interfaces/IUsuarioRepository';
import { IPerfilRepository } from '.././../domain/interfaces/IPerfilRepository';
import { IRoleRepository } from '.././../domain/interfaces/IRoleRepository';
import { IModuloRepository } from '.././../domain/interfaces/IModuloRepository';
import { Usuario } from '.././../domain/entities/Usuario';
import { CryptoUtils } from '../../shared/utils/crypto.utils';
import { JwtUtils } from '../../shared/utils/jwt.utils';

// Mocks
jest.mock('../../shared/utils/crypto.utils');
jest.mock('../../shared/utils/jwt.utils');

describe('AuthService', () => {
  let authService: AuthService;
  let mockUsuarioRepository: jest.Mocked<IUsuarioRepository>;
  let mockPerfilRepository: jest.Mocked<IPerfilRepository>;
  let mockRoleRepository: jest.Mocked<IRoleRepository>;
  let mockModuloRepository: jest.Mocked<IModuloRepository>;

  beforeEach(() => {
    // Crear mocks de los repositorios
    mockUsuarioRepository = {
      findById: jest.fn(),
      findByUsername: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updatePassword: jest.fn(),
      updateLastAccess: jest.fn(),
      incrementFailedAttempts: jest.fn(),
      resetFailedAttempts: jest.fn(),
      findAll: jest.fn(),
    } as any;

    mockPerfilRepository = {
      findByUsuario: jest.fn(),
    } as any;

    mockRoleRepository = {
      findByUsuario: jest.fn(),
    } as any;

    mockModuloRepository = {
      findByUsuario: jest.fn(),
    } as any;

    // Crear instancia del servicio con mocks
    authService = new AuthService(
      mockUsuarioRepository,
      mockPerfilRepository,
      mockRoleRepository,
      mockModuloRepository
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debería realizar login exitoso con credenciales válidas', async () => {
      // Arrange
      const loginData: LoginDTO = {
        nombre_usuario: 'admin',
        clave: 'Admin123!',
      };

      const mockUsuario: Usuario = {
        id_usuario: 1,
        nombre_usuario: 'admin',
        clave: 'hashed_password',
        nombre: 'Admin',
        apellido: 'Sistema',
        email: 'admin@dicri.com',
        activo: true,
        cambiar_clave: false,
        intentos_fallidos: 0,
        usuario_creacion: 'system',
        fecha_creacion: new Date(),
      };

      const mockPerfiles = [{ id_perfil: 1, nombre_perfil: 'Administrador' }];
      const mockRoles = [{ id_role: 1, nombre_role: 'ADMIN' }];
      const mockModulos = [{ id_modulo: 1, nombre_modulo: 'Dashboard', orden: 1 }];

      mockUsuarioRepository.findByUsername.mockResolvedValue(mockUsuario);
      mockPerfilRepository.findByUsuario.mockResolvedValue(mockPerfiles as any);
      mockRoleRepository.findByUsuario.mockResolvedValue(mockRoles as any);
      mockModuloRepository.findByUsuario.mockResolvedValue(mockModulos as any);
      
      (CryptoUtils.compareMd5 as jest.Mock).mockReturnValue(true);
      (JwtUtils.generateToken as jest.Mock).mockReturnValue('mock_token');

      // Act
      const result = await authService.login(loginData);

      // Assert
      expect(result).toHaveProperty('token', 'mock_token');
      expect(result.usuario.nombre_usuario).toBe('admin');
      expect(mockUsuarioRepository.resetFailedAttempts).toHaveBeenCalledWith(1);
      expect(mockUsuarioRepository.updateLastAccess).toHaveBeenCalledWith(1);
    });

    it('debería lanzar error con credenciales inválidas', async () => {
      // Arrange
      const loginData: LoginDTO = {
        nombre_usuario: 'usuario_inexistente',
        clave: 'wrongpassword',
      };

      mockUsuarioRepository.findByUsername.mockResolvedValue(null);

      // Act & Assert
      await expect(authService.login(loginData)).rejects.toThrow('Credenciales inválidas');
    });

    it('debería lanzar error si el usuario está inactivo', async () => {
      // Arrange
      const loginData: LoginDTO = {
        nombre_usuario: 'admin',
        clave: 'Admin123!',
      };

      const mockUsuario: Usuario = {
        id_usuario: 1,
        nombre_usuario: 'admin',
        clave: 'hashed_password',
        nombre: 'Admin',
        apellido: 'Sistema',
        email: 'admin@dicri.com',
        activo: false, // ← Usuario inactivo
        cambiar_clave: false,
        intentos_fallidos: 0,
        usuario_creacion: 'system',
        fecha_creacion: new Date(),
      };

      mockUsuarioRepository.findByUsername.mockResolvedValue(mockUsuario);

      // Act & Assert
      await expect(authService.login(loginData)).rejects.toThrow(
        'Usuario inactivo. Contacte al administrador'
      );
    });

    it('debería lanzar error si el usuario está bloqueado', async () => {
      // Arrange
      const loginData: LoginDTO = {
        nombre_usuario: 'admin',
        clave: 'Admin123!',
      };

      const mockUsuario: Usuario = {
        id_usuario: 1,
        nombre_usuario: 'admin',
        clave: 'hashed_password',
        nombre: 'Admin',
        apellido: 'Sistema',
        email: 'admin@dicri.com',
        activo: true,
        cambiar_clave: false,
        intentos_fallidos: 5, // ← Usuario bloqueado
        usuario_creacion: 'system',
        fecha_creacion: new Date(),
      };

      mockUsuarioRepository.findByUsername.mockResolvedValue(mockUsuario);

      // Act & Assert
      await expect(authService.login(loginData)).rejects.toThrow(
        'Usuario bloqueado por múltiples intentos fallidos. Contacte al administrador'
      );
    });

    it('debería incrementar intentos fallidos con contraseña incorrecta', async () => {
      // Arrange
      const loginData: LoginDTO = {
        nombre_usuario: 'admin',
        clave: 'wrongpassword',
      };

      const mockUsuario: Usuario = {
        id_usuario: 1,
        nombre_usuario: 'admin',
        clave: 'hashed_password',
        nombre: 'Admin',
        apellido: 'Sistema',
        email: 'admin@dicri.com',
        activo: true,
        cambiar_clave: false,
        intentos_fallidos: 2,
        usuario_creacion: 'system',
        fecha_creacion: new Date(),
      };

      mockUsuarioRepository.findByUsername.mockResolvedValue(mockUsuario);
      (CryptoUtils.compareMd5 as jest.Mock).mockReturnValue(false);

      // Act & Assert
      await expect(authService.login(loginData)).rejects.toThrow('Credenciales inválidas');
      expect(mockUsuarioRepository.incrementFailedAttempts).toHaveBeenCalledWith(1);
    });
  });

  describe('changePassword', () => {
    it('debería cambiar la contraseña exitosamente', async () => {
      // Arrange
      const changePasswordData = {
        id_usuario: 1,
        clave_actual: 'OldPassword123!',
        clave_nueva: 'NewPassword123!',
        usuario_actualizacion: 'admin',
      };

      const mockUsuario: Usuario = {
        id_usuario: 1,
        nombre_usuario: 'admin',
        clave: 'hashed_old_password',
        nombre: 'Admin',
        apellido: 'Sistema',
        email: 'admin@dicri.com',
        activo: true,
        cambiar_clave: false,
        intentos_fallidos: 0,
        usuario_creacion: 'system',
        fecha_creacion: new Date(),
      };

      mockUsuarioRepository.findById.mockResolvedValue(mockUsuario);
      (CryptoUtils.compareMd5 as jest.Mock).mockReturnValue(true);
      (CryptoUtils.md5Hash as jest.Mock).mockReturnValue('hashed_new_password');

      // Act
      await authService.changePassword(changePasswordData);

      // Assert
      expect(mockUsuarioRepository.updatePassword).toHaveBeenCalledWith(
        1,
        'hashed_new_password',
        'admin'
      );
    });

    it('debería lanzar error si la contraseña actual es incorrecta', async () => {
      // Arrange
      const changePasswordData = {
        id_usuario: 1,
        clave_actual: 'WrongPassword',
        clave_nueva: 'NewPassword123!',
        usuario_actualizacion: 'admin',
      };

      const mockUsuario: Usuario = {
        id_usuario: 1,
        nombre_usuario: 'admin',
        clave: 'hashed_password',
        nombre: 'Admin',
        apellido: 'Sistema',
        email: 'admin@dicri.com',
        activo: true,
        cambiar_clave: false,
        intentos_fallidos: 0,
        usuario_creacion: 'system',
        fecha_creacion: new Date(),
      };

      mockUsuarioRepository.findById.mockResolvedValue(mockUsuario);
      (CryptoUtils.compareMd5 as jest.Mock).mockReturnValue(false);

      // Act & Assert
      await expect(authService.changePassword(changePasswordData)).rejects.toThrow(
        'La contraseña actual es incorrecta'
      );
    });

    it('debería lanzar error si la nueva contraseña es igual a la actual', async () => {
      // Arrange
      const changePasswordData = {
        id_usuario: 1,
        clave_actual: 'SamePassword123!',
        clave_nueva: 'SamePassword123!',
        usuario_actualizacion: 'admin',
      };

      const mockUsuario: Usuario = {
        id_usuario: 1,
        nombre_usuario: 'admin',
        clave: 'hashed_password',
        nombre: 'Admin',
        apellido: 'Sistema',
        email: 'admin@dicri.com',
        activo: true,
        cambiar_clave: false,
        intentos_fallidos: 0,
        usuario_creacion: 'system',
        fecha_creacion: new Date(),
      };

      mockUsuarioRepository.findById.mockResolvedValue(mockUsuario);
      (CryptoUtils.compareMd5 as jest.Mock).mockReturnValue(true);

      // Act & Assert
      await expect(authService.changePassword(changePasswordData)).rejects.toThrow(
        'La nueva contraseña debe ser diferente a la actual'
      );
    });
  });
});

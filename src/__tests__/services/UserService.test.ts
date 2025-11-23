import { UserService } from '../../application/services/UserService';
import { IUsuarioRepository } from '../../domain/interfaces/IUsuarioRepository';
import { CreateUsuarioDTO, Usuario } from '../../domain/entities/Usuario';
import { CryptoUtils } from '../../shared/utils/crypto.utils';

// Mock
jest.mock('../../shared/utils/crypto.utils');

describe('UserService', () => {
  let userService: UserService;
  let mockUsuarioRepository: jest.Mocked<IUsuarioRepository>;

  beforeEach(() => {
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

    userService = new UserService(mockUsuarioRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('debería crear un usuario exitosamente', async () => {
      // Arrange
      const createUserData: CreateUsuarioDTO = {
        nombre_usuario: 'nuevo_usuario',
        clave: 'Password123!',
        nombre: 'Nuevo',
        apellido: 'Usuario',
        email: 'nuevo@dicri.com',
        usuario_creacion: 'admin',
      };

      const mockCreatedUser: Usuario = {
        id_usuario: 2,
        ...createUserData,
        clave: 'hashed_password',
        activo: true,
        cambiar_clave: false,
        intentos_fallidos: 0,
        fecha_creacion: new Date(),
      };

      mockUsuarioRepository.findByUsername.mockResolvedValue(null);
      mockUsuarioRepository.findByEmail.mockResolvedValue(null);
      (CryptoUtils.md5Hash as jest.Mock).mockReturnValue('hashed_password');
      mockUsuarioRepository.create.mockResolvedValue(mockCreatedUser);

      // Act
      const result = await userService.createUser(createUserData);

      // Assert
      expect(result.id_usuario).toBe(2);
      expect(result.nombre_usuario).toBe('nuevo_usuario');
      expect(CryptoUtils.md5Hash).toHaveBeenCalledWith('Password123!');
      expect(mockUsuarioRepository.create).toHaveBeenCalledWith({
        ...createUserData,
        clave: 'hashed_password',
      });
    });

    it('debería lanzar error si el nombre de usuario ya existe', async () => {
      // Arrange
      const createUserData: CreateUsuarioDTO = {
        nombre_usuario: 'admin',
        clave: 'Password123!',
        nombre: 'Test',
        apellido: 'User',
        email: 'test@dicri.com',
        usuario_creacion: 'admin',
      };

      const existingUser: Usuario = {
        id_usuario: 1,
        nombre_usuario: 'admin',
        clave: 'hashed',
        nombre: 'Admin',
        apellido: 'Sistema',
        email: 'admin@dicri.com',
        activo: true,
        cambiar_clave: false,
        intentos_fallidos: 0,
        usuario_creacion: 'system',
        fecha_creacion: new Date(),
      };

      mockUsuarioRepository.findByUsername.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(userService.createUser(createUserData)).rejects.toThrow(
        'El nombre de usuario ya está en uso'
      );
    });

    it('debería lanzar error si el email ya existe', async () => {
      // Arrange
      const createUserData: CreateUsuarioDTO = {
        nombre_usuario: 'nuevo_usuario',
        clave: 'Password123!',
        nombre: 'Test',
        apellido: 'User',
        email: 'admin@dicri.com',
        usuario_creacion: 'admin',
      };

      const existingUser: Usuario = {
        id_usuario: 1,
        nombre_usuario: 'admin',
        clave: 'hashed',
        nombre: 'Admin',
        apellido: 'Sistema',
        email: 'admin@dicri.com',
        activo: true,
        cambiar_clave: false,
        intentos_fallidos: 0,
        usuario_creacion: 'system',
        fecha_creacion: new Date(),
      };

      mockUsuarioRepository.findByUsername.mockResolvedValue(null);
      mockUsuarioRepository.findByEmail.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(userService.createUser(createUserData)).rejects.toThrow(
        'El email ya está registrado'
      );
    });
  });

  describe('getUserById', () => {
    it('debería obtener un usuario por ID exitosamente', async () => {
      // Arrange
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

      // Act
      const result = await userService.getUserById(1);

      // Assert
      expect(result.id_usuario).toBe(1);
      expect(result.nombre_usuario).toBe('admin');
      expect(mockUsuarioRepository.findById).toHaveBeenCalledWith(1);
    });

    it('debería lanzar error si el usuario no existe', async () => {
      // Arrange
      mockUsuarioRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.getUserById(999)).rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('updateUser', () => {
    it('debería actualizar un usuario exitosamente', async () => {
      // Arrange
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

      const updateData = {
        nombre: 'Administrador',
        apellido: 'Principal',
        usuario_actualizacion: 'admin',
      };

      mockUsuarioRepository.findById.mockResolvedValue(mockUsuario);
      mockUsuarioRepository.update.mockResolvedValue();

      // Act
      await userService.updateUser(1, updateData);

      // Assert
      expect(mockUsuarioRepository.update).toHaveBeenCalledWith(1, updateData);
    });

    it('debería lanzar error si intenta actualizar email duplicado', async () => {
      // Arrange
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

      const otherUser: Usuario = {
        id_usuario: 2,
        nombre_usuario: 'otro',
        clave: 'hashed',
        nombre: 'Otro',
        apellido: 'Usuario',
        email: 'otro@dicri.com',
        activo: true,
        cambiar_clave: false,
        intentos_fallidos: 0,
        usuario_creacion: 'system',
        fecha_creacion: new Date(),
      };

      mockUsuarioRepository.findById.mockResolvedValue(mockUsuario);
      mockUsuarioRepository.findByEmail.mockResolvedValue(otherUser);

      // Act & Assert
      await expect(
        userService.updateUser(1, {
          email: 'otro@dicri.com',
          usuario_actualizacion: 'admin',
        })
      ).rejects.toThrow('El email ya está registrado');
    });
  });

  describe('getAllUsers', () => {
    it('debería obtener todos los usuarios activos', async () => {
      // Arrange
      const mockUsuarios: Usuario[] = [
        {
          id_usuario: 1,
          nombre_usuario: 'admin',
          clave: 'hashed',
          nombre: 'Admin',
          apellido: 'Sistema',
          email: 'admin@dicri.com',
          activo: true,
          cambiar_clave: false,
          intentos_fallidos: 0,
          usuario_creacion: 'system',
          fecha_creacion: new Date(),
        },
        {
          id_usuario: 2,
          nombre_usuario: 'tecnico',
          clave: 'hashed',
          nombre: 'Técnico',
          apellido: 'DICRI',
          email: 'tecnico@dicri.com',
          activo: true,
          cambiar_clave: false,
          intentos_fallidos: 0,
          usuario_creacion: 'admin',
          fecha_creacion: new Date(),
        },
      ];

      mockUsuarioRepository.findAll.mockResolvedValue(mockUsuarios);

      // Act
      const result = await userService.getAllUsers(true);

      // Assert
      expect(result).toHaveLength(2);
      expect(mockUsuarioRepository.findAll).toHaveBeenCalledWith(true);
    });
  });
});

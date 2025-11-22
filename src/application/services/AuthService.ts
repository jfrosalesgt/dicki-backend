import { IUsuarioRepository } from '../../domain/interfaces/IUsuarioRepository';
import { IPerfilRepository } from '../../domain/interfaces/IPerfilRepository';
import { IRoleRepository } from '../../domain/interfaces/IRoleRepository';
import { CryptoUtils } from '../../shared/utils/crypto.utils';
import { JwtUtils, JwtPayload } from '../../shared/utils/jwt.utils';
import { ApiError } from '../../shared/utils/ApiError';

export interface LoginDTO {
  nombre_usuario: string;
  clave: string;
}

export interface LoginResponse {
  token: string;
  usuario: {
    id_usuario: number;
    nombre_usuario: string;
    nombre: string;
    apellido: string;
    email: string;
    cambiar_clave: boolean;
  };
  perfiles: any[];
  roles: any[];
}

export interface ChangePaswordDTO {
  id_usuario: number;
  clave_actual: string;
  clave_nueva: string;
  usuario_actualizacion: string;
}

export class AuthService {
  constructor(
    private usuarioRepository: IUsuarioRepository,
    private perfilRepository: IPerfilRepository,
    private roleRepository: IRoleRepository
  ) {}

  async login(loginData: LoginDTO): Promise<LoginResponse> {
    // Buscar usuario
    const usuario = await this.usuarioRepository.findByUsername(loginData.nombre_usuario);
    
    if (!usuario) {
      throw ApiError.unauthorized('Credenciales inválidas');
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      throw ApiError.forbidden('Usuario inactivo');
    }

    // Verificar intentos fallidos (bloquear después de 5 intentos)
    if (usuario.intentos_fallidos >= 5) {
      throw ApiError.forbidden('Usuario bloqueado por múltiples intentos fallidos. Contacte al administrador.');
    }

    // Verificar contraseña
    const isPasswordValid = CryptoUtils.compareMd5(loginData.clave, usuario.clave);
    
    if (!isPasswordValid) {
      // Incrementar intentos fallidos
      await this.usuarioRepository.incrementFailedAttempts(usuario.id_usuario);
      throw ApiError.unauthorized('Credenciales inválidas');
    }

    // Resetear intentos fallidos y actualizar último acceso
    await this.usuarioRepository.resetFailedAttempts(usuario.id_usuario);
    await this.usuarioRepository.updateLastAccess(usuario.id_usuario);

    // Obtener perfiles y roles del usuario
    const perfiles = await this.perfilRepository.findByUsuario(usuario.id_usuario);
    const roles = await this.roleRepository.findByUsuario(usuario.id_usuario);

    // Crear payload del JWT
    const payload: JwtPayload = {
      id_usuario: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      email: usuario.email,
      perfiles: perfiles.map(p => p.id_perfil),
      roles: roles.map(r => r.nombre_role),
    };

    // Generar token
    const token = JwtUtils.generateToken(payload);

    return {
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre_usuario: usuario.nombre_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        cambiar_clave: usuario.cambiar_clave,
      },
      perfiles,
      roles,
    };
  }

  async changePassword(changePasswordData: ChangePaswordDTO): Promise<void> {
    // Buscar usuario
    const usuario = await this.usuarioRepository.findById(changePasswordData.id_usuario);
    
    if (!usuario) {
      throw ApiError.notFound('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = CryptoUtils.compareMd5(
      changePasswordData.clave_actual,
      usuario.clave
    );
    
    if (!isCurrentPasswordValid) {
      throw ApiError.badRequest('La contraseña actual es incorrecta');
    }

    // Validar que la nueva contraseña sea diferente
    if (changePasswordData.clave_actual === changePasswordData.clave_nueva) {
      throw ApiError.badRequest('La nueva contraseña debe ser diferente a la actual');
    }

    // Hashear nueva contraseña con MD5
    const hashedPassword = CryptoUtils.md5Hash(changePasswordData.clave_nueva);

    // Actualizar contraseña
    await this.usuarioRepository.updatePassword(
      changePasswordData.id_usuario,
      hashedPassword,
      changePasswordData.usuario_actualizacion
    );
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return JwtUtils.verifyToken(token);
    } catch (error) {
      throw ApiError.unauthorized('Token inválido o expirado');
    }
  }
}

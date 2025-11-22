import { IUsuarioRepository } from '../../domain/interfaces/IUsuarioRepository';
import { IPerfilRepository } from '../../domain/interfaces/IPerfilRepository';
import { IRoleRepository } from '../../domain/interfaces/IRoleRepository';
import { IModuloRepository } from '../../domain/interfaces/IModuloRepository';
import { Modulo } from '../../domain/entities/Modulo';
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
  modulos: Modulo[];
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
    private roleRepository: IRoleRepository,
    private moduloRepository: IModuloRepository
  ) {}

  async login(loginData: LoginDTO): Promise<LoginResponse> {
    // Buscar usuario por nombre de usuario
    const usuario = await this.usuarioRepository.findByUsername(loginData.nombre_usuario);
    
    if (!usuario) {
      throw ApiError.unauthorized('Credenciales inválidas');
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      throw ApiError.forbidden('Usuario inactivo. Contacte al administrador');
    }

    // Verificar si el usuario está bloqueado por múltiples intentos fallidos
    if (usuario.intentos_fallidos >= 5) {
      throw ApiError.forbidden('Usuario bloqueado por múltiples intentos fallidos. Contacte al administrador');
    }

    // Verificar contraseña
    const isPasswordValid = CryptoUtils.compareMd5(loginData.clave, usuario.clave);
    
    if (!isPasswordValid) {
      // Incrementar intentos fallidos
      await this.usuarioRepository.incrementFailedAttempts(usuario.id_usuario);
      throw ApiError.unauthorized('Credenciales inválidas');
    }

    // Resetear intentos fallidos si el login fue exitoso
    await this.usuarioRepository.resetFailedAttempts(usuario.id_usuario);
    
    // Actualizar último acceso
    await this.usuarioRepository.updateLastAccess(usuario.id_usuario);

    // Obtener perfiles, roles Y MÓDULOS del usuario
    const perfiles = await this.perfilRepository.findByUsuario(usuario.id_usuario);
    const roles = await this.roleRepository.findByUsuario(usuario.id_usuario);
    const modulos = await this.moduloRepository.findByUsuario(usuario.id_usuario);

    // Ordenar módulos por el campo 'orden'
    const modulosOrdenados = modulos.sort((a, b) => a.orden - b.orden);

    // Crear payload del JWT
    const payload: JwtPayload = {
      id_usuario: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      email: usuario.email,
      perfiles: perfiles.map(p => p.id_perfil),
      roles: roles.map(r => r.nombre_role),
      modulos: modulosOrdenados.map(m => m.id_modulo)
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
      modulos: modulosOrdenados
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
    return JwtUtils.verifyToken(token);
  }
}

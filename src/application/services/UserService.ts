import { IUsuarioRepository } from '../../domain/interfaces/IUsuarioRepository';
import { CreateUsuarioDTO, UpdateUsuarioDTO, Usuario } from '../../domain/entities/Usuario';
import { CryptoUtils } from '../../shared/utils/crypto.utils';
import { ApiError } from '../../shared/utils/ApiError';

export class UserService {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async getUserById(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findById(id);
    
    if (!usuario) {
      throw ApiError.notFound('Usuario no encontrado');
    }

    return usuario;
  }

  async getUserByUsername(username: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findByUsername(username);
    
    if (!usuario) {
      throw ApiError.notFound('Usuario no encontrado');
    }

    return usuario;
  }

  async createUser(userData: CreateUsuarioDTO): Promise<Usuario> {
    // Verificar si el usuario ya existe
    const existingUser = await this.usuarioRepository.findByUsername(userData.nombre_usuario);
    if (existingUser) {
      throw ApiError.conflict('El nombre de usuario ya está en uso');
    }

    // Verificar si el email ya existe
    const existingEmail = await this.usuarioRepository.findByEmail(userData.email);
    if (existingEmail) {
      throw ApiError.conflict('El email ya está registrado');
    }

    // Hashear contraseña con MD5
    const hashedPassword = CryptoUtils.md5Hash(userData.clave);

    // Crear usuario
    const newUser = await this.usuarioRepository.create({
      ...userData,
      clave: hashedPassword,
    });

    return newUser;
  }

  async updateUser(id: number, userData: UpdateUsuarioDTO): Promise<void> {
    const usuario = await this.usuarioRepository.findById(id);
    
    if (!usuario) {
      throw ApiError.notFound('Usuario no encontrado');
    }

    // Si se actualiza el email, verificar que no esté en uso
    if (userData.email && userData.email !== usuario.email) {
      const existingEmail = await this.usuarioRepository.findByEmail(userData.email);
      if (existingEmail) {
        throw ApiError.conflict('El email ya está registrado');
      }
    }

    await this.usuarioRepository.update(id, userData);
  }

  async getAllUsers(activo?: boolean): Promise<Usuario[]> {
    return await this.usuarioRepository.findAll(activo);
  }

  async activateUser(id: number, usuario_actualizacion: string): Promise<void> {
    await this.updateUser(id, { activo: true, usuario_actualizacion });
  }

  async deactivateUser(id: number, usuario_actualizacion: string): Promise<void> {
    await this.updateUser(id, { activo: false, usuario_actualizacion });
  }
}

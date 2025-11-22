import { Usuario, CreateUsuarioDTO, UpdateUsuarioDTO } from '../entities/Usuario';

export interface IUsuarioRepository {
  findById(id: number): Promise<Usuario | null>;
  findByUsername(username: string): Promise<Usuario | null>;
  findByEmail(email: string): Promise<Usuario | null>;
  create(usuario: CreateUsuarioDTO): Promise<Usuario>;
  update(id: number, usuario: UpdateUsuarioDTO): Promise<void>;
  updatePassword(id: number, newPassword: string, usuario_actualizacion: string): Promise<void>;
  updateLastAccess(id: number): Promise<void>;
  incrementFailedAttempts(id: number): Promise<void>;
  resetFailedAttempts(id: number): Promise<void>;
  findAll(activo?: boolean): Promise<Usuario[]>;
}

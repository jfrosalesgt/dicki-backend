import sql from 'mssql';
import { IUsuarioRepository } from '../../domain/interfaces/IUsuarioRepository';
import { Usuario, CreateUsuarioDTO, UpdateUsuarioDTO } from '../../domain/entities/Usuario';
import Database from '../database/connection';

export class UsuarioRepository implements IUsuarioRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async findById(id: number): Promise<Usuario | null> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('id_usuario', sql.Int, id)
      .execute('sp_Usuario_FindById');

    return result.recordset[0] || null;
  }

  async findByUsername(username: string): Promise<Usuario | null> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('nombre_usuario', sql.NVarChar(50), username)
      .execute('sp_Usuario_FindByUsername');

    return result.recordset[0] || null;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('email', sql.NVarChar(100), email)
      .execute('sp_Usuario_FindByEmail');

    return result.recordset[0] || null;
  }

  async create(usuario: CreateUsuarioDTO): Promise<Usuario> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('nombre_usuario', sql.NVarChar(50), usuario.nombre_usuario)
      .input('clave', sql.NVarChar(255), usuario.clave)
      .input('nombre', sql.NVarChar(100), usuario.nombre)
      .input('apellido', sql.NVarChar(100), usuario.apellido)
      .input('email', sql.NVarChar(100), usuario.email)
      .input('usuario_creacion', sql.NVarChar(50), usuario.usuario_creacion)
      .execute('sp_Usuario_Create');

    return result.recordset[0];
  }

  async update(id: number, usuario: UpdateUsuarioDTO): Promise<void> {
    const pool = this.db.getPool();
    await pool
      .request()
      .input('id_usuario', sql.Int, id)
      .input('nombre', sql.NVarChar(100), usuario.nombre)
      .input('apellido', sql.NVarChar(100), usuario.apellido)
      .input('email', sql.NVarChar(100), usuario.email)
      .input('activo', sql.Bit, usuario.activo)
      .input('usuario_actualizacion', sql.NVarChar(50), usuario.usuario_actualizacion)
      .execute('sp_Usuario_Update');
  }

  async updatePassword(id: number, newPassword: string, usuario_actualizacion: string): Promise<void> {
    const pool = this.db.getPool();
    await pool
      .request()
      .input('id_usuario', sql.Int, id)
      .input('clave', sql.NVarChar(255), newPassword)
      .input('usuario_actualizacion', sql.NVarChar(50), usuario_actualizacion)
      .execute('sp_Usuario_UpdatePassword');
  }

  async updateLastAccess(id: number): Promise<void> {
    const pool = this.db.getPool();
    await pool
      .request()
      .input('id_usuario', sql.Int, id)
      .execute('sp_Usuario_UpdateLastAccess');
  }

  async incrementFailedAttempts(id: number): Promise<void> {
    const pool = this.db.getPool();
    await pool
      .request()
      .input('id_usuario', sql.Int, id)
      .execute('sp_Usuario_IncrementFailedAttempts');
  }

  async resetFailedAttempts(id: number): Promise<void> {
    const pool = this.db.getPool();
    await pool
      .request()
      .input('id_usuario', sql.Int, id)
      .execute('sp_Usuario_ResetFailedAttempts');
  }

  async findAll(activo?: boolean): Promise<Usuario[]> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('activo', sql.Bit, activo)
      .execute('sp_Usuario_FindAll');
    
    return result.recordset;
  }
}
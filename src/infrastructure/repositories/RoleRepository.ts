import sql from 'mssql';
import { IRoleRepository } from '../../domain/interfaces/IRoleRepository';
import { Role, CreateRoleDTO, UpdateRoleDTO } from '../../domain/entities/Role';
import Database from '../database/connection';

export class RoleRepository implements IRoleRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async findById(id: number): Promise<Role | null> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('id_role', sql.Int, id)
      .execute('sp_Role_FindById');

    return result.recordset[0] || null;
  }

  async findByName(nombre: string): Promise<Role | null> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('nombre_role', sql.NVarChar(100), nombre)
      .execute('sp_Role_FindByName');

    return result.recordset[0] || null;
  }

  async create(role: CreateRoleDTO): Promise<Role> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('nombre_role', sql.NVarChar(100), role.nombre_role)
      .input('descripcion', sql.NVarChar(255), role.descripcion || null)
      .input('usuario_creacion', sql.NVarChar(50), role.usuario_creacion)
      .execute('sp_Role_Create');

    return result.recordset[0];
  }

  async update(id: number, role: UpdateRoleDTO): Promise<void> {
    const pool = this.db.getPool();
    await pool
      .request()
      .input('id_role', sql.Int, id)
      .input('nombre_role', sql.NVarChar(100), role.nombre_role)
      .input('descripcion', sql.NVarChar(255), role.descripcion)
      .input('activo', sql.Bit, role.activo)
      .input('usuario_actualizacion', sql.NVarChar(50), role.usuario_actualizacion)
      .execute('sp_Role_Update');
  }

  async findAll(activo?: boolean): Promise<Role[]> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('activo', sql.Bit, activo)
      .execute('sp_Role_FindAll');
    
    return result.recordset;
  }

  async findByUsuario(idUsuario: number): Promise<Role[]> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('id_usuario', sql.Int, idUsuario)
      .execute('sp_Role_FindByUsuario');

    return result.recordset;
  }
}
import sql from 'mssql';
import { IPerfilRepository } from '../../domain/interfaces/IPerfilRepository';
import { Perfil, CreatePerfilDTO, UpdatePerfilDTO } from '../../domain/entities/Perfil';
import Database from '../database/connection';

export class PerfilRepository implements IPerfilRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async findById(id: number): Promise<Perfil | null> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('id_perfil', sql.Int, id)
      .execute('sp_Perfil_FindById');

    return result.recordset[0] || null;
  }

  async findByName(nombre: string): Promise<Perfil | null> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('nombre_perfil', sql.NVarChar(100), nombre)
      .execute('sp_Perfil_FindByName');

    return result.recordset[0] || null;
  }

  async create(perfil: CreatePerfilDTO): Promise<Perfil> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('nombre_perfil', sql.NVarChar(100), perfil.nombre_perfil)
      .input('descripcion', sql.NVarChar(255), perfil.descripcion || null)
      .input('usuario_creacion', sql.NVarChar(50), perfil.usuario_creacion)
      .execute('sp_Perfil_Create');

    return result.recordset[0];
  }

  async update(id: number, perfil: UpdatePerfilDTO): Promise<void> {
    const pool = this.db.getPool();
    await pool
      .request()
      .input('id_perfil', sql.Int, id)
      .input('nombre_perfil', sql.NVarChar(100), perfil.nombre_perfil)
      .input('descripcion', sql.NVarChar(255), perfil.descripcion)
      .input('activo', sql.Bit, perfil.activo)
      .input('usuario_actualizacion', sql.NVarChar(50), perfil.usuario_actualizacion)
      .execute('sp_Perfil_Update');
  }

  async findAll(activo?: boolean): Promise<Perfil[]> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('activo', sql.Bit, activo)
      .execute('sp_Perfil_FindAll');
    
    return result.recordset;
  }

  async findByUsuario(idUsuario: number): Promise<Perfil[]> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('id_usuario', sql.Int, idUsuario)
      .execute('sp_Perfil_FindByUsuario');

    return result.recordset;
  }
}
import sql from 'mssql';
import { IModuloRepository } from '../../domain/interfaces/IModuloRepository';
import { Modulo, CreateModuloDTO, UpdateModuloDTO } from '../../domain/entities/Modulo';
import Database from '../database/connection';

export class ModuloRepository implements IModuloRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async findById(id: number): Promise<Modulo | null> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('id_modulo', sql.Int, id)
      .execute('sp_Modulo_FindById');

    return result.recordset[0] || null;
  }

  async create(modulo: CreateModuloDTO): Promise<Modulo> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('nombre_modulo', sql.NVarChar(100), modulo.nombre_modulo)
      .input('descripcion', sql.NVarChar(255), modulo.descripcion || null)
      .input('ruta', sql.NVarChar(255), modulo.ruta || null)
      .input('icono', sql.NVarChar(50), modulo.icono || null)
      .input('orden', sql.Int, modulo.orden || 0)
      .input('id_modulo_padre', sql.Int, modulo.id_modulo_padre || null)
      .input('usuario_creacion', sql.NVarChar(50), modulo.usuario_creacion)
      .execute('sp_Modulo_Create');

    return result.recordset[0];
  }

  async update(id: number, modulo: UpdateModuloDTO): Promise<void> {
    const pool = this.db.getPool();
    await pool
      .request()
      .input('id_modulo', sql.Int, id)
      .input('nombre_modulo', sql.NVarChar(100), modulo.nombre_modulo)
      .input('descripcion', sql.NVarChar(255), modulo.descripcion)
      .input('ruta', sql.NVarChar(255), modulo.ruta)
      .input('icono', sql.NVarChar(50), modulo.icono)
      .input('orden', sql.Int, modulo.orden)
      .input('id_modulo_padre', sql.Int, modulo.id_modulo_padre)
      .input('activo', sql.Bit, modulo.activo)
      .input('usuario_actualizacion', sql.NVarChar(50), modulo.usuario_actualizacion)
      .execute('sp_Modulo_Update');
  }

  async findAll(activo?: boolean): Promise<Modulo[]> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('activo', sql.Bit, activo)
      .execute('sp_Modulo_FindAll');
    
    return result.recordset;
  }

  async findByPerfil(idPerfil: number): Promise<Modulo[]> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('id_perfil', sql.Int, idPerfil)
      .execute('sp_Modulo_FindByPerfil');

    return result.recordset;
  }

  async findByUsuario(idUsuario: number): Promise<Modulo[]> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('id_usuario', sql.Int, idUsuario)
      .execute('sp_Modulo_FindByUsuario');

    return result.recordset;
  }
}
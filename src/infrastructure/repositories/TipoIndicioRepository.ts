import sql from 'mssql';
import { ITipoIndicioRepository } from '../../domain/interfaces/ITipoIndicioRepository';
import { TipoIndicio, CreateTipoIndicioDTO, UpdateTipoIndicioDTO, TipoIndicioFilters } from '../../domain/entities/TipoIndicio';
import Database from '../database/connection';

export class TipoIndicioRepository implements ITipoIndicioRepository {
  async findAll(filters?: TipoIndicioFilters): Promise<TipoIndicio[]> {
    const pool = await Database.getInstance().connect();
    const result = await pool
      .request()
      .input('activo', sql.Bit, filters?.activo ?? null)
      .execute('sp_TipoIndicio_FindAll');

    return result.recordset;
  }

  async findById(id: number): Promise<TipoIndicio | null> {
    const pool = await Database.getInstance().connect();
    const result = await pool
      .request()
      .input('id_tipo_indicio', sql.Int, id)
      .execute('sp_TipoIndicio_FindById');

    return result.recordset[0] || null;
  }

  async create(dto: CreateTipoIndicioDTO): Promise<TipoIndicio> {
    const pool = await Database.getInstance().connect();
    const result = await pool
      .request()
      .input('nombre_tipo', sql.NVarChar(100), dto.nombre_tipo)
      .input('descripcion', sql.NVarChar(255), dto.descripcion || null)
      .input('usuario_creacion', sql.NVarChar(50), dto.usuario_creacion)
      .execute('sp_TipoIndicio_Create');

    return result.recordset[0];
  }

  async update(id: number, dto: UpdateTipoIndicioDTO): Promise<void> {
    const pool = await Database.getInstance().connect();
    await pool
      .request()
      .input('id_tipo_indicio', sql.Int, id)
      .input('nombre_tipo', sql.NVarChar(100), dto.nombre_tipo || null)
      .input('descripcion', sql.NVarChar(255), dto.descripcion || null)
      .input('activo', sql.Bit, dto.activo ?? null)
      .input('usuario_actualizacion', sql.NVarChar(50), dto.usuario_actualizacion)
      .execute('sp_TipoIndicio_Update');
  }

  async delete(id: number, usuario: string): Promise<void> {
    const pool = await Database.getInstance().connect();
    await pool
      .request()
      .input('id_tipo_indicio', sql.Int, id)
      .input('usuario_actualizacion', sql.NVarChar(50), usuario)
      .execute('sp_TipoIndicio_Delete');
  }
}

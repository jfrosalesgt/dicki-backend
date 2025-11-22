import sql from 'mssql';
import { IFiscaliaRepository } from '../../domain/interfaces/IFiscaliaRepository';
import { Fiscalia, CreateFiscaliaDTO, UpdateFiscaliaDTO, FiscaliaFilters } from '../../domain/entities/Fiscalia';
import Database from '../database/connection';

export class FiscaliaRepository implements IFiscaliaRepository {
  async findAll(filters?: FiscaliaFilters): Promise<Fiscalia[]> {
    const pool = await Database.getInstance().connect();
    const result = await pool
      .request()
      .input('activo', sql.Bit, filters?.activo ?? null)
      .execute('sp_Fiscalia_FindAll');

    return result.recordset;
  }

  async findById(id: number): Promise<Fiscalia | null> {
    const pool = await Database.getInstance().connect();
    const result = await pool
      .request()
      .input('id_fiscalia', sql.Int, id)
      .execute('sp_Fiscalia_FindById');

    return result.recordset[0] || null;
  }

  async create(dto: CreateFiscaliaDTO): Promise<Fiscalia> {
    const pool = await Database.getInstance().connect();
    const result = await pool
      .request()
      .input('nombre_fiscalia', sql.NVarChar(150), dto.nombre_fiscalia)
      .input('direccion', sql.NVarChar(255), dto.direccion || null)
      .input('telefono', sql.NVarChar(20), dto.telefono || null)
      .input('usuario_creacion', sql.NVarChar(50), dto.usuario_creacion)
      .execute('sp_Fiscalia_Create');

    return result.recordset[0];
  }

  async update(id: number, dto: UpdateFiscaliaDTO): Promise<void> {
    const pool = await Database.getInstance().connect();
    await pool
      .request()
      .input('id_fiscalia', sql.Int, id)
      .input('nombre_fiscalia', sql.NVarChar(150), dto.nombre_fiscalia || null)
      .input('direccion', sql.NVarChar(255), dto.direccion || null)
      .input('telefono', sql.NVarChar(20), dto.telefono || null)
      .input('activo', sql.Bit, dto.activo ?? null)
      .input('usuario_actualizacion', sql.NVarChar(50), dto.usuario_actualizacion)
      .execute('sp_Fiscalia_Update');
  }

  async delete(id: number, usuario: string): Promise<void> {
    const pool = await Database.getInstance().connect();
    await pool
      .request()
      .input('id_fiscalia', sql.Int, id)
      .input('usuario_actualizacion', sql.NVarChar(50), usuario)
      .execute('sp_Fiscalia_Delete');
  }
}

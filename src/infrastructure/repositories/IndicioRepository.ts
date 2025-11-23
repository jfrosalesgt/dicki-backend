import sql from 'mssql';
import { IIndicioRepository } from '../../domain/interfaces/IIndicioRepository';
import { Indicio, CreateIndicioDTO, UpdateIndicioDTO, IndicioFilters } from '../../domain/entities/Indicio';
import Database from '../database/connection';

export class IndicioRepository implements IIndicioRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async findById(id: number): Promise<Indicio | null> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('id_indicio', sql.Int, id)
      .execute('sp_Indicio_FindById');

    return result.recordset[0] || null;
  }

  async create(indicio: CreateIndicioDTO): Promise<Indicio> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('codigo_indicio', sql.NVarChar(50), indicio.codigo_indicio)
      .input('id_escena', sql.Int, indicio.id_escena)
      .input('id_tipo_indicio', sql.Int, indicio.id_tipo_indicio)
      .input('descripcion_corta', sql.NVarChar(255), indicio.descripcion_corta)
      .input('ubicacion_especifica', sql.NVarChar(100), indicio.ubicacion_especifica || null)
      .input('fecha_hora_recoleccion', sql.DateTime, indicio.fecha_hora_recoleccion)
      .input('id_usuario_recolector', sql.Int, indicio.id_usuario_recolector)
      .input('usuario_creacion', sql.NVarChar(50), indicio.usuario_creacion)
      .execute('sp_Indicio_Create');

    return result.recordset[0];
  }

  async update(id: number, indicio: UpdateIndicioDTO): Promise<void> {
    const pool = this.db.getPool();
    await pool
      .request()
      .input('id_indicio', sql.Int, id)
      .input('descripcion_corta', sql.NVarChar(255), indicio.descripcion_corta || null)
      .input('ubicacion_especifica', sql.NVarChar(100), indicio.ubicacion_especifica || null)
      .input('fecha_hora_recoleccion', sql.DateTime, indicio.fecha_hora_recoleccion || null)
      .input('id_tipo_indicio', sql.Int, indicio.id_tipo_indicio || null)
      .input('estado_actual', sql.NVarChar(50), indicio.estado_actual || null)
      .input('usuario_actualizacion', sql.NVarChar(50), indicio.usuario_actualizacion)
      .execute('sp_Indicio_Update');
  }

  async delete(id: number, usuario_actualizacion: string): Promise<void> {
    const pool = this.db.getPool();
    await pool
      .request()
      .input('id_indicio', sql.Int, id)
      .input('usuario_actualizacion', sql.NVarChar(50), usuario_actualizacion)
      .execute('sp_Indicio_Delete');
  }

  async findAll(filters?: IndicioFilters): Promise<Indicio[]> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('activo', sql.Bit, filters?.activo !== undefined ? filters.activo : null)
      .execute('sp_Indicio_FindAll');

    let indicios: Indicio[] = result.recordset;

    // Filtros adicionales
    if (filters?.id_escena) {
      indicios = indicios.filter((ind) => ind.id_escena === filters.id_escena);
    }

    if (filters?.id_tipo_indicio) {
      indicios = indicios.filter((ind) => ind.id_tipo_indicio === filters.id_tipo_indicio);
    }

    if (filters?.estado_actual) {
      indicios = indicios.filter((ind) => ind.estado_actual === filters.estado_actual);
    }

    return indicios;
  }

  async findByEscena(idEscena: number): Promise<Indicio[]> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('activo', sql.Bit, true)
      .execute('sp_Indicio_FindAll');

    return result.recordset.filter((ind: Indicio) => ind.id_escena === idEscena);
  }
}

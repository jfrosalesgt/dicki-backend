import sql from 'mssql';
import { IInvestigacionRepository } from '../../domain/interfaces/IInvestigacionRepository';
import { Investigacion, CreateInvestigacionDTO, UpdateInvestigacionDTO, InvestigacionFilters } from '../../domain/entities/Investigacion';
import Database from '../database/connection';

export class InvestigacionRepository implements IInvestigacionRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async findById(id: number): Promise<Investigacion | null> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('id_investigacion', sql.Int, id)
      .execute('sp_Investigacion_FindById');

    return result.recordset[0] || null;
  }

  async create(investigacion: CreateInvestigacionDTO): Promise<Investigacion> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('codigo_caso', sql.NVarChar(50), investigacion.codigo_caso)
      .input('nombre_caso', sql.NVarChar(255), investigacion.nombre_caso)
      .input('fecha_inicio', sql.Date, investigacion.fecha_inicio)
      .input('id_fiscalia', sql.Int, investigacion.id_fiscalia)
      .input('id_usuario_registro', sql.Int, investigacion.id_usuario_registro)
      .input('descripcion_hechos', sql.NVarChar(sql.MAX), investigacion.descripcion_hechos || null)
      .input('usuario_creacion', sql.NVarChar(50), investigacion.usuario_creacion)
      .execute('sp_Investigacion_Create');

    return result.recordset[0];
  }

  async update(id: number, investigacion: UpdateInvestigacionDTO): Promise<void> {
    const pool = this.db.getPool();
    await pool
      .request()
      .input('id_investigacion', sql.Int, id)
      .input('nombre_caso', sql.NVarChar(255), investigacion.nombre_caso || null)
      .input('fecha_inicio', sql.Date, investigacion.fecha_inicio || null)
      .input('id_fiscalia', sql.Int, investigacion.id_fiscalia || null)
      .input('descripcion_hechos', sql.NVarChar(sql.MAX), investigacion.descripcion_hechos || null)
      .input('activo', sql.Bit, investigacion.activo !== undefined ? investigacion.activo : null)
      .input('usuario_actualizacion', sql.NVarChar(50), investigacion.usuario_actualizacion)
      .execute('sp_Investigacion_Update');
  }

  async delete(id: number, usuario_actualizacion: string): Promise<void> {
    const pool = this.db.getPool();
    await pool
      .request()
      .input('id_investigacion', sql.Int, id)
      .input('usuario_actualizacion', sql.NVarChar(50), usuario_actualizacion)
      .execute('sp_Investigacion_Delete');
  }

  async findAll(filters?: InvestigacionFilters): Promise<Investigacion[]> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('activo', sql.Bit, filters?.activo !== undefined ? filters.activo : null)
      .execute('sp_Investigacion_FindAll');

    let investigaciones: Investigacion[] = result.recordset;

    // Filtros adicionales que no están en el SP
    if (filters?.estado_revision) {
      investigaciones = investigaciones.filter(
        (inv) => inv.estado_revision_dicri === filters.estado_revision
      );
    }

    if (filters?.id_usuario_registro) {
      investigaciones = investigaciones.filter(
        (inv) => inv.id_usuario_registro === filters.id_usuario_registro
      );
    }

    if (filters?.id_fiscalia) {
      investigaciones = investigaciones.filter(
        (inv) => inv.id_fiscalia === filters.id_fiscalia
      );
    }

    return investigaciones;
  }

  async sendToReview(id: number, usuario_envio: string): Promise<void> {
    const pool = this.db.getPool();
    await pool
      .request()
      .input('id_investigacion', sql.Int, id)
      .input('usuario_envio', sql.NVarChar(50), usuario_envio)
      .execute('sp_Investigacion_SendToReview');
  }

  async approve(id: number, id_usuario_coordinador: number, usuario_actualizacion: string): Promise<void> {
    const pool = this.db.getPool();
    await pool
      .request()
      .input('id_investigacion', sql.Int, id)
      .input('id_usuario_coordinador', sql.Int, id_usuario_coordinador)
      .input('usuario_actualizacion', sql.NVarChar(50), usuario_actualizacion)
      .execute('sp_Investigacion_Approve');
  }

  async reject(id: number, id_usuario_coordinador: number, justificacion: string, usuario_actualizacion: string): Promise<void> {
    const pool = this.db.getPool();
    await pool
      .request()
      .input('id_investigacion', sql.Int, id)
      .input('id_usuario_coordinador', sql.Int, id_usuario_coordinador)
      .input('justificacion', sql.NVarChar(sql.MAX), justificacion)
      .input('usuario_actualizacion', sql.NVarChar(50), usuario_actualizacion)
      .execute('sp_Investigacion_Reject');
  }
}

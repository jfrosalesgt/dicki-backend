import sql from 'mssql';
import { IEscenaRepository } from '../../domain/interfaces/IEscenaRepository';
import { Escena, CreateEscenaDTO, UpdateEscenaDTO } from '../../domain/entities/Escena';
import Database from '../database/connection';

export class EscenaRepository implements IEscenaRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async findById(id: number): Promise<Escena | null> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('id_escena', sql.Int, id)
      .execute('sp_Escena_FindById');

    return result.recordset[0] || null;
  }

  async create(escena: CreateEscenaDTO): Promise<Escena> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('id_investigacion', sql.Int, escena.id_investigacion)
      .input('nombre_escena', sql.NVarChar(150), escena.nombre_escena)
      .input('direccion_escena', sql.NVarChar(255), escena.direccion_escena)
      .input('fecha_hora_inicio', sql.DateTime, escena.fecha_hora_inicio)
      .input('fecha_hora_fin', sql.DateTime, escena.fecha_hora_fin || null)
      .input('descripcion', sql.NVarChar(sql.MAX), escena.descripcion || null)
      .input('usuario_creacion', sql.NVarChar(50), escena.usuario_creacion)
      .execute('sp_Escena_Create');

    return result.recordset[0];
  }

  async update(id: number, escena: UpdateEscenaDTO): Promise<void> {
    const pool = this.db.getPool();
    await pool
      .request()
      .input('id_escena', sql.Int, id)
      .input('nombre_escena', sql.NVarChar(150), escena.nombre_escena || null)
      .input('direccion_escena', sql.NVarChar(255), escena.direccion_escena || null)
      .input('fecha_hora_inicio', sql.DateTime, escena.fecha_hora_inicio || null)
      .input('fecha_hora_fin', sql.DateTime, escena.fecha_hora_fin || null)
      .input('descripcion', sql.NVarChar(sql.MAX), escena.descripcion || null)
      .input('usuario_actualizacion', sql.NVarChar(50), escena.usuario_actualizacion)
      .execute('sp_Escena_Update');
  }

  async delete(id: number, usuario_actualizacion: string): Promise<void> {
    const pool = this.db.getPool();
    await pool
      .request()
      .input('id_escena', sql.Int, id)
      .input('usuario_actualizacion', sql.NVarChar(50), usuario_actualizacion)
      .execute('sp_Escena_Delete');
  }

  async findByInvestigacion(idInvestigacion: number): Promise<Escena[]> {
    const pool = this.db.getPool();
    const result = await pool
      .request()
      .input('id_investigacion', sql.Int, idInvestigacion)
      .execute('sp_Escena_FindByInvestigacion');

    return result.recordset;
  }
}

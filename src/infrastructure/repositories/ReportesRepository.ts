import sql from 'mssql';
import { IReportesRepository } from '../../domain/interfaces/IReportesRepository';
import { ReporteRevisionExpedientes, ReporteRevisionFilters, EstadisticasGenerales } from '../../domain/entities/Reporte';
import Database from '../database/connection';

export class ReportesRepository implements IReportesRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async obtenerReporteRevisionExpedientes(filters?: ReporteRevisionFilters): Promise<ReporteRevisionExpedientes[]> {
    const pool = this.db.getPool();
    
    const request = pool.request();

    // Agregar parámetros opcionales
    if (filters?.fecha_inicio) {
      request.input('fecha_inicio', sql.DateTime, filters.fecha_inicio);
    } else {
      request.input('fecha_inicio', sql.DateTime, null);
    }

    if (filters?.fecha_fin) {
      request.input('fecha_fin', sql.DateTime, filters.fecha_fin);
    } else {
      request.input('fecha_fin', sql.DateTime, null);
    }

    if (filters?.estado_revision) {
      request.input('estado_revision', sql.NVarChar(50), filters.estado_revision);
    } else {
      request.input('estado_revision', sql.NVarChar(50), null);
    }

    const result = await request.execute('sp_Reporte_Revision_Expedientes');

    return result.recordset;
  }

  async obtenerEstadisticasGenerales(): Promise<EstadisticasGenerales> {
    const pool = this.db.getPool();

    // Obtener conteos por estado
    const estadosResult = await pool.request().query(`
      SELECT 
        COUNT(*) as total_expedientes,
        SUM(CASE WHEN estado_revision_dicri = 'EN_REGISTRO' THEN 1 ELSE 0 END) as en_registro,
        SUM(CASE WHEN estado_revision_dicri = 'PENDIENTE_REVISION' THEN 1 ELSE 0 END) as pendiente_revision,
        SUM(CASE WHEN estado_revision_dicri = 'APROBADO' THEN 1 ELSE 0 END) as aprobados,
        SUM(CASE WHEN estado_revision_dicri = 'RECHAZADO' THEN 1 ELSE 0 END) as rechazados
      FROM Investigacion
      WHERE activo = 1
    `);

    // Obtener total de indicios
    const indiciosResult = await pool.request().query(`
      SELECT COUNT(*) as total_indicios
      FROM Indicio
      WHERE activo = 1
    `);

    // Obtener expedientes por fiscalía
    const fiscaliasResult = await pool.request().query(`
      SELECT 
        f.nombre_fiscalia,
        COUNT(i.id_investigacion) as total
      FROM Fiscalia f
      LEFT JOIN Investigacion i ON f.id_fiscalia = i.id_fiscalia AND i.activo = 1
      WHERE f.activo = 1
      GROUP BY f.nombre_fiscalia
      ORDER BY total DESC
    `);

    const estadisticas: EstadisticasGenerales = {
      total_expedientes: estadosResult.recordset[0].total_expedientes || 0,
      en_registro: estadosResult.recordset[0].en_registro || 0,
      pendiente_revision: estadosResult.recordset[0].pendiente_revision || 0,
      aprobados: estadosResult.recordset[0].aprobados || 0,
      rechazados: estadosResult.recordset[0].rechazados || 0,
      total_indicios: indiciosResult.recordset[0].total_indicios || 0,
      expedientes_por_fiscalia: fiscaliasResult.recordset.map((row: any) => ({
        nombre_fiscalia: row.nombre_fiscalia,
        total: row.total
      }))
    };

    return estadisticas;
  }
}

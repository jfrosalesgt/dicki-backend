import { ReporteRevisionExpedientes, ReporteRevisionFilters, EstadisticasGenerales } from '../entities/Reporte';

export interface IReportesRepository {
  obtenerReporteRevisionExpedientes(filters?: ReporteRevisionFilters): Promise<ReporteRevisionExpedientes[]>;
  obtenerEstadisticasGenerales(): Promise<EstadisticasGenerales>;
}

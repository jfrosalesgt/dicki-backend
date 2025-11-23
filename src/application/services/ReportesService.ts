import { IReportesRepository } from '../../domain/interfaces/IReportesRepository';
import { ReporteRevisionExpedientes, ReporteRevisionFilters, EstadisticasGenerales } from '../../domain/entities/Reporte';
import { ApiError } from '../../shared/utils/ApiError';

export class ReportesService {
  constructor(private reportesRepository: IReportesRepository) {}

  async obtenerReporteRevisionExpedientes(filters?: ReporteRevisionFilters): Promise<ReporteRevisionExpedientes[]> {
    // Validar que fecha_fin no sea anterior a fecha_inicio
    if (filters?.fecha_inicio && filters?.fecha_fin) {
      if (filters.fecha_fin < filters.fecha_inicio) {
        throw ApiError.badRequest('La fecha de fin no puede ser anterior a la fecha de inicio');
      }
    }

    // Validar estado de revisión si se proporciona
    const estadosValidos = ['EN_REGISTRO', 'PENDIENTE_REVISION', 'APROBADO', 'RECHAZADO'];
    if (filters?.estado_revision && !estadosValidos.includes(filters.estado_revision)) {
      throw ApiError.badRequest(`Estado de revisión inválido. Valores permitidos: ${estadosValidos.join(', ')}`);
    }

    const reporte = await this.reportesRepository.obtenerReporteRevisionExpedientes(filters);

    return reporte;
  }

  async obtenerEstadisticasGenerales(): Promise<EstadisticasGenerales> {
    const estadisticas = await this.reportesRepository.obtenerEstadisticasGenerales();
    
    return estadisticas;
  }
}

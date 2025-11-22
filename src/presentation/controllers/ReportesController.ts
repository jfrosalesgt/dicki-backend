import { Request, Response, NextFunction } from 'express';
import { ReportesService } from '../../application/services/ReportesService';
import { ReportesRepository } from '../../infrastructure/repositories/ReportesRepository';
import { ReporteRevisionFilters } from '../../domain/entities/Reporte';
import { ResponseHandler } from '../../shared/utils/ResponseHandler';

export class ReportesController {
  private reportesService: ReportesService;

  constructor() {
    const reportesRepository = new ReportesRepository();
    this.reportesService = new ReportesService(reportesRepository);
  }

  /**
   * GET /api/reportes/revision-expedientes
   * Obtener reporte de revisión de expedientes con filtros
   */
  getReporteRevisionExpedientes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters: ReporteRevisionFilters = {
        fecha_inicio: req.query.fecha_inicio ? new Date(req.query.fecha_inicio as string) : undefined,
        fecha_fin: req.query.fecha_fin ? new Date(req.query.fecha_fin as string) : undefined,
        estado_revision: req.query.estado_revision as string | undefined,
      };

      const reporte = await this.reportesService.obtenerReporteRevisionExpedientes(filters);
      
      res.json(ResponseHandler.success(reporte, 'Reporte de revisión de expedientes obtenido exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/reportes/estadisticas-generales
   * Obtener estadísticas generales del sistema
   */
  getEstadisticasGenerales = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const estadisticas = await this.reportesService.obtenerEstadisticasGenerales();
      
      res.json(ResponseHandler.success(estadisticas, 'Estadísticas generales obtenidas exitosamente'));
    } catch (error) {
      next(error);
    }
  };
}

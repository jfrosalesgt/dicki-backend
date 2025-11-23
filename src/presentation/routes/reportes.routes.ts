import { Router } from 'express';
import { ReportesController } from '../controllers/ReportesController';
import { authMiddleware } from '../../infrastructure/middleware/auth.middleware';
import { checkRole } from '../../infrastructure/middleware/role.middleware';
import { validate } from '../../infrastructure/middleware/validation.middleware';
import { reporteRevisionValidator } from '../validators/reportes.validator';

const router = Router();
const reportesController = new ReportesController();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: API para generación de reportes y estadísticas del sistema DICRI
 */

/**
 * @swagger
 * /api/reportes/revision-expedientes:
 *   get:
 *     summary: Obtener reporte de revisión de expedientes
 *     description: Genera un reporte detallado sobre registros, aprobaciones y rechazos de expedientes con filtros opcionales por fechas y estados
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-01-01"
 *         description: Fecha de inicio del período a consultar (formato ISO 8601)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-12-31"
 *         description: Fecha de fin del período a consultar (formato ISO 8601)
 *       - in: query
 *         name: estado_revision
 *         schema:
 *           type: string
 *           enum: [EN_REGISTRO, PENDIENTE_REVISION, APROBADO, RECHAZADO]
 *           example: "APROBADO"
 *         description: Filtrar por estado de revisión específico
 *     responses:
 *       200:
 *         description: Reporte generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Reporte de revisión de expedientes obtenido exitosamente
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ReporteRevisionExpedientes'
 *       400:
 *         description: Parámetros de filtro inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos para acceder a reportes
 */
router.get(
  '/revision-expedientes',
  checkRole('COORDINADOR_DICRI', 'ADMIN'),
  validate(reporteRevisionValidator),
  reportesController.getReporteRevisionExpedientes
);

/**
 * @swagger
 * /api/reportes/estadisticas-generales:
 *   get:
 *     summary: Obtener estadísticas generales del sistema
 *     description: Retorna estadísticas agregadas sobre expedientes, indicios y distribución por fiscalías
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Estadísticas generales obtenidas exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/EstadisticasGenerales'
 *       401:
 *         description: No autorizado
 */
router.get(
  '/estadisticas-generales',
  reportesController.getEstadisticasGenerales
);

export default router;

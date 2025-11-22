import { Router } from 'express';
import { IndicioController } from '../controllers/IndicioController';
import { authMiddleware } from '../../infrastructure/middleware/auth.middleware';
import { checkRole } from '../../infrastructure/middleware/role.middleware';
import { validate } from '../../infrastructure/middleware/validation.middleware';
import {
  updateIndicioValidator,
  indicioFiltersValidator,
} from '../validators/indicio.validator';

const router = Router();
const indicioController = new IndicioController();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * @swagger
 * /api/indicios:
 *   get:
 *     summary: Listar todos los indicios
 *     tags: [Indicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: activo
 *         schema:
 *           type: boolean
 *         description: Filtrar por indicios activos/inactivos
 *       - in: query
 *         name: id_escena
 *         schema:
 *           type: integer
 *         description: Filtrar por escena
 *       - in: query
 *         name: id_tipo_indicio
 *         schema:
 *           type: integer
 *         description: Filtrar por tipo de indicio
 *       - in: query
 *         name: estado_actual
 *         schema:
 *           type: string
 *           enum: [RECOLECTADO, EN_CUSTODIA, EN_ANALISIS, ANALIZADO, DEVUELTO]
 *         description: Filtrar por estado del indicio
 *     responses:
 *       200:
 *         description: Lista de indicios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Indicio'
 */
router.get(
  '/',
  validate(indicioFiltersValidator),
  indicioController.getAllIndicios
);

/**
 * @swagger
 * /api/indicios/{id}:
 *   get:
 *     summary: Obtener indicio por ID
 *     tags: [Indicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del indicio
 *     responses:
 *       200:
 *         description: Indicio encontrado
 *       404:
 *         description: Indicio no encontrado
 */
router.get('/:id', indicioController.getIndicioById);

/**
 * @swagger
 * /api/indicios/{id}:
 *   put:
 *     summary: Actualizar indicio
 *     tags: [Indicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateIndicioRequest'
 *     responses:
 *       200:
 *         description: Indicio actualizado exitosamente
 *       400:
 *         description: No se puede modificar un indicio de expediente aprobado
 *       404:
 *         description: Indicio no encontrado
 */
router.put(
  '/:id',
  checkRole('TECNICO_DICRI', 'COORDINADOR_DICRI', 'ADMIN'),
  validate(updateIndicioValidator),
  indicioController.updateIndicio
);

/**
 * @swagger
 * /api/indicios/{id}:
 *   delete:
 *     summary: Eliminar (desactivar) indicio
 *     tags: [Indicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Indicio desactivado exitosamente
 *       400:
 *         description: No se puede eliminar un indicio de expediente aprobado
 *       404:
 *         description: Indicio no encontrado
 */
router.delete(
  '/:id',
  checkRole('TECNICO_DICRI', 'COORDINADOR_DICRI', 'ADMIN'),
  indicioController.deleteIndicio
);

export default router;

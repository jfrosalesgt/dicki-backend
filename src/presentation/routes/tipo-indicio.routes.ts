import { Router } from 'express';
import { TipoIndicioController } from '../controllers/TipoIndicioController';
import { authMiddleware } from '../../infrastructure/middleware/auth.middleware';
import { checkRole } from '../../infrastructure/middleware/role.middleware';
import { validate } from '../../infrastructure/middleware/validation.middleware';
import {
  createTipoIndicioValidator,
  updateTipoIndicioValidator,
  tipoIndicioFiltersValidator,
} from '../validators/tipo-indicio.validator';

const router = Router();
const tipoIndicioController = new TipoIndicioController();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * @swagger
 * /api/tipos-indicio:
 *   get:
 *     summary: Listar todos los tipos de indicio
 *     tags: [Catálogos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: activo
 *         schema:
 *           type: boolean
 *         description: Filtrar por tipos activos/inactivos
 *     responses:
 *       200:
 *         description: Lista de tipos de indicio
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
 *                     $ref: '#/components/schemas/TipoIndicio'
 */
router.get(
  '/',
  validate(tipoIndicioFiltersValidator),
  tipoIndicioController.getAllTiposIndicio
);

/**
 * @swagger
 * /api/tipos-indicio/{id}:
 *   get:
 *     summary: Obtener tipo de indicio por ID
 *     tags: [Catálogos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de indicio
 *     responses:
 *       200:
 *         description: Tipo de indicio encontrado
 *       404:
 *         description: Tipo de indicio no encontrado
 */
router.get('/:id', tipoIndicioController.getTipoIndicioById);

/**
 * @swagger
 * /api/tipos-indicio:
 *   post:
 *     summary: Crear nuevo tipo de indicio
 *     tags: [Catálogos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTipoIndicioRequest'
 *     responses:
 *       201:
 *         description: Tipo de indicio creado exitosamente
 *       400:
 *         description: Error de validación
 */
router.post(
  '/',
  checkRole('ADMIN', 'COORDINADOR_DICRI'),
  validate(createTipoIndicioValidator),
  tipoIndicioController.createTipoIndicio
);

/**
 * @swagger
 * /api/tipos-indicio/{id}:
 *   put:
 *     summary: Actualizar tipo de indicio
 *     tags: [Catálogos]
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
 *             $ref: '#/components/schemas/UpdateTipoIndicioRequest'
 *     responses:
 *       200:
 *         description: Tipo de indicio actualizado exitosamente
 *       404:
 *         description: Tipo de indicio no encontrado
 */
router.put(
  '/:id',
  checkRole('ADMIN', 'COORDINADOR_DICRI'),
  validate(updateTipoIndicioValidator),
  tipoIndicioController.updateTipoIndicio
);

/**
 * @swagger
 * /api/tipos-indicio/{id}:
 *   delete:
 *     summary: Desactivar tipo de indicio
 *     tags: [Catálogos]
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
 *         description: Tipo de indicio desactivado exitosamente
 *       404:
 *         description: Tipo de indicio no encontrado
 */
router.delete(
  '/:id',
  checkRole('ADMIN', 'COORDINADOR_DICRI'),
  tipoIndicioController.deleteTipoIndicio
);

export default router;

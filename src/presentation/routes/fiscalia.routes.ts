import { Router } from 'express';
import { FiscaliaController } from '../controllers/FiscaliaController';
import { authMiddleware } from '../../infrastructure/middleware/auth.middleware';
import { checkRole } from '../../infrastructure/middleware/role.middleware';
import { validate } from '../../infrastructure/middleware/validation.middleware';
import {
  createFiscaliaValidator,
  updateFiscaliaValidator,
  fiscaliaFiltersValidator,
} from '../validators/fiscalia.validator';

const router = Router();
const fiscaliaController = new FiscaliaController();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * @swagger
 * /api/fiscalias:
 *   get:
 *     summary: Listar todas las fiscalías
 *     tags: [Catálogos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: activo
 *         schema:
 *           type: boolean
 *         description: Filtrar por fiscalías activas/inactivas
 *     responses:
 *       200:
 *         description: Lista de fiscalías
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
 *                     $ref: '#/components/schemas/Fiscalia'
 */
router.get(
  '/',
  validate(fiscaliaFiltersValidator),
  fiscaliaController.getAllFiscalias
);

/**
 * @swagger
 * /api/fiscalias/{id}:
 *   get:
 *     summary: Obtener fiscalía por ID
 *     tags: [Catálogos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la fiscalía
 *     responses:
 *       200:
 *         description: Fiscalía encontrada
 *       404:
 *         description: Fiscalía no encontrada
 */
router.get('/:id', fiscaliaController.getFiscaliaById);

/**
 * @swagger
 * /api/fiscalias:
 *   post:
 *     summary: Crear nueva fiscalía
 *     tags: [Catálogos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFiscaliaRequest'
 *     responses:
 *       201:
 *         description: Fiscalía creada exitosamente
 *       400:
 *         description: Error de validación
 */
router.post(
  '/',
  checkRole('ADMIN'),
  validate(createFiscaliaValidator),
  fiscaliaController.createFiscalia
);

/**
 * @swagger
 * /api/fiscalias/{id}:
 *   put:
 *     summary: Actualizar fiscalía
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
 *             $ref: '#/components/schemas/UpdateFiscaliaRequest'
 *     responses:
 *       200:
 *         description: Fiscalía actualizada exitosamente
 *       404:
 *         description: Fiscalía no encontrada
 */
router.put(
  '/:id',
  checkRole('ADMIN'),
  validate(updateFiscaliaValidator),
  fiscaliaController.updateFiscalia
);

/**
 * @swagger
 * /api/fiscalias/{id}:
 *   delete:
 *     summary: Desactivar fiscalía
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
 *         description: Fiscalía desactivada exitosamente
 *       404:
 *         description: Fiscalía no encontrada
 */
router.delete(
  '/:id',
  checkRole('ADMIN'),
  fiscaliaController.deleteFiscalia
);

export default router;

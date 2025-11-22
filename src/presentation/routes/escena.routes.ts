import { Router } from 'express';
import { EscenaController } from '../controllers/EscenaController';
import { authMiddleware } from '../../infrastructure/middleware/auth.middleware';
import { checkRole } from '../../infrastructure/middleware/role.middleware';
import { validate } from '../../infrastructure/middleware/validation.middleware';
import { updateEscenaValidator } from '../validators/escena.validator';

const router = Router();
const escenaController = new EscenaController();

/**
 * @swagger
 * tags:
 *   name: Escenas
 *   description: API para gestión de escenas del crimen
 */

/**
 * @swagger
 * /api/escenas/{id}:
 *   get:
 *     summary: Obtener una escena por ID
 *     tags: [Escenas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la escena
 *     responses:
 *       200:
 *         description: Escena obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Escena'
 *                 message:
 *                   type: string
 *                   example: Escena obtenida exitosamente
 *       404:
 *         description: Escena no encontrada
 *       401:
 *         description: No autorizado
 */
router.get(
  '/:id',
  authMiddleware,
  escenaController.getEscenaById
);

/**
 * @swagger
 * /api/escenas/{id}:
 *   put:
 *     summary: Actualizar una escena
 *     tags: [Escenas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la escena
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEscenaRequest'
 *     responses:
 *       200:
 *         description: Escena actualizada exitosamente
 *       400:
 *         description: Datos inválidos o expediente aprobado
 *       404:
 *         description: Escena no encontrada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 */
router.put(
  '/:id',
  authMiddleware,
  checkRole('COORDINADOR_DICRI', 'ADMIN'),
  validate(updateEscenaValidator),
  escenaController.updateEscena
);

/**
 * @swagger
 * /api/escenas/{id}:
 *   delete:
 *     summary: Eliminar (desactivar) una escena
 *     tags: [Escenas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la escena
 *     responses:
 *       200:
 *         description: Escena desactivada exitosamente
 *       400:
 *         description: Expediente aprobado (no se puede eliminar)
 *       404:
 *         description: Escena no encontrada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 */
router.delete(
  '/:id',
  authMiddleware,
  checkRole('COORDINADOR_DICRI', 'ADMIN'),
  escenaController.deleteEscena
);

export default router;

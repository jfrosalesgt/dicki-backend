import { Router } from 'express';
import { InvestigacionController } from '../controllers/InvestigacionController';
import { IndicioController } from '../controllers/IndicioController';
import { EscenaController } from '../controllers/EscenaController';
import { authMiddleware } from '../../infrastructure/middleware/auth.middleware';
import { checkRole } from '../../infrastructure/middleware/role.middleware';
import { validate } from '../../infrastructure/middleware/validation.middleware';
import {
  createInvestigacionValidator,
  updateInvestigacionValidator,
  sendToReviewValidator,
  approveInvestigacionValidator,
  rejectInvestigacionValidator,
  investigacionFiltersValidator,
} from '../validators/investigacion.validator';
import {
  createIndicioValidator,
} from '../validators/indicio.validator';
import {
  createEscenaValidator,
} from '../validators/escena.validator';

const router = Router();
const investigacionController = new InvestigacionController();
const indicioController = new IndicioController();
const escenaController = new EscenaController();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * @swagger
 * /api/expedientes:
 *   get:
 *     summary: Listar todos los expedientes DICRI
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: activo
 *         schema:
 *           type: boolean
 *         description: Filtrar por expedientes activos/inactivos
 *       - in: query
 *         name: estado_revision
 *         schema:
 *           type: string
 *           enum: [EN_REGISTRO, PENDIENTE_REVISION, APROBADO, RECHAZADO]
 *         description: Filtrar por estado de revisión
 *       - in: query
 *         name: id_usuario_registro
 *         schema:
 *           type: integer
 *         description: Filtrar por técnico que registró
 *       - in: query
 *         name: id_fiscalia
 *         schema:
 *           type: integer
 *         description: Filtrar por fiscalía
 *     responses:
 *       200:
 *         description: Lista de expedientes
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
 *                     $ref: '#/components/schemas/Investigacion'
 *       401:
 *         description: No autorizado
 */
router.get(
  '/',
  validate(investigacionFiltersValidator),
  investigacionController.getAllInvestigaciones
);

/**
 * @swagger
 * /api/expedientes/{id}:
 *   get:
 *     summary: Obtener expediente por ID
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del expediente
 *     responses:
 *       200:
 *         description: Expediente encontrado
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
 *                   $ref: '#/components/schemas/Investigacion'
 *       404:
 *         description: Expediente no encontrado
 */
router.get('/:id', investigacionController.getInvestigacionById);

/**
 * @swagger
 * /api/expedientes:
 *   post:
 *     summary: Crear nuevo expediente DICRI
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInvestigacionRequest'
 *     responses:
 *       201:
 *         description: Expediente creado exitosamente
 *       400:
 *         description: Error de validación
 *       409:
 *         description: El código de caso ya existe
 */
router.post(
  '/',
  checkRole('TECNICO_DICRI', 'COORDINADOR_DICRI', 'ADMIN'),
  validate(createInvestigacionValidator),
  investigacionController.createInvestigacion
);

/**
 * @swagger
 * /api/expedientes/{id}:
 *   put:
 *     summary: Actualizar expediente
 *     tags: [Expedientes]
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
 *             $ref: '#/components/schemas/UpdateInvestigacionRequest'
 *     responses:
 *       200:
 *         description: Expediente actualizado exitosamente
 *       404:
 *         description: Expediente no encontrado
 */
router.put(
  '/:id',
  checkRole('TECNICO_DICRI', 'COORDINADOR_DICRI', 'ADMIN'),
  validate(updateInvestigacionValidator),
investigacionController.updateInvestigacion
);

/**
 * @swagger
 * /api/expedientes/{id}:
 *   delete:
 *     summary: Eliminar (desactivar) expediente
 *     tags: [Expedientes]
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
 *         description: Expediente desactivado exitosamente
 *       404:
 *         description: Expediente no encontrado
 */
router.delete(
  '/:id',
  checkRole('COORDINADOR_DICRI', 'ADMIN'),
  investigacionController.deleteInvestigacion
);

/**
 * @swagger
 * /api/expedientes/{id}/enviar-revision:
 *   post:
 *     summary: Enviar expediente a revisión del coordinador
 *     tags: [Expedientes]
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
 *         description: Expediente enviado a revisión
 *       400:
 *         description: El expediente no está en estado válido
 *       404:
 *         description: Expediente no encontrado
 */
router.post(
  '/:id/enviar-revision',
  checkRole('TECNICO_DICRI', 'ADMIN'),
  validate(sendToReviewValidator),
  investigacionController.sendToReview
);

/**
 * @swagger
 * /api/expedientes/{id}/aprobar:
 *   post:
 *     summary: Aprobar expediente (solo coordinador)
 *     tags: [Expedientes]
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
 *         description: Expediente aprobado exitosamente
 *       400:
 *         description: El expediente no está en estado PENDIENTE_REVISION
 *       403:
 *         description: Sin permisos (requiere rol COORDINADOR_DICRI)
 *       404:
 *         description: Expediente no encontrado
 */
router.post(
  '/:id/aprobar',
  checkRole('COORDINADOR_DICRI', 'ADMIN'),
  validate(approveInvestigacionValidator),
  investigacionController.approveInvestigacion
);

/**
 * @swagger
 * /api/expedientes/{id}/rechazar:
 *   post:
 *     summary: Rechazar expediente (solo coordinador)
 *     tags: [Expedientes]
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
 *             type: object
 *             required:
 *               - justificacion
 *             properties:
 *               justificacion:
 *                 type: string
 *                 minLength: 10
 *                 example: "Faltan campos de metadatos en los equipos digitales"
 *     responses:
 *       200:
 *         description: Expediente rechazado exitosamente
 *       400:
 *         description: Error de validación o estado inválido
 *       403:
 *         description: Sin permisos (requiere rol COORDINADOR_DICRI)
 *       404:
 *         description: Expediente no encontrado
 */
router.post(
  '/:id/rechazar',
  checkRole('COORDINADOR_DICRI', 'ADMIN'),
  validate(rejectInvestigacionValidator),
  investigacionController.rejectInvestigacion
);

/**
 * @swagger
 * /api/expedientes/{id}/indicios:
 *   get:
 *     summary: Obtener todos los indicios de un expediente
 *     tags: [Indicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del expediente
 *     responses:
 *       200:
 *         description: Lista de indicios del expediente
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
 *       404:
 *         description: Expediente no encontrado
 */
router.get(
  '/:id/indicios',
  indicioController.getIndiciosByExpediente
);

/**
 * @swagger
 * /api/expedientes/{id}/indicios:
 *   post:
 *     summary: Crear nuevo indicio asociado a un expediente
 *     tags: [Indicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del expediente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateIndicioRequest'
 *     responses:
 *       201:
 *         description: Indicio creado exitosamente
 *       400:
 *         description: Error de validación o expediente aprobado
 *       404:
 *         description: Expediente o escena no encontrados
 */
router.post(
  '/:id/indicios',
  checkRole('TECNICO_DICRI', 'COORDINADOR_DICRI', 'ADMIN'),
  validate(createIndicioValidator),
  indicioController.createIndicio
);

/**
 * @swagger
 * /api/expedientes/{id}/escenas:
 *   get:
 *     summary: Obtener todas las escenas de un expediente
 *     tags: [Escenas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del expediente
 *     responses:
 *       200:
 *         description: Lista de escenas del expediente
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
 *                     $ref: '#/components/schemas/Escena'
 *       404:
 *         description: Expediente no encontrado
 */
router.get(
  '/:id/escenas',
  escenaController.getEscenasByExpediente
);

/**
 * @swagger
 * /api/expedientes/{id}/escenas:
 *   post:
 *     summary: Crear nueva escena asociada a un expediente
 *     tags: [Escenas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del expediente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEscenaRequest'
 *     responses:
 *       201:
 *         description: Escena creada exitosamente
 *       400:
 *         description: Error de validación o expediente aprobado
 *       404:
 *         description: Expediente no encontrado
 */
router.post(
  '/:id/escenas',
  checkRole('TECNICO_DICRI', 'COORDINADOR_DICRI', 'ADMIN'),
  validate(createEscenaValidator),
  escenaController.createEscena
);

export default router;

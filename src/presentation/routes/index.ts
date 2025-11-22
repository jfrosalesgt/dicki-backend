import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import investigacionRoutes from './investigacion.routes';
import indicioRoutes from './indicio.routes';
import escenaRoutes from './escena.routes';
import fiscaliaRoutes from './fiscalia.routes';
import tipoIndicioRoutes from './tipo-indicio.routes';
import reportesRoutes from './reportes.routes';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'DICRI Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Rutas de la aplicación
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/expedientes', investigacionRoutes);
router.use('/indicios', indicioRoutes);
router.use('/escenas', escenaRoutes);
router.use('/fiscalias', fiscaliaRoutes);
router.use('/tipos-indicio', tipoIndicioRoutes);
router.use('/reportes', reportesRoutes);

export default router;

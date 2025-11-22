import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';

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

export default router;

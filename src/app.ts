import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './presentation/routes';
import { errorHandler } from './infrastructure/middleware/error.middleware';
import { setupSwagger } from './config/swagger';

console.log("🔥 --- ARCHIVO APP.TS ACTUALIZADO CARGADO --- 🔥");

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeSwagger();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Seguridad con Helmet
    this.app.use(helmet());

    // =====================================================================
    // CONFIGURACIÓN DE CORS CORREGIDA
    // =====================================================================
    this.app.use(cors({
      origin: (origin, callback) => {
        // 1. Permitir solicitudes sin origen (ej. Postman, cURL, Server-to-Server)
        if (!origin) {
          return callback(null, true);
        }

        // 2. Definir orígenes permitidos
        // Leemos la variable de entorno del docker-compose
        const envOrigins = (process.env.CORS_ORIGIN || '').split(',');
        
        // Agregamos manualmente los puertos de tus contenedores frontend (Dev y Prod)
        const localOrigins = [
          'http://localhost:5173', // Frontend Local Dev
          'http://localhost:8080', // Frontend Dev
          'http://localhost:8081'  // Frontend Prod
        ];
        
        // Combinamos todas las listas
        const allAllowed = [...envOrigins, ...localOrigins];

        // 3. Validar origen
        // Si la variable es '*' o el origen está en la lista, permitimos
        if (process.env.CORS_ORIGIN === '*' || allAllowed.includes(origin)) {
          callback(null, true);
        } else {
          console.error(`❌ Bloqueado por CORS: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true, // Permite envío de cookies/headers de autorización
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
    }));
    // =====================================================================

    // Body parser
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Logger
    if (process.env.NODE_ENV !== 'production') {
      this.app.use(morgan('dev'));
    }
  }

  private initializeSwagger(): void {
    setupSwagger(this.app);
  }

  private initializeRoutes(): void {
    // Rutas principales
    this.app.use('/api', routes);

    // Ruta raíz (Health check simple)
    this.app.get('/', (_req, res) => {
      res.json({
        message: 'DICRI Backend API',
        version: '1.0.0',
        endpoints: {
          health: '/api/health',
          auth: '/api/auth',
          users: '/api/users',
        },
      });
    });

    // Ruta no encontrada (404)
    this.app.use('*', (_req, res) => {
      res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
      });
    });
  }

  private initializeErrorHandling(): void {
    // Middleware de manejo de errores global
    this.app.use(errorHandler);
  }
}

export default App;
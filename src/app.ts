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
    this.app.use(helmet());

    this.app.use(cors({
      origin: (origin, callback) => {
        if (!origin) {
          return callback(null, true);
        }

        const envOrigins = (process.env.CORS_ORIGIN || '').split(',');
        
        const localOrigins = [
          'http://localhost:5173',
          'http://localhost:8080',
          'http://localhost:8081'
        ];
        
        const allAllowed = [...envOrigins, ...localOrigins];

        if (process.env.CORS_ORIGIN === '*' || allAllowed.includes(origin)) {
          callback(null, true);
        } else {
          console.error(`❌ Bloqueado por CORS: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
    }));

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    if (process.env.NODE_ENV !== 'production') {
      this.app.use(morgan('dev'));
    }
  }

  private initializeSwagger(): void {
    setupSwagger(this.app);
  }

  private initializeRoutes(): void {
    this.app.use('/api', routes);

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

    this.app.use('*', (_req, res) => {
      res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }
}

export default App;
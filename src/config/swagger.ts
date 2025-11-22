import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'DICRI Backend API',
    version: '1.0.0',
    description: 'API REST para el sistema DICRI con autenticación JWT, gestión de usuarios, perfiles, roles y módulos',
    contact: {
      name: 'DICRI Team',
      email: 'support@dicri.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3030',
      description: 'Servidor de desarrollo',
    },
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desarrollo alternativo',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingresa el token JWT obtenido del endpoint /api/auth/login',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Mensaje de error',
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
            },
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['nombre_usuario', 'clave'],
        properties: {
          nombre_usuario: {
            type: 'string',
            example: 'admin',
          },
          clave: {
            type: 'string',
            example: 'admin123',
          },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Login exitoso',
          },
          data: {
            type: 'object',
            properties: {
              token: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              },
              usuario: {
                type: 'object',
                properties: {
                  id_usuario: { type: 'number', example: 1 },
                  nombre_usuario: { type: 'string', example: 'admin' },
                  nombre: { type: 'string', example: 'Administrador' },
                  apellido: { type: 'string', example: 'Sistema' },
                  email: { type: 'string', example: 'admin@dicri.com' },
                  cambiar_clave: { type: 'boolean', example: true },
                },
              },
              perfiles: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id_perfil: { type: 'number' },
                    nombre_perfil: { type: 'string' },
                    descripcion: { type: 'string' },
                  },
                },
              },
              roles: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id_role: { type: 'number' },
                    nombre_role: { type: 'string' },
                    descripcion: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
      ChangePasswordRequest: {
        type: 'object',
        required: ['clave_actual', 'clave_nueva'],
        properties: {
          clave_actual: {
            type: 'string',
            example: 'admin123',
          },
          clave_nueva: {
            type: 'string',
            example: 'Admin2024!',
            description: 'Debe contener al menos una mayúscula, una minúscula y un número',
          },
        },
      },
      Usuario: {
        type: 'object',
        properties: {
          id_usuario: { type: 'number', example: 1 },
          nombre_usuario: { type: 'string', example: 'jperez' },
          nombre: { type: 'string', example: 'Juan' },
          apellido: { type: 'string', example: 'Pérez' },
          email: { type: 'string', example: 'jperez@dicri.com' },
          activo: { type: 'boolean', example: true },
          cambiar_clave: { type: 'boolean', example: false },
          intentos_fallidos: { type: 'number', example: 0 },
          fecha_ultimo_acceso: { type: 'string', format: 'date-time' },
          usuario_creacion: { type: 'string', example: 'admin' },
          fecha_creacion: { type: 'string', format: 'date-time' },
          usuario_actualizacion: { type: 'string' },
          fecha_actualizacion: { type: 'string', format: 'date-time' },
        },
      },
      CreateUsuarioRequest: {
        type: 'object',
        required: ['nombre_usuario', 'clave', 'nombre', 'apellido', 'email'],
        properties: {
          nombre_usuario: { type: 'string', example: 'jperez' },
          clave: { type: 'string', example: 'Pass123' },
          nombre: { type: 'string', example: 'Juan' },
          apellido: { type: 'string', example: 'Pérez' },
          email: { type: 'string', example: 'jperez@dicri.com' },
        },
      },
      UpdateUsuarioRequest: {
        type: 'object',
        properties: {
          nombre: { type: 'string', example: 'Juan Carlos' },
          apellido: { type: 'string', example: 'Pérez' },
          email: { type: 'string', example: 'jcperez@dicri.com' },
          activo: { type: 'boolean', example: true },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// Detectar si estamos en desarrollo o producción
const isProduction = process.env.NODE_ENV === 'production';
const routesPath = isProduction 
  ? './dist/presentation/routes/*.js' 
  : './src/presentation/routes/*.ts';
const controllersPath = isProduction 
  ? './dist/presentation/controllers/*.js' 
  : './src/presentation/controllers/*.ts';

const options = {
  swaggerDefinition,
  apis: [routesPath, controllersPath],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Application): void => {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'DICRI API Docs',
  }));

  // JSON endpoint
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('📚 Swagger documentation available at /api-docs');
};

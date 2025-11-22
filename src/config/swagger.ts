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
      LoginRequest: {
        type: 'object',
        required: ['nombre_usuario', 'clave'],
        properties: {
          nombre_usuario: {
            type: 'string',
            example: 'admin',
            description: 'Nombre de usuario',
          },
          clave: {
            type: 'string',
            example: 'admin123',
            description: 'Contraseña del usuario',
          },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: '✨ Login exitoso ✨' },
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
              modulos: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id_modulo: { type: 'number', example: 1 },
                    nombre_modulo: { type: 'string', example: 'Dashboard' },
                    descripcion: { type: 'string', example: 'Vista principal del sistema' },
                    ruta: { type: 'string', example: '/dashboard' },
                    icono: { type: 'string', example: 'home' },
                    orden: { type: 'number', example: 1 },
                    activo: { type: 'boolean', example: true },
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
            description: 'Contraseña actual',
          },
          clave_nueva: {
            type: 'string',
            example: 'NuevaPass123',
            description: 'Nueva contraseña (mín. 6 caracteres, debe contener mayúscula, minúscula y número)',
          },
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
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Mensaje de error' },
          errors: { type: 'array', items: { type: 'object' } },
        },
      },
      Investigacion: {
        type: 'object',
        properties: {
          id_investigacion: { type: 'number', example: 1 },
          codigo_caso: { type: 'string', example: 'MP001-2025-1001' },
          nombre_caso: { type: 'string', example: 'Homicidio en Zona 10' },
          fecha_inicio: { type: 'string', format: 'date', example: '2025-11-20' },
          id_fiscalia: { type: 'number', example: 1 },
          nombre_fiscalia: { type: 'string', example: 'Fiscalía de Delitos contra la Vida' },
          descripcion_hechos: { type: 'string', example: 'Investigación sobre el hallazgo de un cuerpo' },
          estado_revision_dicri: { 
            type: 'string', 
            enum: ['EN_REGISTRO', 'PENDIENTE_REVISION', 'APROBADO', 'RECHAZADO'],
            example: 'EN_REGISTRO' 
          },
          id_usuario_registro: { type: 'number', example: 2 },
          id_usuario_revision: { type: 'number', example: 3 },
          justificacion_revision: { type: 'string', example: 'Registro completo' },
          fecha_revision: { type: 'string', format: 'date-time' },
          activo: { type: 'boolean', example: true },
          usuario_creacion: { type: 'string', example: 'tec_1' },
          fecha_creacion: { type: 'string', format: 'date-time' },
          usuario_actualizacion: { type: 'string', example: 'tec_1' },
          fecha_actualizacion: { type: 'string', format: 'date-time' },
        },
      },
      CreateInvestigacionRequest: {
        type: 'object',
        required: ['codigo_caso', 'nombre_caso', 'fecha_inicio', 'id_fiscalia'],
        properties: {
          codigo_caso: { type: 'string', example: 'MP001-2025-1001', maxLength: 50 },
          nombre_caso: { type: 'string', example: 'Homicidio en Zona 10', maxLength: 255 },
          fecha_inicio: { type: 'string', format: 'date', example: '2025-11-20' },
          id_fiscalia: { type: 'number', example: 1 },
          descripcion_hechos: { type: 'string', example: 'Investigación sobre el hallazgo de un cuerpo con herida de bala' },
        },
      },
      UpdateInvestigacionRequest: {
        type: 'object',
        properties: {
          nombre_caso: { type: 'string', example: 'Homicidio en Zona 10', maxLength: 255 },
          fecha_inicio: { type: 'string', format: 'date', example: '2025-11-20' },
          id_fiscalia: { type: 'number', example: 1 },
          descripcion_hechos: { type: 'string', example: 'Descripción actualizada del caso' },
          activo: { type: 'boolean', example: true },
        },
      },
      Indicio: {
        type: 'object',
        properties: {
          id_indicio: { type: 'number', example: 1 },
          codigo_indicio: { type: 'string', example: 'IND-001-2025' },
          id_escena: { type: 'number', example: 1 },
          id_tipo_indicio: { type: 'number', example: 1 },
          descripcion_corta: { type: 'string', example: 'Arma de fuego calibre 9mm' },
          ubicacion_especifica: { type: 'string', example: 'Sala principal, junto a la ventana' },
          fecha_hora_recoleccion: { type: 'string', format: 'date-time', example: '2025-11-20T14:30:00Z' },
          id_usuario_recolector: { type: 'number', example: 2 },
          estado_actual: { 
            type: 'string', 
            enum: ['RECOLECTADO', 'EN_CUSTODIA', 'EN_ANALISIS', 'ANALIZADO', 'DEVUELTO'],
            example: 'RECOLECTADO' 
          },
          activo: { type: 'boolean', example: true },
          nombre_escena: { type: 'string', example: 'Escena Principal' },
          nombre_tipo: { type: 'string', example: 'Arma de Fuego' },
          nombre_recolector: { type: 'string', example: 'Juan Pérez' },
        },
      },
      CreateIndicioRequest: {
        type: 'object',
        required: ['codigo_indicio', 'id_escena', 'id_tipo_indicio', 'descripcion_corta'],
        properties: {
          codigo_indicio: { type: 'string', example: 'IND-001-2025', maxLength: 50 },
          id_escena: { type: 'number', example: 1, description: 'ID de la escena asociada' },
          id_tipo_indicio: { type: 'number', example: 1, description: 'ID del tipo de indicio' },
          descripcion_corta: { type: 'string', example: 'Arma de fuego calibre 9mm', maxLength: 255 },
          ubicacion_especifica: { type: 'string', example: 'Sala principal, junto a la ventana', maxLength: 100 },
          fecha_hora_recoleccion: { type: 'string', format: 'date-time', example: '2025-11-20T14:30:00Z' },
        },
      },
      UpdateIndicioRequest: {
        type: 'object',
        properties: {
          descripcion_corta: { type: 'string', example: 'Arma de fuego calibre 9mm marca Glock', maxLength: 255 },
          ubicacion_especifica: { type: 'string', example: 'Actualizada ubicación específica', maxLength: 100 },
          fecha_hora_recoleccion: { type: 'string', format: 'date-time', example: '2025-11-20T14:30:00Z' },
          id_tipo_indicio: { type: 'number', example: 2 },
          estado_actual: { 
            type: 'string', 
            enum: ['RECOLECTADO', 'EN_CUSTODIA', 'EN_ANALISIS', 'ANALIZADO', 'DEVUELTO'],
            example: 'EN_CUSTODIA' 
          },
        },
      },
      Escena: {
        type: 'object',
        properties: {
          id_escena: { type: 'number', example: 1 },
          id_investigacion: { type: 'number', example: 1 },
          nombre_escena: { type: 'string', example: 'Escena Principal' },
          direccion_escena: { type: 'string', example: 'Av. Las Américas 5-67 Zona 10' },
          fecha_hora_inicio: { type: 'string', format: 'date-time', example: '2025-11-20T08:00:00Z' },
          fecha_hora_fin: { type: 'string', format: 'date-time', example: '2025-11-20T18:00:00Z' },
          descripcion: { type: 'string', example: 'Escena del crimen principal, habitación principal de la vivienda' },
          activo: { type: 'boolean', example: true },
          usuario_creacion: { type: 'string', example: 'tec_1' },
          fecha_creacion: { type: 'string', format: 'date-time' },
          usuario_actualizacion: { type: 'string', example: 'tec_1' },
          fecha_actualizacion: { type: 'string', format: 'date-time' },
        },
      },
      CreateEscenaRequest: {
        type: 'object',
        required: ['id_investigacion', 'nombre_escena', 'direccion_escena', 'fecha_hora_inicio'],
        properties: {
          id_investigacion: { type: 'number', example: 1 },
          nombre_escena: { type: 'string', example: 'Escena Principal', maxLength: 100 },
          direccion_escena: { type: 'string', example: 'Av. Las Américas 5-67 Zona 10', maxLength: 255 },
          fecha_hora_inicio: { type: 'string', format: 'date-time', example: '2025-11-20T08:00:00Z' },
          fecha_hora_fin: { type: 'string', format: 'date-time', example: '2025-11-20T18:00:00Z' },
          descripcion: { type: 'string', example: 'Descripción detallada de la escena' },
        },
      },
      UpdateEscenaRequest: {
        type: 'object',
        properties: {
          nombre_escena: { type: 'string', example: 'Escena Secundaria', maxLength: 100 },
          direccion_escena: { type: 'string', example: 'Dirección actualizada', maxLength: 255 },
          fecha_hora_inicio: { type: 'string', format: 'date-time', example: '2025-11-20T08:00:00Z' },
          fecha_hora_fin: { type: 'string', format: 'date-time', example: '2025-11-20T18:00:00Z' },
          descripcion: { type: 'string', example: 'Descripción actualizada' },
        },
      },
      ReporteRevisionExpedientes: {
        type: 'object',
        properties: {
          codigo_caso: { type: 'string', example: 'MP001-2025-1001' },
          nombre_caso: { type: 'string', example: 'Homicidio en Zona 10' },
          nombre_fiscalia: { type: 'string', example: 'Fiscalía de Delitos contra la Vida' },
          fecha_registro: { type: 'string', format: 'date-time', example: '2025-11-20T10:00:00Z' },
          tecnico_registra: { type: 'string', example: 'Juan Pérez' },
          estado_actual: { 
            type: 'string', 
            enum: ['EN_REGISTRO', 'PENDIENTE_REVISION', 'APROBADO', 'RECHAZADO'],
            example: 'APROBADO' 
          },
          fecha_revision: { type: 'string', format: 'date-time', example: '2025-11-22T15:30:00Z' },
          coordinador_revision: { type: 'string', example: 'María González' },
          justificacion_revision: { type: 'string', example: 'Registro completo y cadena de custodia validada' },
        },
      },
      EstadisticasGenerales: {
        type: 'object',
        properties: {
          total_expedientes: { type: 'number', example: 45 },
          en_registro: { type: 'number', example: 12 },
          pendiente_revision: { type: 'number', example: 8 },
          aprobados: { type: 'number', example: 20 },
          rechazados: { type: 'number', example: 5 },
          total_indicios: { type: 'number', example: 156 },
          expedientes_por_fiscalia: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                nombre_fiscalia: { type: 'string', example: 'Fiscalía de Delitos contra la Vida' },
                total: { type: 'number', example: 25 },
              },
            },
          },
        },
      },
      Usuario: {
        type: 'object',
        properties: {
          id_usuario: { type: 'number', example: 1 },
          nombre_usuario: { type: 'string', example: 'admin' },
          nombre: { type: 'string', example: 'Administrador' },
          apellido: { type: 'string', example: 'Sistema' },
          email: { type: 'string', example: 'admin@dicri.com' },
          cambiar_clave: { type: 'boolean', example: false },
          activo: { type: 'boolean', example: true },
          usuario_creacion: { type: 'string', example: 'SYSTEM' },
          fecha_creacion: { type: 'string', format: 'date-time' },
          usuario_actualizacion: { type: 'string', example: 'admin' },
          fecha_actualizacion: { type: 'string', format: 'date-time' },
        },
      },
      Perfil: {
        type: 'object',
        properties: {
          id_perfil: { type: 'number', example: 1 },
          nombre_perfil: { type: 'string', example: 'Administrador' },
          descripcion: { type: 'string', example: 'Perfil con acceso total al sistema' },
          activo: { type: 'boolean', example: true },
          usuario_creacion: { type: 'string', example: 'SYSTEM' },
          fecha_creacion: { type: 'string', format: 'date-time' },
          usuario_actualizacion: { type: 'string' },
          fecha_actualizacion: { type: 'string', format: 'date-time' },
        },
      },
      Role: {
        type: 'object',
        properties: {
          id_role: { type: 'number', example: 1 },
          nombre_role: { type: 'string', example: 'ADMIN' },
          descripcion: { type: 'string', example: 'Role de administrador del sistema' },
          activo: { type: 'boolean', example: true },
          usuario_creacion: { type: 'string', example: 'SYSTEM' },
          fecha_creacion: { type: 'string', format: 'date-time' },
          usuario_actualizacion: { type: 'string' },
          fecha_actualizacion: { type: 'string', format: 'date-time' },
        },
      },
      Modulo: {
        type: 'object',
        properties: {
          id_modulo: { type: 'number', example: 1 },
          nombre_modulo: { type: 'string', example: 'Dashboard' },
          descripcion: { type: 'string', example: 'Vista principal del sistema' },
          ruta: { type: 'string', example: '/dashboard' },
          icono: { type: 'string', example: 'home' },
          orden: { type: 'number', example: 1 },
          id_modulo_padre: { type: 'number', example: null },
          activo: { type: 'boolean', example: true },
          usuario_creacion: { type: 'string', example: 'SYSTEM' },
          fecha_creacion: { type: 'string', format: 'date-time' },
          usuario_actualizacion: { type: 'string' },
          fecha_actualizacion: { type: 'string', format: 'date-time' },
        },
      },
      Fiscalia: {
        type: 'object',
        properties: {
          id_fiscalia: { type: 'number', example: 1 },
          nombre_fiscalia: { type: 'string', example: 'Fiscalía de Delitos contra la Vida' },
          direccion: { type: 'string', example: 'Ciudad de Guatemala, Zona 1' },
          telefono: { type: 'string', example: '2222-3333' },
          activo: { type: 'boolean', example: true },
          usuario_creacion: { type: 'string', example: 'SYSTEM' },
          fecha_creacion: { type: 'string', format: 'date-time' },
          usuario_actualizacion: { type: 'string' },
          fecha_actualizacion: { type: 'string', format: 'date-time' },
        },
      },
      CreateFiscaliaRequest: {
        type: 'object',
        required: ['nombre_fiscalia'],
        properties: {
          nombre_fiscalia: { type: 'string', example: 'Fiscalía de Delitos Económicos', maxLength: 150 },
          direccion: { type: 'string', example: 'Zona 4, Ciudad de Guatemala', maxLength: 255 },
          telefono: { type: 'string', example: '2333-4444', maxLength: 20 },
        },
      },
      UpdateFiscaliaRequest: {
        type: 'object',
        properties: {
          nombre_fiscalia: { type: 'string', example: 'Fiscalía de Delitos Económicos', maxLength: 150 },
          direccion: { type: 'string', example: 'Zona 4, Ciudad de Guatemala', maxLength: 255 },
          telefono: { type: 'string', example: '2333-4444', maxLength: 20 },
          activo: { type: 'boolean', example: true },
        },
      },
      TipoIndicio: {
        type: 'object',
        properties: {
          id_tipo_indicio: { type: 'number', example: 1 },
          nombre_tipo: { type: 'string', example: 'Arma de Fuego' },
          descripcion: { type: 'string', example: 'Armas de cualquier tipo y calibre' },
          activo: { type: 'boolean', example: true },
          usuario_creacion: { type: 'string', example: 'SYSTEM' },
          fecha_creacion: { type: 'string', format: 'date-time' },
          usuario_actualizacion: { type: 'string' },
          fecha_actualizacion: { type: 'string', format: 'date-time' },
        },
      },
      CreateTipoIndicioRequest: {
        type: 'object',
        required: ['nombre_tipo'],
        properties: {
          nombre_tipo: { type: 'string', example: 'Evidencia Digital', maxLength: 100 },
          descripcion: { type: 'string', example: 'Dispositivos electrónicos y medios de almacenamiento', maxLength: 255 },
        },
      },
      UpdateTipoIndicioRequest: {
        type: 'object',
        properties: {
          nombre_tipo: { type: 'string', example: 'Evidencia Digital', maxLength: 100 },
          descripcion: { type: 'string', example: 'Dispositivos electrónicos y medios de almacenamiento', maxLength: 255 },
          activo: { type: 'boolean', example: true },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operación exitosa' },
          data: { type: 'object' },
        },
      },
      PaginatedResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Datos obtenidos exitosamente' },
          data: { type: 'array', items: { type: 'object' } },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'number', example: 1 },
              limit: { type: 'number', example: 10 },
              total: { type: 'number', example: 100 },
              totalPages: { type: 'number', example: 10 },
            },
          },
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

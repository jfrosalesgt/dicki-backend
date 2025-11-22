# DICRI Backend API

Backend desarrollado con Express.js, TypeScript y SQL Server 2022 para el sistema DICRI.

## 🚀 Características

- ✅ Arquitectura limpia (Clean Architecture)
- ✅ TypeScript para tipado estático
- ✅ Express.js como framework web
- ✅ SQL Server 2022 como base de datos
- ✅ Autenticación con JWT
- ✅ Contraseñas hasheadas con MD5
- ✅ Sistema de perfiles, roles y módulos
- ✅ Auditoría completa (usuario y fecha de creación/actualización)
- ✅ Validación de datos con express-validator
- ✅ Middleware de seguridad con Helmet
- ✅ CORS configurado

## 📁 Estructura del Proyecto

```
src/
├── application/         # Lógica de negocio
│   └── services/       # Servicios (AuthService, UserService)
├── config/             # Configuración de la aplicación
├── domain/             # Entidades e interfaces
│   ├── entities/       # Modelos de datos
│   └── interfaces/     # Contratos de repositorios
├── infrastructure/     # Implementaciones técnicas
│   ├── database/       # Conexión a BD
│   ├── middleware/     # Middlewares (auth, validation, error)
│   └── repositories/   # Implementación de repositorios
├── presentation/       # Capa de presentación
│   ├── controllers/    # Controladores
│   ├── routes/        # Rutas de la API
│   └── validators/    # Validadores de entrada
└── shared/            # Utilidades compartidas
    └── utils/         # Funciones auxiliares
```

## 🛠️ Instalación

### 1. Instalar dependencias

```powershell
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura las variables:

```env
PORT=3000
NODE_ENV=development

# Database Configuration
DB_SERVER=host.docker.internal,1434
DB_USER=appindicios
DB_PASSWORD=Ind1c10$
DB_DATABASE=DICRI
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=8h
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=*
```

### 3. Crear la base de datos

Ejecuta el script SQL en SQL Server:

```powershell
# Conéctate a SQL Server y ejecuta:
sqlcmd -S host.docker.internal,1434 -U appindicios -P "Ind1c10$" -i database-schema.sql
```

O ejecuta el archivo `database-schema.sql` manualmente desde SQL Server Management Studio.

## 🚀 Uso

### Modo desarrollo

```powershell
npm run dev
```

### Compilar para producción

```powershell
npm run build
```

### Ejecutar en producción

```powershell
npm start
```

## 📚 API Endpoints

### 🔐 Autenticación (`/api/auth`)

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "nombre_usuario": "admin",
  "clave": "admin123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "usuario": {
      "id_usuario": 1,
      "nombre_usuario": "admin",
      "nombre": "Administrador",
      "apellido": "Sistema",
      "email": "admin@dicri.com",
      "cambiar_clave": true
    },
    "perfiles": [...],
    "roles": [...]
  }
}
```

#### Cambiar contraseña
```http
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "clave_actual": "admin123",
  "clave_nueva": "NuevaPass123"
}
```

#### Verificar token
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

#### Obtener información del usuario
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### 👥 Usuarios (`/api/users`)

Todas las rutas requieren autenticación y rol ADMIN.

#### Listar usuarios
```http
GET /api/users
Authorization: Bearer <token>
```

#### Obtener usuario por ID
```http
GET /api/users/:id
Authorization: Bearer <token>
```

#### Crear usuario
```http
POST /api/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre_usuario": "jdoe",
  "clave": "Pass123",
  "nombre": "John",
  "apellido": "Doe",
  "email": "jdoe@example.com"
}
```

#### Actualizar usuario
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Jane",
  "email": "jane@example.com"
}
```

#### Activar usuario
```http
PATCH /api/users/:id/activate
Authorization: Bearer <token>
```

#### Desactivar usuario
```http
PATCH /api/users/:id/deactivate
Authorization: Bearer <token>
```

### 🏥 Health Check
```http
GET /api/health
```

## 🗄️ Base de Datos

### Tablas principales

- **Usuario**: Usuarios del sistema con contraseña MD5
- **Perfil**: Perfiles de usuarios
- **Role**: Roles del sistema
- **Modulo**: Módulos/funcionalidades
- **Usuario_Perfil**: Relación usuario-perfil
- **Perfil_Modulo**: Permisos de perfil sobre módulos
- **Perfil_Role**: Relación perfil-role
- **Role_Modulo**: Permisos de role sobre módulos

### Campos de auditoría

Todas las tablas incluyen:
- `usuario_creacion`: Usuario que creó el registro
- `fecha_creacion`: Fecha de creación
- `usuario_actualizacion`: Usuario que actualizó el registro
- `fecha_actualizacion`: Fecha de actualización

### Usuario por defecto

- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Email**: `admin@dicri.com`

⚠️ **Importante**: Cambia la contraseña del usuario admin después del primer login.

## 🔒 Seguridad

- Las contraseñas se hashean con MD5
- Autenticación mediante JWT
- Middleware de seguridad con Helmet
- Validación de datos con express-validator
- Control de intentos fallidos de login (máximo 5)
- Bloqueo automático de usuario tras múltiples intentos

## 🛡️ Variables de Entorno Importantes

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | 3000 |
| `DB_SERVER` | Servidor SQL Server | localhost |
| `DB_USER` | Usuario de BD | - |
| `DB_PASSWORD` | Contraseña de BD | - |
| `DB_DATABASE` | Nombre de la BD | DICRI |
| `JWT_SECRET` | Secreto para JWT | (cambiar en producción) |
| `JWT_EXPIRES_IN` | Duración del token | 8h |

## 📝 Scripts

```json
{
  "dev": "nodemon src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "test": "jest"
}
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

ISC

## 👨‍💻 Desarrollado por

DICRI Team - 2025

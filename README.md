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

### Con Docker (Recomendado - con Hot Reload)

```powershell
# Levantar contenedor en segundo plano
docker-compose up -d

# Ver logs en tiempo real
docker logs -f dicri-backend

# Detener contenedor
docker-compose down

# Reconstruir imagen (solo si cambias Dockerfile o package.json)
docker-compose build --no-cache
```

### Sin Docker

#### Modo desarrollo (con Hot Reload)
```powershell
npm run dev
```

#### Modo desarrollo en Docker
```powershell
npm run docker:dev
```

#### Compilar para producción
```powershell
npm run build
```

#### Ejecutar en producción
```powershell
npm start
```

## 📚 API Endpoints

Documentación completa disponible en **Swagger**: [http://localhost:3030/api-docs](http://localhost:3030/api-docs)

### 🔐 Autenticación (`/api/auth`)

#### 🔓 Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "nombre_usuario": "admin",
  "clave": "admin123"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "✨ Login exitoso ✨",
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
    "perfiles": [
      {
        "id_perfil": 1,
        "nombre_perfil": "Administrador",
        "descripcion": "Perfil con todos los permisos"
      }
    ],
    "roles": [
      {
        "id_role": 1,
        "nombre_role": "ADMIN",
        "descripcion": "Administrador del sistema"
      }
    ]
  }
}
```

#### 🔑 Cambiar contraseña
```http
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "clave_actual": "admin123",
  "clave_nueva": "NuevaPass123"
}
```

**Validaciones:**
- Contraseña debe tener al menos 6 caracteres
- Debe contener al menos una mayúscula, una minúscula y un número

#### ✅ Verificar token
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Token válido",
  "data": {
    "id_usuario": 1,
    "nombre_usuario": "admin",
    "roles": ["ADMIN"]
  }
}
```

#### 👤 Obtener información del usuario autenticado
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### 👥 Usuarios (`/api/users`)

**⚠️ Todas las rutas requieren autenticación y rol ADMIN**

#### 📋 Listar usuarios
```http
GET /api/users
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente",
  "data": [
    {
      "id_usuario": 1,
      "nombre_usuario": "admin",
      "nombre": "Administrador",
      "apellido": "Sistema",
      "email": "admin@dicri.com",
      "activo": true,
      "cambiar_clave": true,
      "intentos_fallidos": 0,
      "fecha_ultimo_acceso": "2025-11-22T10:30:00.000Z"
    }
  ]
}
```

#### 🔍 Obtener usuario por ID
```http
GET /api/users/:id
Authorization: Bearer <token>
```

#### ➕ Crear usuario
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

**Validaciones:**
- `nombre_usuario`: mínimo 3 caracteres
- `clave`: mínimo 6 caracteres, debe contener mayúscula, minúscula y número
- `email`: formato válido de email
- `nombre` y `apellido`: solo letras y espacios

#### ✏️ Actualizar usuario
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Jane",
  "apellido": "Doe",
  "email": "jane@example.com"
}
```

#### ✅ Activar usuario
```http
PATCH /api/users/:id/activate
Authorization: Bearer <token>
```

#### ❌ Desactivar usuario
```http
PATCH /api/users/:id/deactivate
Authorization: Bearer <token>
```

---

### 📁 Expedientes DICRI (`/api/expedientes`)

**⚠️ Todas las rutas requieren autenticación**

#### 📋 Listar expedientes
```http
GET /api/expedientes
Authorization: Bearer <token>
```

**Parámetros de consulta opcionales:**
- `activo` (boolean): Filtrar por expedientes activos/inactivos
- `estado_revision` (string): EN_REGISTRO | PENDIENTE_REVISION | APROBADO | RECHAZADO
- `id_usuario_registro` (number): Filtrar por técnico que registró
- `id_fiscalia` (number): Filtrar por fiscalía

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Expedientes obtenidos exitosamente",
  "data": [
    {
      "id_investigacion": 1,
      "codigo_caso": "MP001-2025-1001",
      "nombre_caso": "Homicidio en Zona 10",
      "fecha_inicio": "2025-11-20",
      "id_fiscalia": 1,
      "nombre_fiscalia": "Fiscalía de Delitos contra la Vida",
      "descripcion_hechos": "Investigación sobre el hallazgo de un cuerpo",
      "estado_revision_dicri": "EN_REGISTRO",
      "id_usuario_registro": 2,
      "activo": true,
      "fecha_creacion": "2025-11-22T10:30:00.000Z"
    }
  ]
}
```

#### 🔍 Obtener expediente por ID
```http
GET /api/expedientes/:id
Authorization: Bearer <token>
```

#### ➕ Crear expediente (TECNICO_DICRI, COORDINADOR_DICRI, ADMIN)
```http
POST /api/expedientes
Authorization: Bearer <token>
Content-Type: application/json

{
  "codigo_caso": "MP001-2025-1001",
  "nombre_caso": "Homicidio en Zona 10",
  "fecha_inicio": "2025-11-20",
  "id_fiscalia": 1,
  "descripcion_hechos": "Investigación sobre el hallazgo de un cuerpo con herida de bala"
}
```

**Validaciones:**
- `codigo_caso`: Obligatorio, máximo 50 caracteres, único
- `nombre_caso`: Obligatorio, máximo 255 caracteres
- `fecha_inicio`: Obligatorio, formato ISO 8601 (YYYY-MM-DD)
- `id_fiscalia`: Obligatorio, ID válido de fiscalía
- `descripcion_hechos`: Opcional, texto

#### ✏️ Actualizar expediente (TECNICO_DICRI, COORDINADOR_DICRI, ADMIN)
```http
PUT /api/expedientes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre_caso": "Homicidio en Zona 10 - Actualizado",
  "descripcion_hechos": "Descripción actualizada del caso",
  "activo": true
}
```

#### ❌ Eliminar expediente (COORDINADOR_DICRI, ADMIN)
```http
DELETE /api/expedientes/:id
Authorization: Bearer <token>
```

**Nota:** Eliminación lógica (desactiva el registro)

#### 📤 Enviar a revisión (TECNICO_DICRI, ADMIN)
```http
POST /api/expedientes/:id/enviar-revision
Authorization: Bearer <token>
```

**Requisitos:**
- El expediente debe estar en estado `EN_REGISTRO` o `RECHAZADO`

#### ✅ Aprobar expediente (COORDINADOR_DICRI, ADMIN)
```http
POST /api/expedientes/:id/aprobar
Authorization: Bearer <token>
```

**Requisitos:**
- El expediente debe estar en estado `PENDIENTE_REVISION` o `RECHAZADO`

#### ⚠️ Rechazar expediente (COORDINADOR_DICRI, ADMIN)
```http
POST /api/expedientes/:id/rechazar
Authorization: Bearer <token>
Content-Type: application/json

{
  "justificacion": "Faltan campos de metadatos en el registro de los equipos digitales. Favor complementar."
}
```

**Requisitos:**
- El expediente debe estar en estado `PENDIENTE_REVISION`
- La justificación es obligatoria (mínimo 10 caracteres)

---

### 🔬 Indicios (`/api/indicios` y `/api/expedientes/:id/indicios`)

**⚠️ Todas las rutas requieren autenticación**

#### 📋 Listar todos los indicios
```http
GET /api/indicios
Authorization: Bearer <token>
```

**Parámetros de consulta opcionales:**
- `activo` (boolean): Filtrar por indicios activos/inactivos
- `id_escena` (number): Filtrar por escena
- `id_tipo_indicio` (number): Filtrar por tipo de indicio
- `estado_actual` (string): RECOLECTADO | EN_CUSTODIA | EN_ANALISIS | ANALIZADO | DEVUELTO

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Indicios obtenidos exitosamente",
  "data": [
    {
      "id_indicio": 1,
      "codigo_indicio": "IND-001-2025",
      "id_escena": 1,
      "id_tipo_indicio": 1,
      "descripcion_corta": "Arma de fuego calibre 9mm",
      "ubicacion_especifica": "Sala principal, junto a la ventana",
      "fecha_hora_recoleccion": "2025-11-20T14:30:00.000Z",
      "id_usuario_recolector": 2,
      "estado_actual": "RECOLECTADO",
      "activo": true,
      "nombre_escena": "Escena Principal",
      "nombre_tipo": "Arma de Fuego",
      "nombre_recolector": "Juan Pérez"
    }
  ]
}
```

#### 🔍 Obtener indicio por ID
```http
GET /api/indicios/:id
Authorization: Bearer <token>
```

#### 📦 Obtener indicios de un expediente
```http
GET /api/expedientes/:id/indicios
Authorization: Bearer <token>
```

**Descripción:** Retorna todos los indicios asociados a un expediente (de todas sus escenas)

#### ➕ Crear indicio en un expediente (TECNICO_DICRI, COORDINADOR_DICRI, ADMIN)
```http
POST /api/expedientes/:id/indicios
Authorization: Bearer <token>
Content-Type: application/json

{
  "codigo_indicio": "IND-001-2025",
  "id_escena": 1,
  "id_tipo_indicio": 1,
  "descripcion_corta": "Arma de fuego calibre 9mm",
  "ubicacion_especifica": "Sala principal, junto a la ventana",
  "fecha_hora_recoleccion": "2025-11-20T14:30:00Z"
}
```

**Validaciones:**
- `codigo_indicio`: Obligatorio, máximo 50 caracteres, único
- `id_escena`: Obligatorio, debe existir y pertenecer al expediente
- `id_tipo_indicio`: Obligatorio, debe ser un tipo válido
- `descripcion_corta`: Obligatorio, máximo 255 caracteres
- `ubicacion_especifica`: Opcional, máximo 100 caracteres
- `fecha_hora_recoleccion`: Opcional (si no se envía, usa fecha actual)

**Restricciones:**
- ❌ No se pueden agregar indicios a expedientes en estado `APROBADO`

#### ✏️ Actualizar indicio (TECNICO_DICRI, COORDINADOR_DICRI, ADMIN)
```http
PUT /api/indicios/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "descripcion_corta": "Arma de fuego calibre 9mm marca Glock",
  "ubicacion_especifica": "Actualizada ubicación específica",
  "estado_actual": "EN_CUSTODIA"
}
```

**Estados disponibles:**
- `RECOLECTADO`: Indicio recién recolectado en escena
- `EN_CUSTODIA`: Indicio almacenado en bodega
- `EN_ANALISIS`: Indicio siendo analizado
- `ANALIZADO`: Análisis completado
- `DEVUELTO`: Indicio devuelto

**Restricciones:**
- ❌ No se pueden modificar indicios de expedientes en estado `APROBADO`

#### ❌ Eliminar indicio (TECNICO_DICRI, COORDINADOR_DICRI, ADMIN)
```http
DELETE /api/indicios/:id
Authorization: Bearer <token>
```

**Restricciones:**
- ❌ No se pueden eliminar indicios de expedientes en estado `APROBADO`
- **Nota:** Eliminación lógica (desactiva el registro)

---

### 📁 Fiscalías (`/api/fiscalias`)

**⚠️ Todas las rutas requieren autenticación**

#### 📋 Listar todas las fiscalías
```http
GET /api/fiscalias
Authorization: Bearer <token>
```

**Parámetros de consulta opcionales:**
- `activo` (boolean): Filtrar por fiscalías activas/inactivas

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Fiscalías obtenidas exitosamente",
  "data": [
    {
      "id_fiscalia": 1,
      "nombre_fiscalia": "Fiscalía de Delitos contra la Vida",
      "direccion": "Ciudad de Guatemala, Zona 1",
      "telefono": "2222-3333",
      "activo": true,
      "usuario_creacion": "SYSTEM",
      "fecha_creacion": "2025-11-22T18:20:06.853Z"
    }
  ]
}
```

#### 🔍 Obtener fiscalía por ID
```http
GET /api/fiscalias/:id
Authorization: Bearer <token>
```

#### ➕ Crear fiscalía (ADMIN)
```http
POST /api/fiscalias
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre_fiscalia": "Fiscalía de Delitos Económicos",
  "direccion": "Zona 4, Ciudad de Guatemala",
  "telefono": "2333-4444"
}
```

**Validaciones:**
- `nombre_fiscalia`: Obligatorio, máximo 150 caracteres, único
- `direccion`: Opcional, máximo 255 caracteres
- `telefono`: Opcional, máximo 20 caracteres, formato válido

#### ✏️ Actualizar fiscalía (ADMIN)
```http
PUT /api/fiscalias/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre_fiscalia": "Fiscalía de Delitos Económicos Actualizada",
  "direccion": "Nueva dirección",
  "telefono": "2444-5555",
  "activo": true
}
```

#### ❌ Eliminar fiscalía (ADMIN)
```http
DELETE /api/fiscalias/:id
Authorization: Bearer <token>
```

**Nota:** Eliminación lógica (desactiva el registro)

---

### 🏷️ Tipos de Indicio (`/api/tipos-indicio`)

**⚠️ Todas las rutas requieren autenticación**

#### 📋 Listar todos los tipos de indicio
```http
GET /api/tipos-indicio
Authorization: Bearer <token>
```

**Parámetros de consulta opcionales:**
- `activo` (boolean): Filtrar por tipos activos/inactivos

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Tipos de indicio obtenidos exitosamente",
  "data": [
    {
      "id_tipo_indicio": 1,
      "nombre_tipo": "Arma de Fuego",
      "descripcion": "Armas de cualquier tipo y calibre",
      "activo": true,
      "usuario_creacion": "SYSTEM",
      "fecha_creacion": "2025-11-22T18:20:06.870Z"
    }
  ]
}
```

#### 🔍 Obtener tipo de indicio por ID
```http
GET /api/tipos-indicio/:id
Authorization: Bearer <token>
```

#### ➕ Crear tipo de indicio (ADMIN, COORDINADOR_DICRI)
```http
POST /api/tipos-indicio
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre_tipo": "Evidencia Digital",
  "descripcion": "Dispositivos electrónicos y medios de almacenamiento"
}
```

**Validaciones:**
- `nombre_tipo`: Obligatorio, máximo 100 caracteres, único
- `descripcion`: Opcional, máximo 255 caracteres

#### ✏️ Actualizar tipo de indicio (ADMIN, COORDINADOR_DICRI)
```http
PUT /api/tipos-indicio/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre_tipo": "Evidencia Digital Actualizada",
  "descripcion": "Nueva descripción",
  "activo": true
}
```

#### ❌ Eliminar tipo de indicio (ADMIN, COORDINADOR_DICRI)
```http
DELETE /api/tipos-indicio/:id
Authorization: Bearer <token>
```

**Nota:** Eliminación lógica (desactiva el registro)

---

## 🔄 Flujo de Estados de Expedientes

```
EN_REGISTRO → (Enviar a revisión) → PENDIENTE_REVISION
                                            ↓
                                         Aprobar → APROBADO
                                            ↓
                                        Rechazar → RECHAZADO → (Corregir y reenviar) → PENDIENTE_REVISION
```

### Estados disponibles:
- **EN_REGISTRO**: Expediente siendo completado por el técnico
- **PENDIENTE_REVISION**: Expediente listo para revisión del coordinador
- **APROBADO**: Expediente revisado y validado
- **RECHAZADO**: Expediente requiere correcciones

---

### 🏥 Health Check
```http
GET /api/health
```

**Respuesta (200):**
```json
{
  "status": "OK",
  "timestamp": "2025-11-22T10:30:00.000Z",
  "database": "connected"
}
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

## 📝 Scripts Disponibles

```json
{
  "dev": "nodemon",
  "docker:dev": "nodemon --exec 'node --inspect=0.0.0.0:9229 -r ts-node/register' src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "test": "jest"
}
```

### Descripción de scripts:

- **`npm run dev`**: Desarrollo local con Hot Reload (requiere configuración local)
- **`npm run docker:dev`**: Desarrollo en Docker con Hot Reload y Debugging
- **`npm run build`**: Compila TypeScript a JavaScript en la carpeta `dist/`
- **`npm start`**: Ejecuta la aplicación compilada en producción
- **`npm test`**: Ejecuta las pruebas con Jest

### 🐛 Debugging

El servidor está configurado para debugging en el puerto **9229**:

1. Ejecuta el contenedor: `docker-compose up -d`
2. En VS Code, ve a "Run and Debug" (Ctrl+Shift+D)
3. Selecciona "Docker: Attach to Backend"
4. Presiona F5
5. Coloca breakpoints y debuguea normalmente

**Controles de debugging:**
- `F10` - Step Over (siguiente línea)
- `F11` - Step Into (entrar a función)
- `Shift+F11` - Step Out (salir de función)
- `F5` - Continue (continuar hasta siguiente breakpoint)

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

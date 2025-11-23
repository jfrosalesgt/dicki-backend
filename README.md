# DICRI Backend API

Backend desarrollado con Express.js, TypeScript y SQL Server 2022 - Prueba Técnica por José Fernando Rosales Escobar.

## 📑 Tabla de Contenido

- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
  - [Autenticación](#autenticación-api-auth)
  - [Usuarios](#usuarios-api-users)
  - [Expedientes DICRI](#expedientes-dicri-api-expedientes)
  - [Indicios](#indicios-api-indicios-y-apiexpedientesidindicios)
  - [Fiscalías](#fiscalías-api-fiscalias)
  - [Escenas](#escenas-api-escenas-y-apiexpedientesidescenas)
  - [Reportes y Estadísticas](#reportes-y-estadísticas-api-reportes)
  - [Tipos de Indicio](#tipos-de-indicio-api-tipos-indicio)
- [Flujo de Estados de Expedientes](#flujo-de-estados-de-expedientes)
- [Health Check](#health-check)
- [Base de Datos](#base-de-datos)
- [Gestión de Usuarios y Roles](#gestión-de-usuarios-y-roles)
- [Seguridad](#seguridad)
- [Variables de Entorno Importantes](#variables-de-entorno-importantes)
- [Testing](#testing)
- [Scripts Disponibles](#scripts-disponibles)
- [Debugging](#debugging)
- [Contribución](#contribución)
- [Licencia](#licencia)
- [Autor](#autor)

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
- `estado_revision` (string): EN_REGISTRO | PENDIENTE_REVISION | APROBADO | RECHAZADO | ELIMINADO
- `id_usuario_registro` (number): Filtrar por técnico que registró
- `id_fiscalia` (number): Filtrar por fiscalía

**Ordenamiento:** Los resultados se ordenan por `fecha_creacion` descendente (más recientes primero)

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Expedientes obtenidos exitosamente",
  "data": [
    {
      "id_investigacion": 1,
      "codigo_caso": "DICRI-001-2025-1001",
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
  "codigo_caso": "DICRI-001-2025-1001",
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

#### ❌ Eliminar expediente (TECNICO_DICRI, COORDINADOR_DICRI, ADMIN)
```http
DELETE /api/expedientes/:id
Authorization: Bearer <token>
```

**Efectos de la eliminación:**
- ✅ Campo `activo` cambia a `0` (desactivado)
- ✅ Campo `estado_revision_dicri` cambia a `ELIMINADO`
- ℹ️ Eliminación lógica (no se elimina físicamente el registro)

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

### 🎬 Escenas (`/api/escenas` y `/api/expedientes/:id/escenas`)

**⚠️ Todas las rutas requieren autenticación**

#### 📋 Listar todas las escenas
```http
GET /api/escenas
Authorization: Bearer <token>
```

**Parámetros de consulta opcionales:**
- `activo` (boolean): Filtrar por escenas activas/inactivas
- `id_investigacion` (number): Filtrar por expediente

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Escenas obtenidas exitosamente",
  "data": [
    {
      "id_escena": 1,
      "id_investigacion": 1,
      "nombre_escena": "Escena Principal - Sala",
      "direccion_escena": "5ta Avenida 10-25 Zona 10, Ciudad de Guatemala",
      "fecha_hora_inicio": "2025-11-20T08:00:00.000Z",
      "fecha_hora_fin": "2025-11-20T14:30:00.000Z",
      "descripcion": "Sala principal donde se encontró el cuerpo",
      "activo": true,
      "fecha_creacion": "2025-11-22T10:30:00.000Z"
    }
  ]
}
```

#### 🔍 Obtener escena por ID
```http
GET /api/escenas/:id
Authorization: Bearer <token>
```

#### 📦 Obtener escenas de un expediente
```http
GET /api/expedientes/:id/escenas
Authorization: Bearer <token>
```

**Descripción:** Retorna todas las escenas asociadas a un expediente específico

#### ➕ Crear escena en un expediente (TECNICO_DICRI, COORDINADOR_DICRI, ADMIN)
```http
POST /api/expedientes/:id/escenas
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre_escena": "Escena Principal - Sala",
  "direccion_escena": "5ta Avenida 10-25 Zona 10, Ciudad de Guatemala",
  "fecha_hora_inicio": "2025-11-20T08:00:00Z",
  "fecha_hora_fin": "2025-11-20T14:30:00Z",
  "descripcion": "Sala principal donde se encontró el cuerpo"
}
```

**Validaciones:**
- `nombre_escena`: Obligatorio, máximo 150 caracteres
- `direccion_escena`: Obligatorio, máximo 255 caracteres
- `fecha_hora_inicio`: Obligatorio, formato ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
- `fecha_hora_fin`: Opcional, formato ISO 8601, debe ser posterior a fecha_hora_inicio
- `descripcion`: Opcional, texto

**Restricciones:**
- ❌ No se pueden agregar escenas a expedientes en estado `APROBADO`

#### ✏️ Actualizar escena (TECNICO_DICRI, COORDINADOR_DICRI, ADMIN)
```http
PUT /api/escenas/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre_escena": "Escena Principal - Sala Actualizada",
  "direccion_escena": "Dirección actualizada",
  "fecha_hora_fin": "2025-11-20T16:00:00Z",
  "descripcion": "Descripción actualizada de la escena"
}
```

**Restricciones:**
- ❌ No se pueden modificar escenas de expedientes en estado `APROBADO`

#### ❌ Eliminar escena (TECNICO_DICRI, COORDINADOR_DICRI, ADMIN)
```http
DELETE /api/escenas/:id
Authorization: Bearer <token>
```

**Restricciones:**
- ❌ No se pueden eliminar escenas de expedientes en estado `APROBADO`
- **Nota:** Eliminación lógica (desactiva el registro)

---

### 📊 Reportes y Estadísticas (`/api/reportes`)

**⚠️ Todas las rutas requieren autenticación**

#### 📈 Estadísticas generales (Todos los roles)
```http
GET /api/reportes/estadisticas-generales
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Estadísticas generales obtenidas exitosamente",
  "data": {
    "total_expedientes": 10,
    "expedientes_activos": 8,
    "expedientes_por_estado": {
      "EN_REGISTRO": 3,
      "PENDIENTE_REVISION": 2,
      "APROBADO": 2,
      "RECHAZADO": 1
    },
    "total_indicios": 25,
    "indicios_por_tipo": {
      "Arma de Fuego": 5,
      "Evidencia Digital": 8,
      "Documentos": 12
    },
    "expedientes_por_fiscalia": {
      "Fiscalía de Delitos contra la Vida": 4,
      "Fiscalía de Delitos Económicos": 3,
      "Fiscalía de Delitos Informáticos": 3
    }
  }
}
```

**Acceso:** Disponible para todos los roles autenticados (TECNICO_DICRI, COORDINADOR_DICRI, ADMIN)

#### 📋 Reporte de revisión de expedientes (COORDINADOR_DICRI, ADMIN)
```http
GET /api/reportes/revision-expedientes
Authorization: Bearer <token>
```

**Parámetros de consulta opcionales:**
- `fecha_inicio` (string): Fecha de inicio del período (YYYY-MM-DD)
- `fecha_fin` (string): Fecha de fin del período (YYYY-MM-DD)
- `estado_revision` (string): EN_REGISTRO | PENDIENTE_REVISION | APROBADO | RECHAZADO

**Ejemplo con filtros:**
```http
GET /api/reportes/revision-expedientes?fecha_inicio=2025-01-01&fecha_fin=2025-12-31&estado_revision=APROBADO
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Reporte de revisión de expedientes obtenido exitosamente",
  "data": [
    {
      "codigo_caso": "MP001-2025-1001",
      "nombre_caso": "Homicidio en Zona 10",
      "nombre_fiscalia": "Fiscalía de Delitos contra la Vida",
      "fecha_registro": "2025-11-20T10:30:00.000Z",
      "tecnico_registra": "Juan Pérez",
      "estado_actual": "APROBADO",
      "fecha_revision": "2025-11-21T15:00:00.000Z",
      "coordinador_revision": "María López",
      "justificacion_revision": "Aprobado sin observaciones."
    }
  ]
}
```

**Acceso:** Solo COORDINADOR_DICRI y ADMIN

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

ELIMINADO ← (Eliminar expediente) ← Cualquier estado (excepto APROBADO recomendado)
```

### Estados disponibles:
- **EN_REGISTRO**: Expediente siendo completado por el técnico
- **PENDIENTE_REVISION**: Expediente listo para revisión del coordinador
- **APROBADO**: Expediente revisado y validado
- **RECHAZADO**: Expediente requiere correcciones
- **ELIMINADO**: Expediente eliminado lógicamente (activo=0)

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

El sistema incluye 3 usuarios de ejemplo con roles diferentes:

| Usuario | Contraseña | Rol | Descripción |
|---------|-----------|-----|-------------|
| `admin` | `admin123` | ADMIN | Administrador con acceso completo |
| `tec_1` | `tecnico123` | TECNICO_DICRI | Técnico que registra expedientes e indicios |
| `coor_1` | `coordinador123` | COORDINADOR_DICRI | Coordinador que aprueba/rechaza expedientes |

⚠️ **Importante**: Cambia las contraseñas de los usuarios después del primer login en producción.

---

## 👥 Gestión de Usuarios y Roles

### Crear un nuevo usuario y asignar roles

#### 1️⃣ Crear un usuario Técnico

```sql
-- Conectarse a SQL Server
USE [dicri-indicios];
GO

-- Variables
DECLARE @ClaveHash NVARCHAR(255) = '0192023a7bbd73250516f069df18b500'; -- Hash MD5 de 'admin123'
DECLARE @id_usuario INT;
DECLARE @id_perfil_tecnico INT;

-- 1. Crear el usuario
INSERT INTO Usuario (nombre_usuario, clave, nombre, apellido, email, activo, cambiar_clave, intentos_fallidos, usuario_creacion)
VALUES ('tec_2', @ClaveHash, 'Carlos', 'Mendez', 'carlos.mendez@dicri.com', 1, 1, 0, 'admin');

-- Obtener ID del usuario creado
SET @id_usuario = SCOPE_IDENTITY();

-- 2. Obtener ID del perfil Técnico DICRI
SELECT @id_perfil_tecnico = id_perfil 
FROM Perfil 
WHERE nombre_perfil = 'Técnico DICRI';

-- 3. Asignar perfil al usuario
INSERT INTO Usuario_Perfil (id_usuario, id_perfil, usuario_creacion)
VALUES (@id_usuario, @id_perfil_tecnico, 'admin');

-- Verificar
SELECT 
    u.nombre_usuario,
    u.nombre + ' ' + u.apellido AS nombre_completo,
    p.nombre_perfil,
    r.nombre_role
FROM Usuario u
INNER JOIN Usuario_Perfil up ON u.id_usuario = up.id_usuario
INNER JOIN Perfil p ON up.id_perfil = p.id_perfil
INNER JOIN Perfil_Role pr ON p.id_perfil = pr.id_perfil
INNER JOIN Role r ON pr.id_role = r.id_role
WHERE u.id_usuario = @id_usuario;
GO
```

#### 2️⃣ Crear un usuario Coordinador

```sql
USE [dicri-indicios];
GO

DECLARE @ClaveHash NVARCHAR(255) = '0192023a7bbd73250516f069df18b500'; -- Hash MD5 de 'admin123'
DECLARE @id_usuario INT;
DECLARE @id_perfil_coordinador INT;

-- 1. Crear el usuario
INSERT INTO Usuario (nombre_usuario, clave, nombre, apellido, email, activo, cambiar_clave, intentos_fallidos, usuario_creacion)
VALUES ('coor_2', @ClaveHash, 'Ana', 'Rodriguez', 'ana.rodriguez@dicri.com', 1, 1, 0, 'admin');

SET @id_usuario = SCOPE_IDENTITY();

-- 2. Obtener ID del perfil Coordinador DICRI
SELECT @id_perfil_coordinador = id_perfil 
FROM Perfil 
WHERE nombre_perfil = 'Coordinador DICRI';

-- 3. Asignar perfil al usuario
INSERT INTO Usuario_Perfil (id_usuario, id_perfil, usuario_creacion)
VALUES (@id_usuario, @id_perfil_coordinador, 'admin');

-- Verificar
SELECT 
    u.nombre_usuario,
    u.nombre + ' ' + u.apellido AS nombre_completo,
    p.nombre_perfil,
    r.nombre_role
FROM Usuario u
INNER JOIN Usuario_Perfil up ON u.id_usuario = up.id_usuario
INNER JOIN Perfil p ON up.id_perfil = p.id_perfil
INNER JOIN Perfil_Role pr ON p.id_perfil = pr.id_perfil
INNER JOIN Role r ON pr.id_role = r.id_role
WHERE u.id_usuario = @id_usuario;
GO
```

#### 3️⃣ Crear un usuario Administrador

```sql
USE [dicri-indicios];
GO

DECLARE @ClaveHash NVARCHAR(255) = '0192023a7bbd73250516f069df18b500'; -- Hash MD5 de 'admin123'
DECLARE @id_usuario INT;
DECLARE @id_perfil_admin INT;

-- 1. Crear el usuario
INSERT INTO Usuario (nombre_usuario, clave, nombre, apellido, email, activo, cambiar_clave, intentos_fallidos, usuario_creacion)
VALUES ('admin_2', @ClaveHash, 'Luis', 'Gonzalez', 'luis.gonzalez@dicri.com', 1, 1, 0, 'admin');

SET @id_usuario = SCOPE_IDENTITY();

-- 2. Obtener ID del perfil Administrador
SELECT @id_perfil_admin = id_perfil 
FROM Perfil 
WHERE nombre_perfil = 'Administrador';

-- 3. Asignar perfil al usuario
INSERT INTO Usuario_Perfil (id_usuario, id_perfil, usuario_creacion)
VALUES (@id_usuario, @id_perfil_admin, 'admin');

-- Verificar
SELECT 
    u.nombre_usuario,
    u.nombre + ' ' + u.apellido AS nombre_completo,
    p.nombre_perfil,
    r.nombre_role
FROM Usuario u
INNER JOIN Usuario_Perfil up ON u.id_usuario = up.id_usuario
INNER JOIN Perfil p ON up.id_perfil = p.id_perfil
INNER JOIN Perfil_Role pr ON p.id_perfil = pr.id_perfil
INNER JOIN Role r ON pr.id_role = r.id_role
WHERE u.id_usuario = @id_usuario;
GO
```

### 🔐 Generar hash MD5 para contraseñas

Para crear una contraseña personalizada, genera su hash MD5:

**PowerShell:**
```powershell
# Generar hash MD5 de una contraseña
$password = "MiPassword123"
$md5 = [System.Security.Cryptography.MD5]::Create()
$hash = [System.BitConverter]::ToString($md5.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($password))).Replace("-", "").ToLower()
Write-Host "Hash MD5: $hash"
```

**Ejemplo de salida:**
```
Hash MD5: 0192023a7bbd73250516f069df18b500
```

Luego usa ese hash en la variable `@ClaveHash` del script SQL.

### 📋 Consultas útiles para gestión de usuarios

#### Ver todos los usuarios con sus roles

```sql
SELECT 
    u.id_usuario,
    u.nombre_usuario,
    u.nombre + ' ' + u.apellido AS nombre_completo,
    u.email,
    u.activo,
    p.nombre_perfil,
    r.nombre_role,
    u.fecha_ultimo_acceso
FROM Usuario u
LEFT JOIN Usuario_Perfil up ON u.id_usuario = up.id_usuario
LEFT JOIN Perfil p ON up.id_perfil = p.id_perfil
LEFT JOIN Perfil_Role pr ON p.id_perfil = pr.id_perfil
LEFT JOIN Role r ON pr.id_role = r.id_role
ORDER BY u.id_usuario;
```

#### Ver módulos disponibles por perfil

```sql
SELECT 
    p.nombre_perfil,
    m.nombre_modulo,
    m.ruta,
    m.orden
FROM Perfil p
INNER JOIN Perfil_Modulo pm ON p.id_perfil = pm.id_perfil
INNER JOIN Modulo m ON pm.id_modulo = m.id_modulo
WHERE p.activo = 1 AND m.activo = 1
ORDER BY p.nombre_perfil, m.orden;
```

#### Cambiar el rol de un usuario existente

```sql
-- Ejemplo: Cambiar tec_1 de Técnico a Coordinador
USE [dicri-indicios];
GO

DECLARE @id_usuario INT = (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'tec_1');
DECLARE @id_perfil_coordinador INT = (SELECT id_perfil FROM Perfil WHERE nombre_perfil = 'Coordinador DICRI');

-- Eliminar asignación actual
DELETE FROM Usuario_Perfil WHERE id_usuario = @id_usuario;

-- Asignar nuevo perfil
INSERT INTO Usuario_Perfil (id_usuario, id_perfil, usuario_creacion)
VALUES (@id_usuario, @id_perfil_coordinador, 'admin');

-- Verificar cambio
SELECT 
    u.nombre_usuario,
    p.nombre_perfil,
    r.nombre_role
FROM Usuario u
INNER JOIN Usuario_Perfil up ON u.id_usuario = up.id_usuario
INNER JOIN Perfil p ON up.id_perfil = p.id_perfil
INNER JOIN Perfil_Role pr ON p.id_perfil = pr.id_perfil
INNER JOIN Role r ON pr.id_role = r.id_role
WHERE u.id_usuario = @id_usuario;
GO
```

#### Desactivar/Activar un usuario

```sql
-- Desactivar usuario
UPDATE Usuario 
SET activo = 0, 
    usuario_actualizacion = 'admin',
    fecha_actualizacion = GETDATE()
WHERE nombre_usuario = 'tec_2';

-- Activar usuario
UPDATE Usuario 
SET activo = 1, 
    usuario_actualizacion = 'admin',
    fecha_actualizacion = GETDATE()
WHERE nombre_usuario = 'tec_2';
```

### 🔄 Estructura de Roles y Permisos

```
ADMINISTRADOR
├─ Módulos: Todos (Dashboard, Gestión, Revisión, Reportes, Administración)
├─ Permisos: Acceso completo al sistema
└─ Puede: Crear usuarios, gestionar catálogos, todo lo de técnicos y coordinadores

TÉCNICO DICRI
├─ Módulos: Dashboard, Gestión de Expedientes
├─ Permisos: Registrar expedientes, indicios y escenas
└─ Puede: 
   ✅ Crear expedientes
   ✅ Crear indicios y escenas
   ✅ Actualizar expedientes EN_REGISTRO o RECHAZADO
   ✅ Enviar expedientes a revisión
   ✅ Eliminar expedientes (cambia a estado ELIMINADO)
   ✅ Ver estadísticas generales
   ❌ Aprobar/Rechazar expedientes
   ❌ Ver reportes de revisión

COORDINADOR DICRI
├─ Módulos: Dashboard, Revisión de Expedientes, Informes y Estadísticas
├─ Permisos: Revisar y aprobar/rechazar expedientes
└─ Puede:
   ✅ Ver todos los expedientes
   ✅ Aprobar expedientes
   ✅ Rechazar expedientes (con justificación)
   ✅ Ver reportes y estadísticas
   ✅ Eliminar expedientes (cambia a estado ELIMINADO)
   ❌ Crear/modificar expedientes
   ❌ Crear indicios
```

---

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

## 🧪 Testing

### Ejecutar Pruebas

El proyecto incluye pruebas unitarias completas para los servicios principales.

```powershell
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch (útil durante desarrollo)
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage

# Ejecutar pruebas con salida detallada
npm run test:verbose
```

### Ejecutar un archivo de prueba específico

Para correr solo un archivo (por ejemplo `AuthService.test.ts`) usa la ruta relativa dentro de `src`:

```powershell
npx jest src/__tests__/services/AuthService.test.ts --verbose
```

En modo watch (re-ejecuta al guardar cambios):

```powershell
npx jest src/__tests__/services/AuthService.test.ts --watch
```

### Ejecutar un único test dentro de un archivo

Utiliza la opción `-t` / `--testNamePattern` con el nombre (o parte del nombre) del `it()` / `test()`.

Ejemplo: correr solo el caso de login exitoso del `AuthService`:

```powershell
npx jest src/__tests__/services/AuthService.test.ts -t "debería realizar login exitoso"
```

También puedes usar una expresión regular parcial:

```powershell
npx jest src/__tests__/services/AuthService.test.ts -t login
```

### Limpiar caché antes de reintentar (opcional)

Si Jest conserva resultados obsoletos:

```powershell
npx jest --clearCache
```

### Otros flags útiles

```text
--runInBand          Ejecuta pruebas secuencialmente (útil para depurar)
--detectOpenHandles  Ayuda a identificar handles abiertos que impiden terminar
--maxWorkers=50%     Reduce concurrencia si hay problemas de memoria
```

### Estructura de Pruebas

```
src/__tests__/
├── simple.test.ts                    # 1 test case
└── services/
  ├── AuthService.test.ts           # 8 test cases
  ├── UserService.test.ts           # 8 test cases
  ├── InvestigacionService.test.ts  # 11 test cases
  ├── EscenaService.test.ts         # 10 test cases
  └── FiscaliaService.test.ts       # 9 test cases
```

**Total:** 47 test cases cubriendo:
- ✅ Autenticación y cambio de contraseñas
- ✅ CRUD de usuarios con validaciones
- ✅ Flujo completo DICRI (estados de expedientes)
- ✅ Gestión de escenas con restricciones por estado
- ✅ CRUD de fiscalías

### Ejemplo de Salida

```
PASS  src/__tests__/services/AuthService.test.ts
PASS  src/__tests__/services/UserService.test.ts
PASS  src/__tests__/services/InvestigacionService.test.ts
PASS  src/__tests__/services/EscenaService.test.ts
PASS  src/__tests__/services/FiscaliaService.test.ts
PASS  src/__tests__/simple.test.ts

Test Suites: 6 passed, 6 total
Tests:       47 passed, 47 total
Snapshots:   0 total
```

### Reporte de Cobertura

Con `npm run test:coverage`, se genera un informe de cobertura textual y un reporte HTML navegable.

Ubicación del reporte HTML principal:
```
coverage/lcov-report/index.html
```

---

## 📝 Scripts Disponibles

```json
{
  "dev": "nodemon",
  "docker:dev": "nodemon --exec 'node --inspect=0.0.0.0:9229 -r ts-node/register' src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:verbose": "jest --verbose"
}
```

### Descripción de scripts:

#### Desarrollo
- **`npm run dev`**: Desarrollo local con Hot Reload (requiere configuración local)
- **`npm run docker:dev`**: Desarrollo en Docker con Hot Reload y Debugging

#### Producción
- **`npm run build`**: Compila TypeScript a JavaScript en la carpeta `dist/`
- **`npm start`**: Ejecuta la aplicación compilada en producción

#### Testing
- **`npm test`**: Ejecuta todas las pruebas unitarias
- **`npm run test:watch`**: Ejecuta pruebas en modo watch (re-ejecuta al cambiar archivos)
- **`npm run test:coverage`**: Genera reporte de cobertura de código
- **`npm run test:verbose`**: Ejecuta pruebas con salida detallada de cada test

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

## 👨‍💻 Autor

**José Fernando Rosales Escobar**
- 📧 Email: fernando.rosales.gt@gmail.com
- 📱 Teléfono: 3302-1642
- 📅 Año: 2025
- 📋 Proyecto: Prueba Técnica - Sistema DICRI Backend


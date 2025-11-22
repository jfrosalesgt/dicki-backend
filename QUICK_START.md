# Guía de Inicio Rápido - DICRI Backend

## 📋 Pasos para iniciar el proyecto

### 1. Verificar que las dependencias estén instaladas

```powershell
npm install
```

### 2. Crear la base de datos en SQL Server

Ejecuta el script `database-schema.sql` en SQL Server Management Studio o usando sqlcmd:

```sql
-- Primero crea la base de datos DICRI si no existe
CREATE DATABASE DICRI;
GO
```

Luego ejecuta el script completo del archivo `database-schema.sql`

### 3. Configurar variables de entorno

El archivo `.env` ya está creado con la configuración correcta:

```env
DB_SERVER=host.docker.internal,1434
DB_USER=appindicios
DB_PASSWORD=Ind1c10$
DB_DATABASE=DICRI
```

### 4. Iniciar el servidor

```powershell
npm run dev
```

El servidor iniciará en `http://localhost:3000`

---

## 🧪 Pruebas con ejemplos

### 1. Login (Obtener Token)

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "nombre_usuario": "admin",
  "clave": "admin123"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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
        "descripcion": "Perfil con acceso total al sistema"
      }
    ],
    "roles": [
      {
        "id_role": 1,
        "nombre_role": "ADMIN",
        "descripcion": "Role de administrador del sistema"
      }
    ]
  }
}
```

⚠️ **Guarda el token** para las siguientes peticiones.

---

### 2. Verificar Token

```bash
GET http://localhost:3000/api/auth/verify
Authorization: Bearer TU_TOKEN_AQUI
```

---

### 3. Cambiar Contraseña

```bash
POST http://localhost:3000/api/auth/change-password
Authorization: Bearer TU_TOKEN_AQUI
Content-Type: application/json

{
  "clave_actual": "admin123",
  "clave_nueva": "Admin2024!"
}
```

**Requisitos de la nueva contraseña:**
- Mínimo 6 caracteres
- Al menos una mayúscula
- Al menos una minúscula
- Al menos un número

---

### 4. Obtener información del usuario autenticado

```bash
GET http://localhost:3000/api/auth/me
Authorization: Bearer TU_TOKEN_AQUI
```

---

### 5. Listar todos los usuarios (Solo ADMIN)

```bash
GET http://localhost:3000/api/users
Authorization: Bearer TU_TOKEN_AQUI
```

**Con filtro de activos:**
```bash
GET http://localhost:3000/api/users?activo=true
Authorization: Bearer TU_TOKEN_AQUI
```

---

### 6. Crear un nuevo usuario (Solo ADMIN)

```bash
POST http://localhost:3000/api/users
Authorization: Bearer TU_TOKEN_AQUI
Content-Type: application/json

{
  "nombre_usuario": "jperez",
  "clave": "Pass123",
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "jperez@dicri.com"
}
```

---

### 7. Actualizar un usuario (Solo ADMIN)

```bash
PUT http://localhost:3000/api/users/2
Authorization: Bearer TU_TOKEN_AQUI
Content-Type: application/json

{
  "nombre": "Juan Carlos",
  "email": "jcperez@dicri.com"
}
```

---

### 8. Desactivar un usuario (Solo ADMIN)

```bash
PATCH http://localhost:3000/api/users/2/deactivate
Authorization: Bearer TU_TOKEN_AQUI
```

---

### 9. Activar un usuario (Solo ADMIN)

```bash
PATCH http://localhost:3000/api/users/2/activate
Authorization: Bearer TU_TOKEN_AQUI
```

---

## 🔍 Códigos de respuesta HTTP

| Código | Descripción |
|--------|-------------|
| 200 | Operación exitosa |
| 201 | Recurso creado exitosamente |
| 400 | Solicitud incorrecta (errores de validación) |
| 401 | No autorizado (token inválido o ausente) |
| 403 | Acceso denegado (sin permisos) |
| 404 | Recurso no encontrado |
| 409 | Conflicto (ej: usuario ya existe) |
| 500 | Error interno del servidor |

---

## 🔐 Estructura del Token JWT

El token incluye la siguiente información:

```json
{
  "id_usuario": 1,
  "nombre_usuario": "admin",
  "email": "admin@dicri.com",
  "perfiles": [1],
  "roles": ["ADMIN"],
  "iat": 1700000000,
  "exp": 1700028800
}
```

---

## 📝 Estructura de respuestas

### Respuesta exitosa
```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": { ... }
}
```

### Respuesta de error
```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [ ... ]
}
```

---

## 🛠️ Testing con PowerShell

### Login
```powershell
$body = @{
    nombre_usuario = "admin"
    clave = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
$token = $response.data.token
Write-Host "Token: $token"
```

### Obtener usuarios con token
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method GET -Headers $headers
```

---

## 🐛 Solución de Problemas

### Error: No se puede conectar a la base de datos

Verifica:
1. SQL Server está ejecutándose
2. El puerto 1434 está abierto
3. Las credenciales en `.env` son correctas
4. La base de datos DICRI existe

### Error: Token inválido o expirado

Genera un nuevo token haciendo login nuevamente.

### Error: Usuario bloqueado

Ejecuta en SQL Server:
```sql
UPDATE Usuario 
SET intentos_fallidos = 0 
WHERE nombre_usuario = 'admin';
```

---

## 📊 Consultas SQL útiles

### Ver todos los usuarios
```sql
SELECT * FROM Usuario;
```

### Ver perfiles de un usuario
```sql
SELECT p.* 
FROM Perfil p
INNER JOIN Usuario_Perfil up ON p.id_perfil = up.id_perfil
WHERE up.id_usuario = 1 AND up.activo = 1;
```

### Ver módulos accesibles por un usuario
```sql
SELECT DISTINCT m.* 
FROM Modulo m
INNER JOIN Perfil_Modulo pm ON m.id_modulo = pm.id_modulo
INNER JOIN Usuario_Perfil up ON pm.id_perfil = up.id_perfil
WHERE up.id_usuario = 1 
  AND m.activo = 1 
  AND pm.activo = 1 
  AND up.activo = 1;
```

---

## 📚 Próximos pasos

1. Cambiar la contraseña del usuario admin
2. Crear nuevos perfiles y roles según necesidades
3. Definir módulos de la aplicación
4. Asignar permisos a perfiles
5. Crear usuarios reales del sistema

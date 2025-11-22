# 🐳 Despliegue con Docker - DICRI Backend

## 📋 Prerequisitos

- Docker instalado (versión 20.10 o superior)
- Docker Compose instalado (versión 2.0 o superior)
- SQL Server en Docker ya funcionando (opcional si usas SQL Server existente)

## 🚀 Opción 1: Desplegar solo el Backend (Base de datos existente)

Si ya tienes SQL Server corriendo en Docker en el puerto 1434:

```powershell
# Construir y ejecutar
docker-compose -f docker-compose.existing-db.yml up -d

# Ver logs
docker-compose -f docker-compose.existing-db.yml logs -f dicri-backend

# Detener
docker-compose -f docker-compose.existing-db.yml down
```

## 🚀 Opción 2: Desplegar Backend + SQL Server completo

Si quieres todo el stack completo (backend + base de datos):

```powershell
# Construir y ejecutar todo
docker-compose up -d

# Ver logs de ambos servicios
docker-compose logs -f

# Ver solo logs del backend
docker-compose logs -f dicri-backend

# Ver solo logs de SQL Server
docker-compose logs -f sqlserver

# Detener todo
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: elimina datos de BD)
docker-compose down -v
```

## 📦 Construcción manual de la imagen Docker

Si prefieres construir la imagen manualmente:

```powershell
# Construir la imagen
docker build -t dicri-backend:latest .

# Ejecutar el contenedor
docker run -d `
  --name dicri-backend `
  -p 3000:3000 `
  -e NODE_ENV=production `
  -e DB_SERVER=host.docker.internal `
  -e DB_PORT=1434 `
  -e DB_USER=appindicios `
  -e DB_PASSWORD=Ind1c10$ `
  -e DB_DATABASE=dicri-indicios `
  -e JWT_SECRET=tu-secreto-seguro `
  --add-host=host.docker.internal:host-gateway `
  dicri-backend:latest

# Ver logs
docker logs -f dicri-backend

# Detener
docker stop dicri-backend

# Eliminar
docker rm dicri-backend
```

## 🔧 Configuración

### Variables de Entorno Importantes

Edita `docker-compose.yml` o `docker-compose.existing-db.yml` según tus necesidades:

```yaml
environment:
  # Servidor
  - NODE_ENV=production
  - PORT=3000
  
  # Base de datos
  - DB_SERVER=host.docker.internal  # o nombre del servicio si está en Docker
  - DB_PORT=1434
  - DB_USER=appindicios
  - DB_PASSWORD=Ind1c10$
  - DB_DATABASE=dicri-indicios
  
  # JWT (¡CAMBIAR EN PRODUCCIÓN!)
  - JWT_SECRET=tu-secreto-muy-seguro-aqui
  - JWT_EXPIRES_IN=8h
  
  # CORS
  - CORS_ORIGIN=https://tu-dominio.com
```

## 📊 Verificar que funciona

### 1. Health Check

```powershell
# Desde PowerShell
Invoke-RestMethod -Uri "http://localhost:3000/api/health"

# O desde el navegador
# http://localhost:3000/api/health
```

### 2. Swagger UI

```
http://localhost:3000/api-docs
```

### 3. Login de prueba

```powershell
$body = @{
    nombre_usuario = "admin"
    clave = "admin123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

## 🔍 Comandos útiles

### Ver estado de contenedores

```powershell
docker ps
```

### Ver logs en tiempo real

```powershell
docker logs -f dicri-backend
```

### Entrar al contenedor

```powershell
docker exec -it dicri-backend sh
```

### Ver uso de recursos

```powershell
docker stats dicri-backend
```

### Reiniciar el servicio

```powershell
docker-compose restart dicri-backend
```

### Ver información del contenedor

```powershell
docker inspect dicri-backend
```

## 🌐 Arquitectura de Red

### Con Base de Datos Existente (docker-compose.existing-db.yml)

```
Host Machine (Windows)
├── SQL Server (Docker) - Puerto 1434
│   └── dicri-indicios (database)
│
└── dicri-backend (Docker) - Puerto 3000
    └── Conecta a host.docker.internal:1434
```

### Con Stack Completo (docker-compose.yml)

```
Docker Network: dicri-network
│
├── sqlserver (Container)
│   └── Puerto interno: 1433
│   └── Puerto expuesto: 1434
│
└── dicri-backend (Container)
    └── Puerto interno: 3000
    └── Puerto expuesto: 3000
    └── Conecta a: sqlserver:1433
```

## 🔒 Seguridad para Producción

Antes de desplegar en producción real:

1. **Cambiar JWT_SECRET**: Usa un secreto fuerte y único
   ```powershell
   # Generar secreto seguro
   [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
   ```

2. **Configurar CORS**: Limita los orígenes permitidos
   ```yaml
   - CORS_ORIGIN=https://tu-dominio.com,https://www.tu-dominio.com
   ```

3. **Usar variables de entorno o secrets**: No hardcodear passwords
   
4. **Habilitar SSL/TLS**: Usa un reverse proxy (nginx, traefik)

5. **Limitar recursos del contenedor**:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '1'
         memory: 512M
       reservations:
         cpus: '0.5'
         memory: 256M
   ```

## 🐛 Troubleshooting

### Error: No se puede conectar a la base de datos

```powershell
# Verificar que SQL Server está corriendo
docker ps | Select-String sqlserver

# Probar conexión desde el host
sqlcmd -S localhost,1434 -U appindicios -P "Ind1c10$" -Q "SELECT 1"
```

### Error: Puerto 3000 ya está en uso

```powershell
# Cambiar el puerto en docker-compose.yml
ports:
  - "3001:3000"  # Usar 3001 en el host
```

### Ver logs detallados del backend

```powershell
docker-compose logs -f --tail=100 dicri-backend
```

### Reconstruir imagen después de cambios

```powershell
# Forzar reconstrucción
docker-compose build --no-cache dicri-backend
docker-compose up -d dicri-backend
```

## 📝 Mantenimiento

### Actualizar la aplicación

```powershell
# 1. Detener el servicio
docker-compose down

# 2. Reconstruir la imagen
docker-compose build

# 3. Iniciar nuevamente
docker-compose up -d

# 4. Verificar logs
docker-compose logs -f dicri-backend
```

### Backup del contenedor

```powershell
# Exportar imagen
docker save dicri-backend:latest -o dicri-backend.tar

# Importar imagen
docker load -i dicri-backend.tar
```

## 🎯 Próximos pasos

1. Configurar nginx como reverse proxy
2. Implementar SSL/TLS con Let's Encrypt
3. Configurar monitoreo (Prometheus + Grafana)
4. Implementar CI/CD pipeline
5. Configurar backup automático de base de datos

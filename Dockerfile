# Usar Node.js LTS como base
FROM node:18-alpine AS builder

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies)
RUN npm ci && npm cache clean --force

# Copiar código fuente
COPY src ./src

# Compilar TypeScript
RUN npx tsc

# Etapa de producción
FROM node:18-alpine

WORKDIR /app

# Copiar solo lo necesario desde builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Cambiar permisos
RUN chown -R nodejs:nodejs /app

# Usar usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 3030

# Variables de entorno por defecto
ENV NODE_ENV=production

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3030/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando de inicio
CMD ["node", "dist/server.js"]

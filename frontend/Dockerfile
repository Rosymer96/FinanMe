# Etapa de construcción
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --no-audit && npm cache clean --force

COPY . .

# Ejecutar build de Angular y forzar la salida en /app/dist
# Pasamos --output-path=dist para evitar que Angular ponga los archivos en dist/<project-name>
RUN npm run build:prod -- --output-path=dist


# Etapa de ejecución
FROM node:22-alpine

# Usar el usuario `node` ya presente en la imagen base (node:22-alpine)

WORKDIR /app

# Copiar artefactos desde la etapa builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Ajustar permisos y cambiar a usuario no-root
RUN chown -R node:node /app || true

USER node

EXPOSE 4200

CMD ["npm", "start"]
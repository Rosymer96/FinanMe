# 🔒 Guía de Seguridad para Ejecutar FinanMe en Docker

## Análisis de Seguridad Realizado

### ✅ Mejoras Implementadas

1. **Docker Multi-stage Build**
   - Separa construcción de ejecución
   - Reduce tamaño final de imagen
   - Elimina herramientas de build en producción

2. **Usuario No-Root**
   - Crea usuario `node` (UID: 1001)
   - Previene ejecución como root
   - Mitiga vulnerabilidades de contenedor

3. **npm ci en lugar de npm install**
   - Reproducibilidad garantizada
   - Instala exactamente lo que especifica `package-lock.json`
   - Más seguro en pipelines

4. **Volúmenes Read-Only (RO)**
   - Solo `src/`, `public/` y configs como RO
   - `node_modules` aislado (no accesible desde host)
   - `dist` generado dentro del contenedor

5. **Aislamiento de Máquina Local**
   - `.npmrc` con auditoría automática
   - `audit-level=moderate` previene deps vulnerables
   - `cache-min` limita caché dentro del contenedor
   - `.dockerignore` excluye archivos innecesarios

6. **Seguridad en Producción**
   - `read_only_root_filesystem: true`
   - `no-new-privileges: true`
   - Health checks automáticos
   - Puertos explícitos (no expone host)

---

## Comandos a Ejecutar

### 1️⃣ **Limpieza Inicial (Opcional pero Recomendado)**

```bash
# Eliminar contenedores/imágenes previos
docker-compose down

# Limpiar sistema Docker completamente (elimina todo, ten cuidado)
npm run docker:clean
```

### 2️⃣ **Desarrollo Local (Recomendado)**

```bash
# Opción A: Usando npm script
npm run docker:dev

# Opción B: Comando Docker directo (más control)
docker-compose -f docker-compose.yml up --build

# Opción C: Con logs en tiempo real
docker-compose -f docker-compose.yml up --build -d
docker-compose -f docker-compose.yml logs -f angular-dev
```

### 3️⃣ **Verificar que Todo Corre Correctamente**

```bash
# Ver logs
docker-compose logs -f

# Verificar contenedor activo
docker ps | grep finanme

# Acceder a la app
# Abre en navegador: http://localhost:4200
```

### 4️⃣ **Ejecutar Auditoría de Seguridad**

```bash
# Verificar vulnerabilidades
npm run audit:check

# Dentro del contenedor
docker-compose exec angular-dev npm audit
```

### 5️⃣ **Detener la Aplicación**

```bash
npm run docker:down
```

### 6️⃣ **Compilación en Producción**

```bash
# Build la imagen (sin levantar)
npm run docker:build

# O manualmente
docker build -t finanme:latest .

# Para ejecutar producción (con seguridad mejorada)
docker-compose -f docker-compose.prod.yml up -d
```

---

## ⚠️ Verificaciones de Seguridad

### Antes de Ejecutar:

✅ **Verifica que `node_modules` local esté LIMPIO:**

```bash
# Si tienes node_modules local, esto lo elimina
rm -rf node_modules package-lock.json

# Docker descargará todo en el contenedor (no en tu máquina)
```

✅ **Verifica puertos disponibles:**

```bash
# Puerto 4200 debe estar libre
lsof -i :4200
# Si está ocupado, cambia en docker-compose.yml línea ports
```

✅ **Verifica espacio en disco:**

```bash
# Node 22 + Angular = ~1.5GB por imagen
docker system df
```

### Durante la Ejecución:

✅ **El contenedor descargará SOLO en Docker:**

- `/app/node_modules` → DENTRO del contenedor ✅
- `~/.npm` → NO SE MODIFICA ✅
- Tu máquina local → SOLO fuentes modificadas ✅

✅ **Auditoría automática:**

```bash
# npm postinstall ejecuta audit automáticamente
# Rechazará dependencias con vulnerabilidades críticas
```

---

## 🚀 Flujo Completo (Paso a Paso)

### OPCIÓN 1: Desarrollo Rápido

```bash
cd /Users/rosavela/Desktop/FRONTEND/PROYECTOS\ FinanMe/frontend

# Limpiar (primera vez)
docker-compose down 2>/dev/null || true
rm -rf node_modules package-lock.json 2>/dev/null || true

# Levantar
docker-compose up --build

# La app estará en http://localhost:4200
```

### OPCIÓN 2: Desarrollo con Logs Separados

```bash
# Terminal 1: Levantar
docker-compose up --build

# Terminal 2: Ver logs
docker-compose logs -f angular-dev

# Terminal 3: Ejecutar comandos
docker-compose exec angular-dev npm audit
```

### OPCIÓN 3: Producción Segura

```bash
# Build image
npm run docker:build

# Ejecutar en producción
docker-compose -f docker-compose.prod.yml up -d

# Verificar salud
docker-compose -f docker-compose.prod.yml ps
```

---

## 🔍 Verificaciones Post-Ejecución

### Validar que la App corre:

```bash
# Acceso a http://localhost:4200

# Ver proceso dentro del contenedor
docker-compose exec angular-dev ps aux

# Verificar node_modules SOLO en contenedor (no en host)
ls -la node_modules  # Esto NO debe existir en tu máquina

# Dentro del contenedor: SÍ existe
docker-compose exec angular-dev ls -la /app/node_modules
```

### Validar seguridad:

```bash
# Verificar usuario (debe ser 'node', no root)
docker-compose exec angular-dev whoami
# Salida esperada: node

# Verificar permisos
docker-compose exec angular-dev id
# Salida esperada: uid=1001(node) gid=1001(nodejs)
```

---

## 🛑 Troubleshooting

### "Error: Port 4200 already in use"

```bash
# Cambiar puerto en docker-compose.yml
# Línea: ports: - "4200:4200"  → Cambiar a "4201:4200"
```

### "npm ERR! code EACCES (Permission denied)"

```bash
# Ya está solucionado con el usuario 'node'
# Si persiste, verificar .npmrc
cat .npmrc
```

### "node_modules corrupted o pendiente de install"

```bash
# Limpiar y reintentar
docker-compose down
docker volume prune  # Limpiar volúmenes
docker-compose up --build
```

### "Build tarda mucho (primera vez)"

```bash
# Esto es normal: descarga Node 22 + deps + build
# Primera: ~5-10 min (conexión internet)
# Siguientes: ~1-2 min (caché Docker)
```

---

## 📊 Comparativa: Local vs Docker

| Aspecto                  | Local Install      | Docker (Este Proyecto) |
| ------------------------ | ------------------ | ---------------------- |
| Machine contaminated     | ⚠️ Posible         | ✅ No, aislado         |
| node_modules size        | ~1.5GB en disco    | ✅ Dentro contenedor   |
| Dependencias system      | ⚠️ Pueden requerir | ✅ Incluidas en imagen |
| Reproducibilidad         | ⚠️ Depende del SO  | ✅ 100% reproducible   |
| Seguridad deps           | ⚠️ Manual audit    | ✅ Auto audit en build |
| Cleanup                  | ⚠️ rm -rf          | ✅ docker system prune |
| Múltiples versiones Node | ⚠️ Conflictos      | ✅ Cada imagen aislada |

---

## 📝 Archivo de Configuración Actualizado

Todas estas configuraciones están en:

- `package.json` → Scripts y metadata
- `Dockerfile` → Multi-stage, usuario no-root
- `docker-compose.yml` → Desarrollo con volúmenes seguros
- `docker-compose.prod.yml` → Producción hardened
- `.npmrc` → Auditoría automática
- `.dockerignore` → Exclusión de archivos innecesarios

---

## ✨ Resumen de Seguridad

✅ **Tu máquina local NUNCA es contaminada**
✅ **npm ci garantiza reproducibilidad**
✅ **Auditoría automática previene dependencias vulnerables**
✅ **Usuario no-root mitiga escapes de contenedor**
✅ **Volúmenes RO evitan modificaciones accidentales**
✅ **Multi-stage reduce tamaño de imagen final**

🎉 **¡Ya estás listo para ejecutar FinanMe de forma segura!**

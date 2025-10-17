# Dockerización de AtomChat Backend

Este documento explica cómo ejecutar el backend de AtomChat usando Docker.

## Prerrequisitos

- Docker instalado en tu sistema
- Docker Compose instalado
- Archivo `firebase-service-account.json` configurado

## Configuración

### 1. Configurar variables de entorno

Copia el archivo de ejemplo y configura las variables:

```bash
cp env.example .env
```

Edita el archivo `.env` con tus valores reales:

```env
NODE_ENV=production
PORT=3000
FIREBASE_PROJECT_ID=nombre-de-proyecto-firebase
GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGIN=http://localhost:4200
```

**IMPORTANTE**: Asegúrate de cambiar los valores por defecto por los valores reales de tu proyecto.

### 2. Verificar archivo de credenciales de Firebase

Asegúrate de que el archivo `firebase-service-account.json` esté presente en el directorio raíz del proyecto.

## Comandos de Docker

### Construir y ejecutar en producción

```bash
# Construir la imagen
docker-compose build

# Ejecutar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener los servicios
docker-compose down
```

### Desarrollo

```bash
# Usar configuración de desarrollo
docker-compose -f docker-compose.dev.yml up --build

# Ejecutar en segundo plano
docker-compose -f docker-compose.dev.yml up -d --build
```

### Comandos útiles

```bash
# Ver el estado de los contenedores
docker-compose ps

# Entrar al contenedor
docker-compose exec atomchat-be sh

# Reconstruir sin caché
docker-compose build --no-cache

# Ver logs en tiempo real
docker-compose logs -f atomchat-be
```

## Verificación

Una vez que el contenedor esté ejecutándose, puedes verificar que funciona correctamente:

```bash
# Verificar el endpoint de salud
curl http://localhost:3000/health

# Debería devolver:
# {"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}
```

## Puertos

- **3000**: Puerto principal de la API
- **4200**: Puerto del frontend (configurado en CORS_ORIGIN)

## Solución de problemas

### El servidor se cierra inmediatamente

Si el contenedor se detiene inmediatamente después de iniciarse:

1. **Verifica las variables de entorno**: Asegúrate de que todas las variables en `.env` estén configuradas correctamente
2. **Verifica el archivo de credenciales**: El archivo `firebase-service-account.json` debe existir y ser válido
3. **Revisa los logs**: Usa `docker-compose logs atomchat-be` para ver los errores específicos
4. **Verifica el build**: Asegúrate de que el proyecto esté compilado con `npm run build`

### Error de permisos de Firebase

Si tienes problemas con las credenciales de Firebase, verifica que:

1. El archivo `firebase-service-account.json` existe
2. Las variables de entorno están configuradas correctamente
3. El archivo de credenciales tiene los permisos correctos

### Error de conexión a la base de datos

Verifica que:

1. Las credenciales de Firebase son correctas
2. El proyecto de Firebase está configurado correctamente
3. Firestore está habilitado en tu proyecto

### Problemas de CORS

Si el frontend no puede conectarse, verifica que:

1. La variable `CORS_ORIGIN` apunta al puerto correcto del frontend
2. El frontend está ejecutándose en el puerto especificado

### Comandos de diagnóstico

```bash
# Ver logs en tiempo real
docker-compose logs -f atomchat-be

# Entrar al contenedor para debuggear
docker-compose exec atomchat-be sh

# Verificar el estado del contenedor
docker-compose ps

# Reconstruir sin caché
docker-compose build --no-cache
```

## Estructura de archivos Docker

- `Dockerfile`: Configuración de la imagen de Docker
- `docker-compose.yml`: Configuración para producción
- `docker-compose.dev.yml`: Configuración para desarrollo
- `.dockerignore`: Archivos a ignorar en el build
- `env.example`: Plantilla de variables de entorno

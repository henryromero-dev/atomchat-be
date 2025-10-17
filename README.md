# AtomChat Backend 

### ¿Qué hace esta aplicación?

Esta aplicación te permite:

- 👥 **Gestionar usuarios**: Crear, editar y eliminar cuentas de usuario
- 📝 **Gestionar tareas**: Crear, actualizar y eliminar tareas
- 🔐 **Autenticación segura**: Los usuarios pueden iniciar sesión de forma segura
- 💬 **Base para un chat**: Proporciona la infraestructura para una aplicación de mensajería

---

## 🚀 Cómo Levantar la Aplicación (3 Métodos)

### Método 1: Con Docker (MÁS FÁCIL - Recomendado)

#### Paso 1: Instalar Docker
1. Ve a [docker.com](https://www.docker.com/products/docker-desktop/)
2. Descarga Docker Desktop para Windows
3. Instálalo y reinicia tu computadora

#### Paso 2: Preparar la aplicación
1. Abre la terminal (cmd o PowerShell) en la carpeta del proyecto
2. Copia el archivo de configuración:
   ```bash
   copy env.example .env
   ```

3. Edita el archivo `.env` con un editor de texto (Notepad) y configura:
   ```
   NODE_ENV=development
   PORT=3000
   FIREBASE_PROJECT_ID=atomchat-be
   GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CORS_ORIGIN=http://localhost:4200
   ```

#### Paso 3: Ejecutar con Docker
```bash
# Construir y ejecutar la aplicación
docker-compose up -d

# Ver si está funcionando
docker-compose logs -f
```

#### Paso 4: Verificar que funciona
Abre tu navegador y ve a: `http://localhost:3000/health`

Deberías ver algo como:
```json
{"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}
```

---

### Método 2: Con Node.js 

#### Paso 1: Instalar Node.js
1. Ve a [nodejs.org](https://nodejs.org/)
2. Descarga la versión LTS (recomendada)
3. Instálala siguiendo las instrucciones

#### Paso 2: Verificar la instalación
Abre la terminal y escribe:
```bash
node --version
npm --version
```
Deberías ver números de versión.

#### Paso 3: Instalar dependencias
En la carpeta del proyecto, ejecuta:
```bash
npm install
```

#### Paso 4: Configurar Firebase
1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Firestore Database
3. Ve a "Configuración del proyecto" > "Cuentas de servicio"
4. Genera una nueva clave privada
5. Guarda el archivo como `firebase-service-account.json` en la carpeta del proyecto

#### Paso 5: Ejecutar la aplicación
```bash
# Modo desarrollo
npm run dev

# O compilar y ejecutar
npm run build
node dist/index.js
```

---

## 🌐 ¿Cómo usar la API?

Una vez que la aplicación esté funcionando, puedes hacer peticiones a estos endpoints:

### Verificar que funciona:
```
GET http://localhost:3000/health
```

### Gestionar usuarios:
```
POST http://localhost:3000/api/users
GET http://localhost:3000/api/users?email=usuario@ejemplo.com
GET http://localhost:3000/api/users/123
```

### Gestionar tareas:
```
GET http://localhost:3000/api/tasks
POST http://localhost:3000/api/tasks
GET http://localhost:3000/api/tasks/123
```

---

## 🛠️ Solución de Problemas

### "No se puede conectar a la base de datos"
- Verifica que el archivo `firebase-service-account.json` existe
- Verifica que las credenciales de Firebase son correctas

### "Puerto 3000 ya está en uso"
- Cambia el puerto en el archivo `.env`: `PORT=3001`
- O detén la aplicación que está usando el puerto 3000

### "Error de permisos"
- En Windows, ejecuta la terminal como administrador
- O verifica que Docker tiene permisos para acceder a la carpeta

### "No encuentra el archivo .env"
- Asegúrate de estar en la carpeta correcta del proyecto
- Crea el archivo `.env` copiando desde `env.example`

---

## 📁 Estructura del Proyecto

```
atomchat-be/
├── src/                    # Código fuente
│   ├── domain/            # Lógica de negocio
│   ├── application/       # Servicios y casos de uso
│   ├── infrastructure/    # Base de datos y servicios externos
│   └── interfaces/        # Controladores HTTP y rutas
├── dist/                  # Código compilado (se genera automáticamente)
├── Dockerfile             # Configuración de Docker
├── docker-compose.yml     # Configuración para producción
├── docker-compose.dev.yml # Configuración para desarrollo
├── package.json           # Dependencias y scripts
└── README.md             # Este archivo
```

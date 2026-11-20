# Arranque local de ATKL

## Estructura actual

- `client/`: frontend con Vite.
- `server/`: backend con Express + Sequelize.
- Vercel se usa para deploy del frontend compilado, no para reemplazar el backend local.

## 1. Instalar dependencias

Desde la raíz del proyecto:

```powershell
pnpm install:client
pnpm install:server
```

También puedes entrar a cada carpeta y ejecutar `pnpm install` manualmente.

El cliente fija `react-router-dom` 5.x en su `pnpm-lock.yaml`. Instálalo siempre
desde `client/` para respetar ese lockfile:

```powershell
pnpm --dir client install --frozen-lockfile
```

Si el build falla con `"useHistory" is not exported`, hay una versión 6/7 de
`react-router-dom` en `client/node_modules`: repite el comando anterior.

## 2. Preparar variables de entorno

Copia `.env.example` a `.env` en la raíz del proyecto y completa los valores:

```bash
cp .env.example .env
```

El backend lee `.env` desde la raíz del proyecto. Las variables obligatorias son:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DB_NAME` | Nombre de la base de datos PostgreSQL | `atkl_records` |
| `DB_USER` | Usuario de PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `tu_password` |
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `PORT` | Puerto del servidor | `3000` |
| `RENDER` | Modo deploy en Render/Vercel | `false` |
| `DB_SSL` | Forzar SSL en PostgreSQL | `false` |
| `SECRET` | Secreto JWT (mínimo 32 caracteres, **obligatorio**) | `tu-secreto-aleatorio` |
| `EMAIL` | Cuenta Gmail para nodemailer | `tu-cuenta@gmail.com` |
| `EMAIL_APP_PASSWORD` | Contraseña de aplicación Gmail | `tu-app-password` |
| `ADMIN_USERNAME` | Usuario admin inicial | `admin` |
| `ADMIN_EMAIL` | Email admin inicial | `admin@example.com` |
| `ADMIN_PASSWORD` | Contraseña admin inicial | `tu-password` |
| `CLOUDINARY_URL` | Credenciales de Cloudinary en una sola cadena, tal como las da el panel | `cloudinary://key:secret@cloud` |

Para Cloudinary alcanza con `CLOUDINARY_URL`. Si preferís las tres sueltas
(`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`), sirven
igual, pero **si están las tres mandan sobre la URL**: tener las dos formas con
valores distintos es la manera más fácil de pelearse con un "Invalid Signature".

Para el frontend, `client/.env`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_CLOUDINARY_CLOUD_NAME=tu-cloud
VITE_CLOUDINARY_UPLOAD_PRESET=tu-preset-unsigned
VITE_CLOUDINARY_FOLDER=tu-carpeta
```

La URL debe terminar en `/api`, que es donde el backend monta las rutas.

Solo las variables con prefijo `VITE_` llegan al navegador: cualquier secreto
va en el `.env` de la raíz, nunca en `client/`.

Archivos de entorno que usa el proyecto, y no más:

| Archivo | Para qué |
|---------|----------|
| `.env` | Backend y base de datos. No se commitea. |
| `.env.example` | Plantilla del anterior. Es el único que sí se commitea. |
| `client/.env` | Variables `VITE_*` en desarrollo. |
| `client/.env.production` | Solo pisa `VITE_API_URL` en el build de producción. |

**Importante:** `SECRET` no tiene valor por defecto. Si no lo defines o usas `change-me`, el servidor no arrancará (ver `server/index.js`).

## 3. Levantar backend

Desde la raíz:

```powershell
pnpm dev:server
```

O manualmente:

```powershell
cd server
pnpm dev
```

Resultado esperado:

- `Database synchronized`
- `Server is running on port 3000`

Si ves `The server does not support SSL connections`, revisa `.env` y confirma:

- `RENDER=false`
- `DB_SSL=false`

## 4. Levantar frontend

Desde la raíz:

```powershell
pnpm dev:client
```

O manualmente:

```powershell
cd client
pnpm dev
```

Resultado esperado:

- Vite levantado en `http://localhost:5173`

## 5. Flujo recomendado

1. Levantar backend.
2. Confirmar que conecta a PostgreSQL.
3. Levantar frontend.
4. Validar login, artistas y releases.

## Comandos útiles desde la raíz

```powershell
pnpm dev:client
pnpm dev:server
pnpm build
pnpm preview
```

## Qué no usar

- No uses `pnpm dev` en la raíz esperando levantar ambos procesos.
- No uses `RENDER=true` con una base local sin SSL.

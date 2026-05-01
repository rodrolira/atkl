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

## 2. Preparar variables de entorno

El backend lee `.env` desde la raíz del proyecto. Para desarrollo local, usa al menos:

```env
DB_NAME=atkl_records
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
PORT=3000
RENDER=false
DB_SSL=false
```

Notas:

- `RENDER=true` activa modo deploy y también fuerza host `0.0.0.0`.
- `DB_SSL=true` fuerza SSL para PostgreSQL.
- Para una base local normal, deja ambos en `false`.
- Si te conectas a una base remota que exige SSL, usa `DB_SSL=true`.

Para el frontend, asegúrate de tener un `client/.env` o `client/.env.local` con algo similar a:

```env
VITE_API_URL=http://localhost:3000
```

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

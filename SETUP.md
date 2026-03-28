# Cómo seguir trabajando en ATKL desde esta laptop

## 1. Restaurar archivos si faltan (carpeta `server/` y otros)

En el estado actual del repo muchas cosas aparecen como "deleted". Si necesitas recuperar la carpeta `server/` y el resto del código:

```powershell
# Restaurar todo lo borrado desde el último commit
git restore .

# O, si prefieres ver qué se restauró antes:
git status
git restore .
```

Si el proyecto lo trajiste por copia (sin clonar) y no tienes el historial de la otra laptop, entonces **no** ejecutes `git restore` y sigue solo con los pasos 2 y 3 usando lo que sí tienes.

---

## 2. Instalar dependencias

Desde la **raíz del proyecto** (`atkl`):

```powershell
cd c:\Users\rlira\Desktop\Rorro\Programacion\atkl

# Instalar pnpm si no lo tienes (el proyecto usa pnpm)
npm install -g pnpm

# Dependencias de la raíz (backend / scripts)
pnpm install

# Dependencias del frontend
cd client
pnpm install
cd ..
```

---

## 3. Variables de entorno

- Ya tienes `.env` y `.env.production` en la raíz (no se suben a git).
- En `client/` también hay `.env`, `.env.development`, `.env.local`, etc.

Si en esta laptop **no** tienes esos archivos (porque no los copiaste), crea al menos:

- **Raíz:** `.env` con lo que use el backend (base de datos, JWT, Cloudinary, etc.). Si tienes en la otra laptop una copia de `.env`, cópiala aquí.
- **client/.env:** variables que use Vite (por ejemplo `VITE_API_URL` u otras que empiecen con `VITE_`).

No subas nunca `.env` a git (ya está en `.gitignore`).

---

## 4. Base de datos (si usas backend con DB)

Si restauraste o tienes la carpeta `server/`:

- Crea la base de datos (PostgreSQL u la que uses) en esta máquina o en un servicio en la nube.
- Ajusta la URL y credenciales en el `.env` de la raíz.
- Si usas migraciones (por ejemplo Sequelize):

  ```powershell
  cd server
  npx sequelize-cli db:migrate
  ```

---

## 5. Ejecutar el proyecto

**Solo frontend (si no tienes backend o no lo necesitas ahora):**

```powershell
cd c:\Users\rlira\Desktop\Rorro\Programacion\atkl\client
pnpm dev
```

Abre en el navegador la URL que muestre Vite (suele ser `http://localhost:5173`).

**Frontend + backend (cuando tengas `server/` y DB listas):**

- En una terminal: desde la raíz, `pnpm start` o `node index.js` (según cómo esté definido en `package.json`).
- En otra terminal: `cd client && pnpm dev`.

---

## Resumen rápido

| Paso | Acción |
|------|--------|
| 1 | `git restore .` si quieres recuperar `server/` y archivos borrados |
| 2 | `pnpm install` en raíz y luego `pnpm install` en `client/` |
| 3 | Revisar/copiar `.env` en raíz y en `client/` |
| 4 | Configurar DB y migraciones si usas backend |
| 5 | `cd client && pnpm dev` para desarrollar el frontend |

Si algo falla (por ejemplo que no exista `index.js` en la raíz), es probable que necesites primero el paso 1 para restaurar los archivos del repo.

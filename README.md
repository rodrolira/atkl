# ATKL Records

Plataforma de gestión de catálogo musical para un sello discográfico independiente.
Permite administrar artistas, lanzamientos (releases), géneros, discografía y usuarios
desde un panel de administración, con una vista pública para explorar el catálogo.

## Estructura del repositorio

```
client/   # Frontend: React 18 + Vite + MUI + Tailwind + Redux Toolkit
server/   # Backend: Express + Sequelize + PostgreSQL
```

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React 18, Vite, MUI, Tailwind CSS, Formik, Yup, i18next, Framer Motion |
| Backend | Express, Sequelize ORM, PostgreSQL |
| Autenticación | JWT (jsonwebtoken) + bcryptjs |
| Archivos | Cloudinary (imágenes), AWS S3 (archivos) |
| Email | Nodemailer (Gmail SMTP) |
| Despliegue | Vercel |

## Cómo ejecutar localmente

Consulta [SETUP.md](./SETUP.md) para la guía completa de instalación, variables de entorno
y comandos de desarrollo.

Resumen rápido:

```bash
# 1. Instalar dependencias
pnpm install:client
pnpm install:server

# 2. Copiar variables de entorno
cp .env.example .env
# Editar .env con tus valores (SECRET es obligatorio)

# 3. Levantar backend (puerto 3000)
pnpm dev:server

# 4. Levantar frontend (puerto 5173)
pnpm dev:client

# 5. Crear admin inicial (opcional, requiere ADMIN_* en .env)
pnpm --dir server seed:admin
```

## Rutas principales del backend

Todas bajo `/api`:

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/auth/register` | Registrar usuario | Público |
| POST | `/auth/login` | Iniciar sesión usuario | Público |
| GET | `/auth/profile` | Perfil de usuario | Usuario |
| POST | `/admin/register` | Registrar admin | Admin |
| POST | `/admin/login` | Iniciar sesión admin | Público |
| GET | `/admin/profile` | Perfil de admin | Admin |
| GET | `/artists` | Listar artistas | Público |
| POST | `/artists` | Crear artista | Admin |
| GET | `/releases` | Listar lanzamientos | Público |
| POST | `/releases` | Crear lanzamiento | Admin |
| GET | `/genres` | Listar géneros | Público |
| POST | `/genres` | Crear género | Admin |
| POST | `/submit-form` | Formulario de contacto | Público |

## Tests

```bash
# Backend (Jest)
npx jest server/test/

# Frontend (Vitest)
pnpm --dir client test
```

## Despliegue

El frontend se despliega en Vercel (`vercel.json` en la raíz y en `client/`).
El backend está configurado para Vercel (`server/vercel.json`) usando `@vercel/node`.

## Licencia

ISC
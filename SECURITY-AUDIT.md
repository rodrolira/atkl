# Auditoría de seguridad — ATKL Records

- **Fecha:** 2026-11-21
- **Alcance:** `/client` (React + Vite), `/server` (Express + Sequelize + Postgres), deploy Render (API) + Vercel (front).
- **Método:** lectura de código + pruebas activas contra un Postgres **efímero local** (puerto 55432, base `atkl_audit`, nunca contra Neon ni producción) con el server en `localhost:3010`. Contra producción (`atkl-api.onrender.com`, `atkl.vercel.app`) solo lecturas no destructivas (cabeceras, CORS).
- **Herramientas:** `gitleaks` 8.21 (historial), escaneo propio de `.env` en el historial, `pnpm audit` (client y server), batería de ataques en Node contra el entorno local, `curl` contra producción.

Severidades: **crítica** (fuga de datos / compromiso), **alta** (bug o vuln seria), **media** (defensa en profundidad), **baja** (estilo / menor).

---

## Resumen

| # | Hallazgo | Severidad | Estado |
|---|----------|-----------|--------|
| 0 | Secretos en el historial de git (JWT SECRET, DB, Cloudinary, Gmail) | **Crítica** | ✅ Historial limpiado (local + remoto). Rotación de secretos pendiente (manual) |
| 1 | El logout no invalidaba el token | **Alta** | ✅ Arreglado |
| 2 | Fuga de errores crudos de Postgres en rutas `/:id` (sin auth) | **Media** | ✅ Arreglado |
| 3 | `X-Powered-By: Express` expuesto | **Baja** | ✅ Arreglado |
| 4 | Mass assignment + lote sin tope en `/api/discography` | **Media** | ✅ Arreglado |
| 5 | Dependencias con CVE altos (sequelize SQLi, cloudinary, axios) | **Alta** | ✅ Arreglado |
| 6 | Token admin en `localStorage` + devuelto en el body | **Media** | Tradeoff aceptado (arquitectura cross-site); mitigado por CSP |
| 7 | Registro público `/api/register` sin uso en el producto | **Baja** | ✅ Arreglado (gateado tras admin) |
| 8 | `nodemailer` con CVE (CRLF/DoS); `proxy-addr` spoofing | **Media/Crítica transitiva** | ✅ Arreglado (nodemailer 10, override proxy-addr); zod documentado |
| 9 | `dangerouslySetInnerHTML` con texto de i18n | **Baja** | Verificado seguro |
| 10 | 500 con mensaje crudo de Sequelize en rutas admin | **Baja** | ✅ Arreglado |

**Verificado SIN problema:** JWT rechaza `alg:none` y secrets débiles/vacíos; subida de archivos valida el contenido real (Cloudinary rechaza SVG con script y PHP disfrazado de `.png`); todas las rutas de escritura montadas están tras `verifyTokenAdmin`; un token `role:admin` sin `adminId` (del login dual de usuario) no abre el panel; sin enumeración de usuarios (mismo mensaje y status); sin prototype pollution por el body; CORS no refleja orígenes arbitrarios; body limitado a 1 MB; paginación acotada (limit máx 100); inyección de operadores de Sequelize por query params no prospera; `app.set('trust proxy', 1)` correcto para Render; admin sembrado **sin contraseña por defecto** (exige `ADMIN_PASSWORD`).

---

## 0. Secretos en el historial de git — CRÍTICA

Confirmado: `.env` con credenciales reales estuvo commiteado. Hoy `.env` está en `.gitignore`, pero **el historial los contenía** (clonar el repo = tener los secretos).

> **✅ Historial limpiado el 2026-11-21.** Se reescribió `master` con `git-filter-repo`
> purgando de todo el historial `.env`, `server/.env`, `client/.env.development`,
> `client/.env.production`, `.vscode/settings.json` y 10 archivos basura
> `*:Zone.Identifier`. Se hizo `push --force` a `origin/master` y se borraron las
> 10 ramas remotas obsoletas que todavía filtraban los `.env` (`sin-db`, `imgbot`,
> `jit-pr-fix`×3, `jit-security-demo`×2, `cursor/*`×2, `fix/sitio-operativo-y-seguridad`).
> Remoto verificado: **0 commits con secretos**. Backup espejo pre-reescritura en
> `../atkl-backup-prehistoryclean.git`.
>
> **La limpieza NO sustituye a la rotación:** GitHub puede cachear commits viejos por
> SHA un tiempo, y quien haya clonado/forkeado antes ya tiene los secretos. **Rotar es
> lo único que de verdad los invalida** — ver checklist abajo (Cloudinary es urgente).

### Secretos expuestos (enmascarados)

| Variable | Valor (enmascarado) | Dónde / commits |
|----------|--------------------|-----------------|
| `SECRET` (JWT) | `pal***` (14 ch) | `server/.env`, `.env` — e902b73, 9f8ed99, 864e9da, bfaf9b2, a307320, 03a9a88, af6e2a3 (2024-09 a 2024-12) |
| JWT firmados | `eyJ***` (242 / 208 ch) | `server/.env` — 9f8ed99, af6e2a3 |
| `DB_PASSWORD` | `iOc***` / `roo***` | `.env`, `server/.env` — misma tanda |
| `PGPASSWORD` | `hFg***` / `XEM***` | `.env`, `server/.env` |
| `DATABASE_URL` / `POSTGRES_URL` | `pos***` (Neon, host `ep-crimson-heart-...neon.tech`, user `atkl_records_owner`) | `.env`, `server/.env` |
| `CLOUDINARY_URL` | `clo***` (66 ch) | `server/.env` |
| `CLOUDINARY_API_SECRET` | `g-U***` (27 ch) | `server/.env` |
| `CLOUDINARY_API_KEY` | `434***` (15 ch) | `server/.env` |
| `AWS_PUBLIC_KEY` / `AWS_SECRET_KEY` | `AKI***` / `GR5***` | `server/.env` (03a9a88) — restos de migración S3 abandonada |
| `VITE_SUPABASE_ANON_KEY` / `_URL` | `eyJ***` (208 ch) / `htt***` | `server/.env` (af6e2a3) — Supabase ya no se usa |

`gitleaks` detectó además 127 coincidencias (incluye claves de datos en `client/src/data/*.ts` y `.vscode/settings.json`).

### ¿Siguen vigentes? (comparación con tu `.env` actual, sin mostrar valores)

| Variable | ¿El valor actual aparece en el historial? |
|----------|-------------------------------------------|
| `SECRET` (JWT) | **No** (lo cambiaste) |
| `DB_PASSWORD` | **No** |
| `DATABASE_URL` | **No** (hoy apunta a otro host Neon, `verceldb`) |
| **`CLOUDINARY_URL`** | **SÍ — el valor actual es el mismo que quedó expuesto** |
| `EMAIL_APP_PASSWORD` | No aparece en el historial escaneado |

→ **La credencial de Cloudinary vigente está comprometida.** El resto ya lo rotaste; igual conviene rotar todo lo que alguna vez estuvo en el historial.

### Checklist de rotación (lo hacés vos en cada panel)

- [ ] **Cloudinary** (URGENTE, sigue vigente): regenerar `API Secret` en Cloudinary → Settings → Security → *Access Keys*. Actualizar `CLOUDINARY_URL` / `CLOUDINARY_API_SECRET` en `.env` local y en Render.
- [ ] **JWT `SECRET`**: generar uno nuevo (`openssl rand -hex 32`). Al cambiarlo **se invalidan todas las sesiones** (justo lo que querés). Actualizar en `.env` y en Render (`sync:false`).
- [ ] **Postgres / Neon**: rotar la contraseña del rol en el panel de Neon (Roles → Reset password) y actualizar `DATABASE_URL` en `.env` y Render. Aunque el valor actual no esté en el historial, el host y el usuario sí se filtraron.
- [ ] **Gmail App Password**: revocar la app password en la Cuenta de Google → Seguridad → Contraseñas de aplicaciones, crear una nueva, actualizar `EMAIL_APP_PASSWORD` en Render.
- [ ] **AWS** (si esas claves existen todavía): desactivarlas en IAM. El proyecto ya no usa S3.
- [ ] **Supabase** (si el proyecto sigue): rotar `anon key` / revisar. Ya no se usa en el código.

### Limpiar el historial — ✅ EJECUTADO el 2026-11-21

Hecho con `git-filter-repo` (script único, sin instalación):

```bash
python git-filter-repo --force --invert-paths \
  --path .env --path server/.env \
  --path client/.env.development --path client/.env.production \
  --path .vscode/settings.json \
  --path-glob '*Zone.Identifier'
git push --force origin master
git push origin --delete sin-db imgbot jit-pr-fix-… cursor/… fix/sitio-operativo-y-seguridad
```

Detalle: se purgaron los 5 archivos con secretos + 10 archivos basura `*:Zone.Identifier`
(metadatos NTFS de Windows que además hacían fallar a `fast-import`). Se borraron las 10
ramas remotas obsoletas que seguían conteniendo los `.env`. Remoto verificado: 0 commits con
secretos. Backup espejo en `../atkl-backup-prehistoryclean.git`.

**Lo que la limpieza NO resuelve (por eso la rotación es obligatoria):**
- Cambió **todos los hashes de commit**. Si trabajás el repo desde otra máquina:
  `git fetch --prune && git reset --hard origin/master` (o re-clonar). No vuelvas a pushear
  desde un clon viejo o reintroducís el historial sucio.
- Quien ya clonó/forkeó **ya tiene los secretos**; la limpieza no los recupera.
- GitHub puede cachear los commits viejos por SHA un tiempo. Si el repo fue público, conviene
  abrir un ticket a GitHub Support para purgar los refs del force-push.
- **Rotar es lo único que invalida los secretos de verdad** (ver checklist arriba).

---

## 1. El logout no invalidaba el token — ALTA ✅

**Reproducción:** login admin → `POST /api/admin/logout` con el Bearer → `GET /api/admin/profile` con el **mismo** token → **200** (seguía válido).

**Causa:** `tokenBlacklist.js` existía pero no estaba cableado. El logout solo hacía `clearCookie`, y como el cliente guarda el JWT en `localStorage` y lo manda por `Authorization`, borrar la cookie no invalidaba nada. El token servía hasta vencer (1 h admin / 12 h user).

**Impacto:** un token robado (o en una máquina compartida) no se podía revocar.

**Fix:** los dos logout (admin y user) ahora llaman `revokeToken(token)`, y `verifyTokenAdmin` + el middleware `authenticate` rechazan los revocados. Verificado end-to-end: tras el logout, `GET /api/admin/profile` → **401**.
**Techo conocido:** la lista es en memoria (un proceso). En Render free hay una sola instancia, así que alcanza; el salto a multi-instancia es Redis (ya anotado en el archivo). Commit `04a5398`.

## 2. Fuga de errores de Postgres en `/:id` — MEDIA ✅

**Reproducción (sin auth):** `GET /api/releases/notanumber` → **500** `{"message":"invalid input syntax for type integer: \"notanumber\""}`. Igual en `/api/artists/1abc`.

**Causa:** ningún `:id` se validaba; el string crudo llegaba a `findByPk`, Postgres devolvía su error de tipo y los controladores lo reenvían con `error.message` directo (sin pasar por el manejador global que sí sanea en producción).

**Impacto:** fuga de información — delata el motor (Postgres), el tipo de columna y ayuda a mapear la base. Sin autenticación.

**Fix:** middleware `validarIdNumerico` en el borde para releases, artists, genres y discography: un `:id` no entero positivo devuelve **400 `id inválido`** antes de tocar la base. Verificado: `GET /api/releases/notanumber` → **400**. Commit `170a84b`.

## 3. `X-Powered-By: Express` — BAJA ✅

**Reproducción:** `curl -I` a la API mostraba `x-powered-by: Express` (confirmado también en producción).
**Fix:** `app.disable('x-powered-by')`. Commit `1f527d2`.

## 4. Mass assignment + lote sin tope en `/api/discography` — MEDIA ✅

**Reproducción (admin):** `POST /api/discography` con `{"id":7777,...}` creaba la fila **con id 7777**. `POST /api/discography/bulk` con 5000 registros → **201** en ~2.8 s (un `create` por registro).

**Causa:** `create`/`update`/`bulk` pasaban `req.body` entero a Sequelize. El `/bulk` hasta armaba un `cleanedTracks` con whitelist pero después insertaba el crudo (whitelist muerta).

**Impacto:** aunque son rutas admin, permite fijar `id`/timestamps (romper integridad) y atar el proceso con un lote enorme (DoS barato).

**Fix:** whitelist `CAMPOS_TRACK` aplicada a create/update/bulk; `/bulk` topado en 500 registros y migrado a `bulkCreate` (un INSERT). Verificado: `id:7777` → id real asignado por la base; lote de 600 → **400**. Commit `2f4c8d0`.

## 5. Dependencias con CVE altos — ALTA ✅

`pnpm audit` inicial: server 1 crítica / 23 altas / 31 moderadas; client 4 críticas / 50 altas (la mayoría del client son devDeps de build/test: vite, vitest, tinypool, rollup, postcss — no viajan al bundle).

**Bumpeado (tests + build en verde):**
- `sequelize` 6.37.5 → **6.37.8** — *SQL injection via JSON column cast type* (alta).
- `cloudinary` 2.5.1 → **2.11.0** — *argument injection* por parámetros con `&` (alta).
- `axios` (cliente) 1.7.9 → **1.21.1** — SSRF, fuga de credenciales en redirect, prototype pollution (altas). Commit `b49f690`.
- `nodemailer` 6.9.16 → **10.6.1** — CRLF/header injection, DoS en addressparser, SMTP command injection. API estable, verificado. Commit siguiente.
- `proxy-addr` → **override `>=2.0.8`** — *IP spoofing via IPv4-mapped IPv6* (crítica transitiva vía express, en el path de `trust proxy`).

Audit del server después: **0 críticas** (de 1), 16 altas (de 23). Lo que queda son transitivas (brace-expansion, minimatch, qs, lodash vía sequelize) que exigirían overrides finos o express 5 (migración mayor) — fuera de alcance, bajo impacto real. Ver #8.

## 6. Token admin en `localStorage` + en el body — MEDIA (tradeoff aceptado)

El login admin devuelve el token en el JSON y el cliente lo guarda en `localStorage` y lo manda por `Authorization`. En teoría un XSS podría leerlo.

**Por qué NO se migra a cookie-only:** el front (`atkl.vercel.app`) y la API (`atkl-api.onrender.com`) están en **sitios distintos**. Una cookie `SameSite=Lax`/`Strict` no viaja en las peticiones XHR cross-site del front a la API, así que la auth por cookie **requeriría `SameSite=None; Secure` + tokens CSRF** — más complejidad y más superficie, no menos. Para un SPA con API en otro dominio, el patrón bearer+`localStorage` es una elección legítima. (De hecho la cookie `httpOnly` que hoy también se setea es prácticamente peso muerto en este esquema cross-site.)

**Mitigante real:** mantener el XSS fuera. La CSP del front es estricta (sin `unsafe-eval`, `object-src 'none'`, `frame-ancestors 'none'`, `script-src 'self'`), que es la defensa que corresponde acá. Se clasifica como **riesgo aceptado** dado el deploy cross-site.

## 7. Registro público `/api/register` — BAJA (documentado)

`POST /api/register` creaba usuarios **sin autenticación** (probado: 201). Las páginas de login/registro de usuario están comentadas en `Routing.tsx`: el producto no tiene auth de usuario final, solo admin. Un `role:'user'` no puede escribir nada (todas las rutas de escritura exigen `role:'admin'` + `adminId`), así que el impacto era **spam de cuentas**, no escalada.

**Fix:** `/api/register` queda detrás de `verifyTokenAdmin`. Sin token → **401**; con token admin → procede. Las cuentas de artista se siguen creando por su flujo propio (`POST /artists`, ya admin). El login de usuario (`/api/login`) queda abierto a propósito (autenticar no es crear). Verificado en vivo.

## 8. `nodemailer` (y `zod`) — MEDIA ✅ (nodemailer) / documentado (zod)

- **`nodemailer` 6.9.16 → 10.6.1 ✅**: limpia CRLF/header injection, DoS en `addressparser`, SMTP command injection, bypass de validación de dominio. La API que usa el proyecto (`createTransport({service:'gmail'}).sendMail` con `from/to/subject/text/html/replyTo`) **no cambia** entre v6 y v10; verificado que el módulo carga, que `createTransport`/`sendMail` existen, y que los formularios de contacto/demo responden sin romper (500 controlado sin SMTP real, igual que antes).
- **`zod` 3.23.8** (sin cambiar): el fix de DoS por colecciones grandes es de la rama **4.x** (major con cambios de API: `errorMap`, parse). `demo-form.routes.js` usa `errorMap`/`coerce`/`preprocess`/`refine`, que cambian en v4, así que el bump es un refactor con riesgo real. **Explotabilidad baja hoy:** body limitado a 1 MB, todos los campos con `max()`, y rate limit 3–5/h. **Recomendación:** migrar a zod 4 en una rama aparte con los tests del formulario.

## 9. `dangerouslySetInnerHTML` — BAJA (verificado seguro)

`AboutSection.tsx` y `AboutPage.jsx` usan `dangerouslySetInnerHTML={{ __html: t('aboutSection.text') }}`. El contenido viene de los **archivos de i18n** (`locales/*.json`), no de entrada de usuario ni de la base. Sin superficie de XSS mientras las traducciones sigan siendo estáticas del repo. Los links de artistas/releases sí pasan por `safeExternalUrl` (rechaza `javascript:`/`data:`), correcto.

## 10. 500 con mensaje de Sequelize en rutas admin — BAJA ✅

Varios controladores (releases, artists, discography) respondían los 500 con `error.message` directo, sin pasar por el manejador global que sanea en producción. Ejemplo: crear un release sin `release_type` → `notNull Violation: Release.release_type cannot be null`. Rutas autenticadas (solo el admin), por eso es baja, pero igual delata esquema/motor.

**Fix:** helper `mensajeSeguro(error)` — en producción generaliza los **5xx** a `Internal server error`; los **4xx** (mensajes para el usuario) y el modo desarrollo pasan tal cual. Aplicado a los controladores de releases/artists y a las rutas de discography. Verificado en vivo con `NODE_ENV=production`: el mismo 500 ahora devuelve `{"message":"Internal server error"}`.

---

## Notas de las pruebas

- SSRF en `scripts/importar-bandcamp.js`: la URL del sello está **hardcodeada** (`atklrecords.bandcamp.com`), no viene de entrada de usuario, y es un script de CLI, no un endpoint. Sin superficie SSRF.
- `app.set('trust proxy', 1)`: correcto para Render (un hop de proxy). En el test local **sin** proxy, rotar `X-Forwarded-For` evadía el rate limit — pero eso es porque localmente no hay proxy que sobrescriba el header; en Render el proxy pone la IP real como último hop y `trust proxy:1` la toma, así que el spoofing no aplica en producción.
- `/api/team`: las rutas existían (`team.routes.js`) pero **no estaban montadas** en `app.js`, y el controlador usaba `prisma` (que no existe en el proyecto). Código muerto y roto — **eliminado** (`team.routes.js` + `team_member.controller.js`). El modelo `teammember.model.js` se mantiene (sigue importado en `models/index.js`).
- `*:Zone.Identifier`: se encontraron 10 archivos basura de NTFS (mark-of-the-web de Windows) en el historial que además bloqueaban `fast-import`. Purgados del historial y bloqueados en `.gitignore`.

## Verificación final

- `npx jest` (server): **99 tests, 15 suites — verde** (se sumaron tests para cada fix).
- `pnpm build` (client): **OK**.
- `pnpm lint` (client): **0 errores** (6 warnings preexistentes).
- `pnpm exec vitest run` (client): **50 tests — verde**.
- Smoke E2E contra la base de auditoría (incluye `NODE_ENV=production`): login admin, CRUD de artistas y releases, sanitización de 500, gating de `/api/register`, validación de los formularios de contacto y demo — **OK**.

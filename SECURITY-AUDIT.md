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
| 0 | Secretos en el historial de git (JWT SECRET, DB, Cloudinary, Gmail) | **Crítica** | Rotación pendiente (manual) + limpieza de historial pendiente de tu OK |
| 1 | El logout no invalidaba el token | **Alta** | ✅ Arreglado |
| 2 | Fuga de errores crudos de Postgres en rutas `/:id` (sin auth) | **Media** | ✅ Arreglado |
| 3 | `X-Powered-By: Express` expuesto | **Baja** | ✅ Arreglado |
| 4 | Mass assignment + lote sin tope en `/api/discography` | **Media** | ✅ Arreglado |
| 5 | Dependencias con CVE altos (sequelize SQLi, cloudinary, axios) | **Alta** | ✅ Parcial (lo seguro bumpeado; nodemailer/zod documentados) |
| 6 | Token admin en `localStorage` + devuelto en el body | **Media** | Documentado (no arreglado: refactor de cliente) |
| 7 | Registro público `/api/register` sin uso en el producto | **Baja** | Documentado |
| 8 | `nodemailer`/`zod` con CVE pendientes (salto de major) | **Media** | Documentado |
| 9 | `dangerouslySetInnerHTML` con texto de i18n | **Baja** | Verificado seguro |
| 10 | 500 con mensaje crudo de Sequelize en rutas admin | **Baja** | Documentado |

**Verificado SIN problema:** JWT rechaza `alg:none` y secrets débiles/vacíos; subida de archivos valida el contenido real (Cloudinary rechaza SVG con script y PHP disfrazado de `.png`); todas las rutas de escritura montadas están tras `verifyTokenAdmin`; un token `role:admin` sin `adminId` (del login dual de usuario) no abre el panel; sin enumeración de usuarios (mismo mensaje y status); sin prototype pollution por el body; CORS no refleja orígenes arbitrarios; body limitado a 1 MB; paginación acotada (limit máx 100); inyección de operadores de Sequelize por query params no prospera; `app.set('trust proxy', 1)` correcto para Render; admin sembrado **sin contraseña por defecto** (exige `ADMIN_PASSWORD`).

---

## 0. Secretos en el historial de git — CRÍTICA

Confirmado: `.env` con credenciales reales estuvo commiteado. Hoy `.env` está en `.gitignore`, pero **el historial sigue conteniéndolos** (clonar el repo = tener los secretos).

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

### Limpiar el historial — opciones (NO ejecutadas, requieren tu OK)

Rotar invalida los secretos; limpiar el historial además los **borra del repo**. Dos caminos:

1. **`git filter-repo`** (recomendado por el equipo de git):
   `git filter-repo --path server/.env --path .env --path client/.env.development --path client/.env.production --invert-paths`
   Reescribe todos los commits quitando esos archivos.
2. **BFG Repo-Cleaner** (más simple para “borrar archivos/strings”):
   `bfg --delete-files .env` o `bfg --replace-text secretos.txt`.

**Riesgos (los dos reescriben el historial):**
- Cambian **todos los hashes de commit** → hay que `git push --force`. Cualquier clon/fork/PR abierto queda desincronizado.
- Si alguien ya clonó el repo, **ya tiene los secretos**: la limpieza no los recupera. Por eso **rotar es lo que de verdad protege**; limpiar es higiene.
- En GitHub, los commits viejos pueden seguir cacheados un tiempo; conviene abrir un ticket a soporte si era público.
- Hacé un backup (`git clone --mirror`) antes.

**Recomendación:** primero rotá (sobre todo Cloudinary). La limpieza del historial, cuando quieras, con `git filter-repo` y `--force` coordinado. Decime y lo preparo.

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

## 5. Dependencias con CVE altos — ALTA ✅ (parcial)

`pnpm audit`: server 1 crítica / 23 altas / 31 moderadas; client 4 críticas / 50 altas (la mayoría del client son devDeps de build/test: vite, vitest, tinypool, rollup, postcss — no viajan al bundle).

**Bumpeado (seguro, mismo major, tests + build en verde):**
- `sequelize` 6.37.5 → **6.37.8** — *SQL injection via JSON column cast type* (alta).
- `cloudinary` 2.5.1 → **2.11.0** — *argument injection* por parámetros con `&` (alta).
- `axios` (cliente) 1.7.9 → **1.21.1** — SSRF, fuga de credenciales en redirect, prototype pollution (altas).

Commit `b49f690`. Ver #8 para lo pendiente.

## 6. Token admin en `localStorage` + en el body — MEDIA (documentado)

El login admin setea una cookie `httpOnly` (bien) **pero además devuelve el token en el JSON**, y el cliente lo guarda en `localStorage` y lo manda por `Authorization`. Eso anula la protección de la cookie `httpOnly`: **un XSS puede leer el token**.

No se arregló porque es un cambio arquitectónico del cliente (pasar a auth solo-cookie exige reescribir `AdminAuthContext`/`axios` y **sumar protección CSRF**, que hoy no hace falta porque no se usan cookies para autorizar). Mitigante actual: la CSP del front es estricta (sin `unsafe-eval`, `object-src 'none'`, `frame-ancestors 'none'`), lo que reduce la superficie de XSS. **Recomendación:** migrar a auth por cookie `httpOnly` + `SameSite=Strict` + token CSRF, y dejar de devolver el token en el body.

## 7. Registro público `/api/register` — BAJA (documentado)

`POST /api/register` crea usuarios sin autenticación (probado: **201**). Las páginas de login/registro de usuario están **comentadas** en `Routing.tsx`: el producto no tiene auth de usuario final, solo admin. Un `role:'user'` no puede escribir nada (todas las rutas de escritura exigen `role:'admin'` + `adminId`), así que el impacto es **spam de cuentas**, no escalada. **Recomendación:** si no vas a tener login de usuarios, sacá `/api/register`, `/api/login` (user) y `/api/profile` para reducir superficie.

## 8. `nodemailer` / `zod` con CVE pendientes — MEDIA (documentado)

- **`nodemailer` 6.9.16**: limpiar todos los CVE (CRLF en headers, DoS en `addressparser`, etc.) exige **≥10.1.4**, un salto de 4 majors. La API que usamos (`createTransport({service:'gmail'}).sendMail`) es estable, pero **no es verificable sin credenciales reales de Gmail**, así que no lo bumpeé a ciegas.
- **`zod` 3.23.8**: el fix de DoS por colecciones grandes es de la rama 4.x (major con cambios de API). 

**Por qué el riesgo es bajo hoy:** el body está limitado a **1 MB**, los campos que entran a los correos están **saneados de CRLF** y validados con Zod (`max()` en todos), y los endpoints de correo tienen rate limit (3–5/h). **Recomendación:** planificar el bump de `nodemailer` a 10.x probando el envío real de contacto/demo con las credenciales de Gmail, en una rama aparte.

## 9. `dangerouslySetInnerHTML` — BAJA (verificado seguro)

`AboutSection.tsx` y `AboutPage.jsx` usan `dangerouslySetInnerHTML={{ __html: t('aboutSection.text') }}`. El contenido viene de los **archivos de i18n** (`locales/*.json`), no de entrada de usuario ni de la base. Sin superficie de XSS mientras las traducciones sigan siendo estáticas del repo. Los links de artistas/releases sí pasan por `safeExternalUrl` (rechaza `javascript:`/`data:`), correcto.

## 10. 500 con mensaje de Sequelize en rutas admin — BAJA (documentado)

Varios controladores (releases, discography) responden los 500 con `error.message` directo, sin pasar por el manejador global que sanea en producción. Ejemplo: crear un release sin `release_type` → `notNull Violation: Release.release_type cannot be null`. Son rutas **autenticadas** (solo el admin lo ve), por eso es baja. **Recomendación (defensa en profundidad):** que los controladores deriven los 500 a `next(error)` para que el manejador global los sanee en prod.

---

## Notas de las pruebas

- SSRF en `scripts/importar-bandcamp.js`: la URL del sello está **hardcodeada** (`atklrecords.bandcamp.com`), no viene de entrada de usuario, y es un script de CLI, no un endpoint. Sin superficie SSRF.
- `app.set('trust proxy', 1)`: correcto para Render (un hop de proxy). En el test local **sin** proxy, rotar `X-Forwarded-For` evadía el rate limit — pero eso es porque localmente no hay proxy que sobrescriba el header; en Render el proxy pone la IP real como último hop y `trust proxy:1` la toma, así que el spoofing no aplica en producción.
- `/api/team`: las rutas existen (`team.routes.js`) pero **no están montadas** en `app.js`, y su controlador usa `prisma` (que no existe en el proyecto). Es código muerto, no una vulnerabilidad. Recomendación: borrarlo o cablearlo bien.

## Verificación final

- `npx jest` (server): **93 tests, 13 suites — verde** (se sumaron tests para cada fix).
- `pnpm build` (client): **OK**.
- `pnpm lint` (client): **0 errores** (6 warnings preexistentes).
- `pnpm exec vitest run` (client): **50 tests — verde**.
- Smoke E2E contra la base de auditoría: login admin, CRUD de artistas y releases, validación de los formularios de contacto y demo — **OK**.

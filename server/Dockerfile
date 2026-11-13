# node:13 llegaba a fin de vida en 2020 y no puede correr este servidor: los
# scripts usan top-level await (Node 14.8+) y fetch global (Node 18+).
FROM node:22-alpine

WORKDIR /usr/src/app

# El proyecto usa pnpm y tiene pnpm-lock.yaml; con `npm install` se resolvía un
# árbol distinto del fijado en el lockfile.
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY . .

# Render inyecta PORT; 3000 es solo el valor por defecto local.
EXPOSE 3000
CMD ["node", "index.js"]

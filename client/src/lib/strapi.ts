const VITE_STRAPI_HOST = import.meta.env.VITE_STRAPI_HOST;
const VITE_STRAPI_TOKEN = import.meta.env.VITE_STRAPI_TOKEN;

if (!VITE_STRAPI_HOST || !VITE_STRAPI_TOKEN) {
    throw new Error("No se encontró el token de autorización");
}


export function query (url: string) {
    return fetch(`${VITE_STRAPI_HOST}/api/${url}`, {
        headers: {
            Authorization: `Bearer ${VITE_STRAPI_TOKEN}`,
        },
    }).then((res) => res.json());
}
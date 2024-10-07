import { query } from "./strapi";

const {VITE_STRAPI_HOST} = import.meta.env
export function getHomeInfo() {
    return query('home')
    .then(res => {
        const {title, description} = res.data
        return {title, description}
    })
}
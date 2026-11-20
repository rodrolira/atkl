/**
 * Links del navbar, de escritorio y móvil.
 *
 * Todo `to` que empiece con `/#` se trata como sección del Home: NavItem y el
 * menú móvil scrollean hasta el id en vez de navegar, y desde otra ruta
 * Home.tsx scrollea al llegar. El `id` es el de la <section> y además la clave
 * de la traducción (`navbar.<id>`).
 *
 * Artists, Releases y About tienen página propia además de sección. El navbar
 * manda a la sección: son el recorrido de la home, no destinos aparte. Las
 * páginas siguen existiendo y se llegan desde los títulos de cada sección.
 */
const links = [
  {
    to: '/',
    id: 'home',
    authRequired: false,
  },
  {
    to: '/#artists',
    id: 'artists',
    authRequired: false,
  },
  {
    to: '/#releases',
    id: 'releases',
    authRequired: false,
  },
  {
    to: '/#about',
    id: 'about',
    authRequired: false,
  },
  {
    to: '/#demo',
    id: 'demo',
    authRequired: false,
  },
  {
    to: '/#contact',
    id: 'contact',
    authRequired: false,
  },
];

export default links;

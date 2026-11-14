import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resuelve qué ítem del navbar está activo.
 *
 * El menú mezcla dos tipos de destino y por eso no alcanza con NavLink:
 * - páginas reales (/artists, /releases, /about) → las resuelve la ruta
 * - anclas del Home (/#demo, /#contact) → no cambian de ruta, así que se
 *   siguen por el hash y, al hacer scroll, por IntersectionObserver
 *
 * Devuelve el id (no la URL) porque es lo que usan ambos menús para comparar.
 */

/** Ids que son secciones dentro del Home, no páginas propias. */
const SECCIONES_DEL_HOME = ['demo', 'contact'] as const;

export const useActiveNavItem = (): string => {
  const location = useLocation();
  const [seccionVisible, setSeccionVisible] = useState<string | null>(null);

  const enHome = location.pathname === '/';

  // El hash manda apenas se hace clic; el observer lo corrige al scrollear.
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) setSeccionVisible(hash);
  }, [location.hash]);

  useEffect(() => {
    if (!enHome) {
      setSeccionVisible(null);
      return;
    }

    const nodos = SECCIONES_DEL_HOME.map((id) => document.getElementById(id)).filter(
      (n): n is HTMLElement => n !== null
    );
    if (!nodos.length) return;

    const observer = new IntersectionObserver(
      (entradas) => {
        // De las secciones visibles gana la que más área ocupa, para que al
        // quedar dos a medias no parpadee el activo.
        const visible = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setSeccionVisible(visible.target.id);
        } else if (window.scrollY < 120) {
          // Arriba del todo no hay sección: el activo vuelve a ser Home.
          setSeccionVisible(null);
        }
      },
      // El margen superior descuenta el navbar fijo, que si no tapa la sección
      // y la marca como visible antes de tiempo.
      { rootMargin: '-96px 0px -45% 0px', threshold: [0.1, 0.5, 0.9] }
    );

    nodos.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [enHome]);

  if (enHome) return seccionVisible ?? 'home';

  const porRuta = location.pathname.split('/')[1];
  return porRuta || 'home';
};

export default useActiveNavItem;

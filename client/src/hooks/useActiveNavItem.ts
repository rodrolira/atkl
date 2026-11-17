import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resuelve qué ítem del navbar está activo.
 *
 * No alcanza con NavLink porque dentro del Home no cambia la ruta:
 * - fuera del Home → lo resuelve el pathname (/artists marca Artists)
 * - dentro del Home → todas las entradas del menú tienen su sección, y el
 *   activo lo sigue el scroll por IntersectionObserver. El hash manda apenas
 *   se hace clic y el observer lo corrige al llegar.
 *
 * Devuelve el id (no la URL) porque es lo que usan ambos menús, el de
 * escritorio y el móvil, para comparar.
 */

/**
 * Ids de las secciones del Home, en el orden en que aparecen.
 *
 * Coinciden con el `id` de cada <section> y con el id del link del navbar.
 * `artists`, `releases` y `about` además tienen página propia: desde otra ruta
 * el activo lo decide el pathname, pero dentro del Home son secciones y el
 * subrayado tiene que seguirlas al scrollear, igual que demo y contact.
 *
 * El hero no entra: cuando ninguna sección cruza la banda, el activo es Home.
 */
const SECCIONES_DEL_HOME = ['artists', 'releases', 'about', 'demo', 'contact'] as const;

/**
 * De las secciones que cruzan la banda de detección gana la que ocupa más
 * alto dentro de ella.
 *
 * Se mide en píxeles y no con `intersectionRatio` porque el ratio es la
 * fracción visible *de la sección*: una sección corta que entra entera da 1,
 * y una larga que entra a medias da 0,25, así que la corta ganaba aunque
 * ocupara menos pantalla. Con demo y contact, de alto parecido, no se notaba;
 * con releases o artists, que son mucho más altas, sí.
 */
/**
 * Vuelca en `altoVisible` las entradas que informó el observer.
 *
 * Muta el Map a propósito: es el registro acumulado entre llamadas. El
 * observer solo informa las secciones que *cambiaron* de estado, así que una
 * lista parcial no puede tratarse como la foto completa; si no se acumula, la
 * sección que sigue ocupando la pantalla sin haber cambiado desaparece.
 */
export const registrarEntradas = (
  altoVisible: Map<string, number>,
  entradas: Pick<IntersectionObserverEntry, 'isIntersecting' | 'intersectionRect' | 'target'>[]
): void => {
  entradas.forEach((e) => {
    if (e.isIntersecting) altoVisible.set(e.target.id, e.intersectionRect.height);
    else altoVisible.delete(e.target.id);
  });
};

export const seccionDominante = (altoVisible: Map<string, number>): string | null => {
  let ganadora: string | null = null;
  let maximo = 0;

  altoVisible.forEach((alto, id) => {
    if (alto > maximo) {
      maximo = alto;
      ganadora = id;
    }
  });

  return ganadora;
};

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

    // Alto visible de cada sección dentro de la banda, acumulado entre
    // llamadas: el observer solo informa las secciones que cambiaron de
    // estado, no todas. Leer solo `entradas` hacía perder de vista a la
    // sección que seguía ocupando la pantalla sin haber cambiado.
    const altoVisible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entradas) => {
        registrarEntradas(altoVisible, entradas);
        // Sin ninguna sección en la banda estamos en el hero: vuelve Home.
        setSeccionVisible(seccionDominante(altoVisible));
      },
      {
        // Banda de detección, no el viewport entero: desde abajo del navbar
        // fijo (96px) hasta el 40% del alto de pantalla. La sección activa es
        // la que cruza esa franja, que es como se lee "en qué parte estoy".
        //
        // Con el viewport completo, secciones altas como releases quedaban
        // intersectando a la vez que la siguiente y el activo dependía de
        // cuál había cambiado último.
        rootMargin: '-96px 0px -60% 0px',
        // 0 alcanza: con la banda angosta lo que importa es si la sección la
        // toca o no. Pedir fracciones altas no servía porque una sección más
        // alta que la pantalla nunca llega a estar visible en un 50%.
        threshold: 0,
      }
    );

    nodos.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [enHome]);

  if (enHome) return seccionVisible ?? 'home';

  const porRuta = location.pathname.split('/')[1];
  return porRuta || 'home';
};

export default useActiveNavItem;

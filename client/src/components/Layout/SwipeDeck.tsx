import React, { useCallback, useEffect, useRef, useState } from 'react';

interface SwipeDeckProps {
  children: React.ReactNode;
  /** Etiqueta de la región desplazable, para lector de pantalla. */
  label: string;
  /**
   * Tarjetas visibles por pantalla en móvil.
   * 1 deja asomar la siguiente, que es lo que avisa que hay más sin necesidad
   * de un cartel de "deslizá".
   */
  perView?: 1 | 2;
  /** Total de ítems, para el contador. Evita contar children en runtime. */
  total: number;
}

/**
 * Carrusel de una fila para móvil que en escritorio vuelve a ser grilla.
 *
 * El desplazamiento es `scroll-snap` nativo: da inercia táctil, funciona sin
 * JS, respeta el zoom y es navegable con teclado. Una librería de carrusel acá
 * sería ~40kB para reimplementar peor lo que el navegador ya hace.
 *
 * Móvil y escritorio comparten UN solo DOM y cambian de layout por CSS. Si se
 * renderizara el carrusel y la grilla por separado, el catálogo montaría los
 * iframes de Bandcamp dos veces.
 *
 * El indicador es un contador de catálogo con barra de posición, no puntitos:
 * con 13 artistas serían 13 puntos de 8px, ilegibles e imposibles de apuntar.
 */
const SwipeDeck: React.FC<SwipeDeckProps> = ({ children, label, perView = 1, total }) => {
  const pistaRef = useRef<HTMLUListElement>(null);
  const [indice, setIndice] = useState(0);
  const [progreso, setProgreso] = useState(0);
  const [esDesplazable, setEsDesplazable] = useState(false);

  const medir = useCallback(() => {
    const pista = pistaRef.current;
    if (!pista) return;

    const maximo = pista.scrollWidth - pista.clientWidth;
    // En escritorio es grilla: no hay desplazamiento y el indicador sobra.
    if (maximo <= 1) {
      setEsDesplazable(false);
      setProgreso(0);
      setIndice(0);
      return;
    }
    setEsDesplazable(true);
    setProgreso(pista.scrollLeft / maximo);

    // El paso se mide de los hijos reales en vez de calcularlo del ancho: así
    // sobrevive a cambios de gap o de breakpoint sin quedar desincronizado.
    const items = pista.children;
    const paso =
      items.length > 1
        ? (items[1] as HTMLElement).offsetLeft - (items[0] as HTMLElement).offsetLeft
        : pista.clientWidth;
    setIndice(Math.min(total - 1, Math.round(pista.scrollLeft / Math.max(paso, 1))));
  }, [total]);

  useEffect(() => {
    const pista = pistaRef.current;
    if (!pista) return;

    let pendiente = false;
    const onScroll = () => {
      // rAF para no medir una vez por evento de scroll, que en táctil son
      // muchos por segundo y cada medición fuerza layout.
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        pendiente = false;
        medir();
      });
    };

    medir();
    pista.addEventListener('scroll', onScroll, { passive: true });

    // El layout cambia entre grilla y carrusel por breakpoint, y las tarjetas
    // crecen cuando cargan las imágenes.
    const ro = new ResizeObserver(onScroll);
    ro.observe(pista);

    return () => {
      pista.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, [medir]);

  const anchoItem =
    perView === 2
      ? 'basis-[calc((100%-0.75rem)/2)]'
      : 'basis-[84%] xs:basis-[78%]';

  return (
    <div className="relative">
      {/* El indicador va ARRIBA de la pista, no abajo: la tarjeta de release
          mide 933px contra un viewport de 768, así que abajo quedaba siempre
          fuera de pantalla. Arriba se lee como cabecera de catálogo. */}
      {esDesplazable && (
        <div className="mb-3 flex items-center gap-3 md:hidden" aria-hidden="true">
          {/* Barra de posición, tipo indicador de cue. El rojo macizo se usa
              acá y en el marcador del menú móvil, en ningún otro lado. */}
          <div className="h-[2px] flex-1 bg-muted/25">
            <div
              className="h-full bg-accent transition-[width] duration-150 ease-out
                motion-reduce:transition-none"
              style={{ width: `${Math.max(8, progreso * 100)}%` }}
            />
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
            {String(indice + 1).padStart(2, '0')}
            <span className="text-muted/50"> / </span>
            {String(total).padStart(2, '0')}
          </span>
        </div>
      )}

      <ul
        ref={pistaRef}
        // Una región desplazable tiene que poder recibir foco, o con teclado
        // no hay forma de moverla.
        tabIndex={esDesplazable ? 0 : -1}
        role={esDesplazable ? 'region' : undefined}
        aria-label={esDesplazable ? label : undefined}
        className={`m-0 flex list-none snap-x snap-mandatory gap-3 overflow-x-auto p-0 pb-1
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4
          focus-visible:outline-accent
          md:grid md:auto-rows-fr md:grid-cols-2 md:gap-4 md:overflow-visible lg:grid-cols-3`}
      >
        {React.Children.map(children, (hijo, i) => (
          <li
            key={i}
            // snap-start + shrink-0 solo importan en móvil; desde md la grilla
            // los ignora y la tarjeta vuelve a ocupar su celda.
            // h-full para que la tarjeta ocupe toda la celda: con auto-rows-fr
            // todas las filas miden lo mismo, pero sin esto la tarjeta se queda
            // en su alto natural y la grilla vuelve a verse despareja.
            className={`${anchoItem} h-full shrink-0 snap-start md:basis-auto md:shrink`}
          >
            {hijo}
          </li>
        ))}
      </ul>

    </div>
  );
};

export default React.memo(SwipeDeck);

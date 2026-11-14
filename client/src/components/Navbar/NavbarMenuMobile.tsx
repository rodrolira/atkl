import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import LanguageMenu from '@/components/Language/LanguageMenu';
import links from '@/utils/navbarLinks';
import useActiveNavItem from '@/hooks/useActiveNavItem';

/**
 * Menú de navegación para móvil: panel a pantalla completa.
 *
 * La dirección visual sale del manual de marca del sello, que usa registro de
 * catálogo (CAT. 001, tipografía monoespaciada de apoyo). El panel se lee como
 * la grilla de un flyer: ítems grandes alineados a la izquierda y un prefijo
 * monoespaciado que codifica a dónde va cada uno — '/' si es una página y '#'
 * si es una sección del Home. No es adorno: dice si el ítem navega o scrollea.
 *
 * El ítem activo lleva una barra roja sólida, tipo marcador de cue. Es el único
 * lugar donde el rojo va macizo.
 */
const NavbarMenuMobile: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const activeId = useActiveNavItem();

  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const botonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  // Bloqueo del scroll del body. Se guarda el valor previo en vez de asumir
  // 'auto', para no pisar un overflow que venga de otro lado.
  useEffect(() => {
    if (!isOpen) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previo;
    };
  }, [isOpen]);

  // Escape para cerrar + trampa de foco: con el panel abierto, Tab no debe
  // poder salir a los elementos de atrás.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        botonRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;

      const primero = focusables[0];
      const ultimo = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  // `inert` saca el panel cerrado del foco y del lector de pantalla. Va por ref
  // porque los tipos de React 18 todavía no lo declaran como prop.
  //
  // Quitar el inert y mover el foco tienen que pasar en ESTE orden y en el
  // mismo efecto: separados en dos, React corre primero el declarado antes, y
  // el foco caía sobre un panel que todavía era inerte, así que se perdía.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (!isOpen) {
      panel.setAttribute('inert', '');
      return;
    }

    panel.removeAttribute('inert');
    panel.querySelector<HTMLElement>('a, button')?.focus();
  }, [isOpen]);

  // Cerrar al navegar: sin esto el panel queda abierto sobre la página nueva.
  useEffect(() => {
    close();
  }, [location.pathname, location.hash, close]);

  const handleItemClick = (id: string, to: string) => {
    close();
    const esSeccion = to.startsWith('/#');

    if (esSeccion && location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      // El hash queda en la URL para que el ítem activo sobreviva a un refresh.
      navigate(to, { replace: true });
      return;
    }
    navigate(to);
  };

  return (
    <div className="flex items-center gap-1">
      <LanguageMenu />

      <button
        ref={botonRef}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={isOpen ? t('close_menu') : t('open_menu')}
        className="relative z-[1100] inline-flex min-h-11 min-w-11 items-center justify-center
          rounded-md border border-muted/40 text-text
          transition-colors duration-200
          hover:border-accent hover:text-accent
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
          focus-visible:outline-accent"
      >
        {/* Hamburguesa dibujada con tres barras: la del medio se desvanece y
            las otras dos cruzan. Evita cargar dos iconos de MUI solo para esto. */}
        <span className="relative block h-4 w-6" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`absolute left-0 block h-[2px] w-full bg-current
                transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]
                motion-reduce:transition-none
                ${i === 0 ? (isOpen ? 'top-[7px] rotate-45' : 'top-0') : ''}
                ${i === 1 ? (isOpen ? 'top-[7px] opacity-0' : 'top-[7px]') : ''}
                ${i === 2 ? (isOpen ? 'top-[7px] -rotate-45' : 'top-[14px]') : ''}`}
            />
          ))}
        </span>
      </button>

      {/* Panel a pantalla completa. Se mantiene montado para poder animar la
          salida; inert + invisible lo sacan del foco y del lector cuando cierra. */}
      <div
        id={panelId}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('navbar.menu') ?? 'Menu'}
        // Cerrado va con opacity-0 + pointer-events-none y NO con `invisible`:
        // visibility:hidden impide enfocar, y el foco se mueve al panel en el
        // mismo tick en que se abre, antes de que termine la transición.
        // Sacarlo del foco y del lector ya lo hace `inert`.
        className={`fixed inset-0 z-[1050] flex flex-col bg-bg
          transition-opacity duration-300 ease-[cubic-bezier(0.2,0,0,1)]
          motion-reduce:transition-none
          ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        {/* Deja respirar el navbar fijo que queda por encima. */}
        <nav className="flex flex-1 flex-col justify-center px-6 pt-20">
          <ul className="flex flex-col">
            {links.map((link, i) => {
              const activo = activeId === link.id;
              const esSeccion = link.to.startsWith('/#');
              return (
                <li key={link.id} className="border-b border-muted/15 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => handleItemClick(link.id, link.to)}
                    aria-current={activo ? 'page' : undefined}
                    style={{
                      // Entrada escalonada, como una cuenta de cuatro. El retardo
                      // depende del índice, por eso va inline y no en una clase.
                      transitionDelay: isOpen ? `${80 + i * 45}ms` : '0ms',
                    }}
                    className={`group flex w-full min-h-[56px] items-center gap-4 py-3 text-left
                      transition-[transform,opacity,color] duration-500
                      ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                      focus-visible:outline-accent
                      ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'}
                      ${activo ? 'text-accent' : 'text-text hover:text-accent'}`}
                  >
                    {/* Marcador de cue: el único rojo macizo del panel. */}
                    <span
                      aria-hidden="true"
                      className={`block w-1 self-stretch rounded-sm transition-colors duration-200
                        ${activo ? 'bg-accent' : 'bg-transparent group-hover:bg-accent/40'}`}
                    />
                    <span className="font-mono text-xs text-muted" aria-hidden="true">
                      {esSeccion ? '#' : '/'}
                    </span>
                    <span className="font-display text-3xl font-extrabold uppercase tracking-tight">
                      {t(`navbar.${link.id}`)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <p className="px-6 pb-8 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          ATKL Records — Techno for the underground
        </p>
      </div>
    </div>
  );
});

export default NavbarMenuMobile;

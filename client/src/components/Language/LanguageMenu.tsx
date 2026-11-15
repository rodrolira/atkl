import React, { useState, useEffect, useCallback, useId, useRef, memo } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';

const IDIOMAS = [
  { code: 'en', pais: 'US', nombre: 'English' },
  { code: 'es', pais: 'ES', nombre: 'Español' },
] as const;

/**
 * Selector de idioma.
 *
 * Antes se abría con onMouseEnter/onMouseLeave: en un teléfono no hay hover,
 * así que el menú era directamente inalcanzable y no se podía cambiar de
 * idioma. Ahora abre por clic, que funciona con mouse, teclado y táctil.
 */
const LanguageMenu: React.FC = () => {
  const { i18n } = useTranslation();
  const { changeLanguage, language } = useLanguage();
  const [abierto, setAbierto] = useState(false);
  const [seleccionado, setSeleccionado] = useState<string>(language || 'en');

  const menuId = useId();
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const guardado = localStorage.getItem('language');
    setSeleccionado(guardado || language);
    if (guardado) i18n.changeLanguage(guardado);
  }, [i18n, language]);

  // Cerrar al hacer clic fuera y con Escape.
  useEffect(() => {
    if (!abierto) return;
    const onClickFuera = (e: MouseEvent) => {
      if (!contenedorRef.current?.contains(e.target as Node)) setAbierto(false);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false);
    };
    document.addEventListener('mousedown', onClickFuera);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onClickFuera);
      document.removeEventListener('keydown', onEscape);
    };
  }, [abierto]);

  const elegir = useCallback(
    (code: string) => {
      changeLanguage(code);
      setSeleccionado(code);
      i18n.changeLanguage(code);
      localStorage.setItem('language', code);
      setAbierto(false);
    },
    [changeLanguage, i18n]
  );

  const actual = IDIOMAS.find((l) => l.code === seleccionado) ?? IDIOMAS[0];

  return (
    <div className="relative z-50" ref={contenedorRef}>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-controls={menuId}
        // El botón medía 20x16: por debajo del mínimo táctil de 44px.
        aria-label={`${actual.nombre} — cambiar idioma`}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md
          border border-muted/30 text-text
          transition-colors duration-200
          hover:border-accent hover:text-accent
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
          focus-visible:outline-accent"
      >
        <ReactCountryFlag
          countryCode={actual.pais}
          svg
          title={actual.pais}
          alt={actual.nombre}
          className="!h-4 !w-auto"
        />
      </button>

      <ul
        id={menuId}
        role="menu"
        className={`absolute right-0 top-full mt-1 min-w-[7rem] list-none overflow-hidden
          rounded-md border border-muted/30 bg-surface p-0 shadow-lg
          ${abierto ? 'block' : 'hidden'}`}
      >
        {IDIOMAS.map((l) => (
          <li key={l.code} role="none">
            <button
              type="button"
              role="menuitem"
              onClick={() => elegir(l.code)}
              aria-current={seleccionado === l.code ? 'true' : undefined}
              className={`flex min-h-11 w-full items-center gap-2 px-3 text-left text-sm
                transition-colors duration-150
                focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2
                focus-visible:outline-accent
                ${seleccionado === l.code ? 'text-accent' : 'text-text hover:text-accent'}`}
            >
              <ReactCountryFlag
                countryCode={l.pais}
                svg
                title={l.pais}
                alt={l.nombre}
                className="!h-4 !w-auto"
              />
              {l.nombre}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default memo(LanguageMenu);

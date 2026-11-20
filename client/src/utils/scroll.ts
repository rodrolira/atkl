// src/utils/scroll.ts

/** Cuántos frames se espera a que aparezca la sección (~3s a 60fps). */
export const INTENTOS_MAXIMOS = 180;

/**
 * Scrollea hasta una sección apenas exista en el DOM.
 *
 * Las secciones del Home son React.lazy: al llegar desde otra ruta con un
 * hash, el efecto corre antes de que el chunk termine de bajar y
 * `getElementById` devuelve null, así que la página se quedaba arriba. Con el
 * chunk ya cacheado no se notaba — fallaba justo la primera visita.
 *
 * Devuelve una función de limpieza: sin ella, salir del Home mientras se
 * espera dejaría el scroll programado sobre la página siguiente.
 *
 * ponytail: sondea por frame hasta ~3s. Si alguna sección tardara más, habría
 * que engancharse a la carga del chunk en vez de sondear.
 */
export const scrollearASeccion = (id: string): (() => void) => {
    let cancelado = false;
    let intentos = INTENTOS_MAXIMOS;

    const buscar = () => {
        if (cancelado) return;

        const seccion = document.getElementById(id);
        if (seccion) {
            seccion.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        if (intentos > 0) {
            intentos -= 1;
            requestAnimationFrame(buscar);
        }
    };

    buscar();

    return () => {
        cancelado = true;
    };
};

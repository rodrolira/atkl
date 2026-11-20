// src/utils/fechas.ts

/**
 * Formatea una fecha de lanzamiento para mostrarla en la tarjeta.
 *
 * Se fuerza UTC a proposito. La columna es un timestamp y las fechas llegan a
 * medianoche UTC ("2024-01-04T00:00:00.000Z"); formateadas en la zona del
 * navegador se corren un dia hacia atras en todo el continente americano (en
 * UTC-3 el 4 se ve como 3). Lo que importa de un lanzamiento es el dia
 * calendario, no el instante exacto.
 *
 * Devuelve null si no hay fecha o si no se puede interpretar, para que la
 * tarjeta simplemente no muestre la linea en vez de escribir "Invalid Date".
 */
export const formatearFechaLanzamiento = (
    valor?: string | number | Date | null,
    idioma = 'es',
): string | null => {
    if (!valor) return null;

    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return null;

    return fecha.toLocaleDateString(idioma, {
        timeZone: 'UTC',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

/**
 * Fecha en formato ISO corto (YYYY-MM-DD) para el atributo `dateTime` de
 * <time>, que es lo que leen los buscadores y los lectores de pantalla.
 */
export const fechaISOCorta = (valor?: string | number | Date | null): string | null => {
    if (!valor) return null;

    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return null;

    return fecha.toISOString().slice(0, 10);
};

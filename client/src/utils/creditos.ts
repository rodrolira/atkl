/**
 * El crédito de un lanzamiento es una lista de nombres separada por comas, tal
 * como vino de Bandcamp: "BbaphometT, thunder21".
 *
 * Algunos de esos nombres tienen ficha en la base (los del sello) y otros no:
 * la mayoría del catálogo son invitados que no son parte de ATKL y no
 * corresponde crearles ficha de artista. Los que tienen ficha se muestran con
 * link a su página; el resto, como texto.
 *
 * La coma es el único separador: los nombres pueden traer "&" o " y " adentro
 * ("Simon & Garfunkel") y partirlos ahí inventaría artistas que no existen.
 */

export const separarCreditos = (credito?: string | null): string[] =>
  (credito ?? '')
    .split(',')
    .map((nombre) => nombre.trim())
    .filter(Boolean);

export const unirCreditos = (nombres: string[]): string =>
  nombres
    .map((nombre) => nombre.trim())
    .filter(Boolean)
    .filter((nombre, i, todos) => todos.findIndex((n) => n.toLowerCase() === nombre.toLowerCase()) === i)
    .join(', ');

/**
 * Nombres del crédito que no corresponden a ninguna de las fichas vinculadas.
 * Son los que van sin link, y los que el formulario muestra como texto libre.
 */
export const creditosSinFicha = (
  credito: string | null | undefined,
  conFicha: Array<{ artist_name?: string }>
): string[] => {
  const fichados = new Set(
    conFicha
      .map((artista) => (artista.artist_name ?? '').trim().toLowerCase())
      .filter(Boolean)
  );

  return separarCreditos(credito).filter((nombre) => !fichados.has(nombre.toLowerCase()));
};

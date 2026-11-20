import { useTranslation } from 'react-i18next';
import { bandcampEmbedKind } from '@/utils/utils';
import { tokenHex } from '@/themes/tokens';

/**
 * Alto del embed, igual para todos los lanzamientos.
 *
 * Antes se calculaba por cantidad de tracks para que la lista entrara justa.
 * El efecto era que cada tarjeta medía distinto —de 176px a 473px solo de
 * reproductor— y la grilla quedaba dispareja. Con un alto fijo, la lista larga
 * scrollea dentro del propio embed (verificado en el navegador con el release
 * de 10 tracks).
 *
 * 275px es lo que ocupan 4 tracks sin scroll interno, que cubre 11 de los 15
 * lanzamientos del catálogo.
 */
const ALTO_EMBED = 275;

interface BandcampPlayerProps {
  albumId: string;
  title: string;
  /**
   * URL pública del release en Bandcamp. Define si el embed es `album=` o
   * `track=`, además de servir de enlace de respaldo.
   */
  bandcampLink?: string;
}

/**
 * Reproductor embebido de Bandcamp con la lista de tracks. El audio vive en
 * Bandcamp: el sitio no guarda ni sirve archivos, solo el ID del release.
 *
 * Se usa el embed propio de Bandcamp y no un reproductor nuestro porque el
 * iframe es cross-origin: ningún JS del sitio puede controlarlo. Esa es también
 * la razón de que no haya una barra global ni una cola entre releases.
 *
 * Requiere `frame-src https://bandcamp.com` en el CSP (vercel.json,
 * client/vercel.json y client/public/_headers). Con `frame-src 'none'` el
 * iframe se bloquea sin error visible.
 */
const BandcampPlayer = ({ albumId, title, bandcampLink }: BandcampPlayerProps) => {
  const { t } = useTranslation();
  const kind = bandcampEmbedKind(bandcampLink);

  // El embed va en tema CLARO aunque el sitio sea oscuro, y es a propósito.
  //
  // Bandcamp no acepta una paleta: `bgcol` solo elige entre dos temas según su
  // luminancia, y los grises de cada tema son fijos. En el tema oscuro la
  // tracklist se pinta #666 sobre #222 = 2,77:1, por debajo del 4,5:1 que
  // necesita ese texto; medido con bgcol 000000, 111111 y 333333, los tres dan
  // exactamente lo mismo. No hay parámetro para corregirlo.
  //
  // En el tema claro la tracklist es #333 sobre blanco = 12,6:1, y el rojo de
  // la marca como linkcol (título y buy/share) da 5,0:1. La paleta entra por
  // el acento y por el borde del contenedor.
  //
  // Bandcamp quiere el hex sin '#'.
  const bgcol = 'ffffff';
  const linkcol = tokenHex('accent');

  // Sin `transparent=true`: con él el player no llena el ancho del iframe y
  // asoma el fondo oscuro del contenedor al costado del bloque blanco.
  const src =
    `https://bandcamp.com/EmbeddedPlayer/${kind}=${encodeURIComponent(albumId)}` +
    `/size=large/tracklist=true/artwork=small/bgcol=${bgcol}/linkcol=${linkcol}/`;

  return (
    <div
      // bg-pure-white y no bg-surface: el embed es claro, y con las esquinas
      // redondeadas + overflow-hidden el fondo del contenedor asoma detrás.
      //
      // La opacidad va sobre el contenedor y no con `transparent=true` del
      // embed: ese parámetro hace que el player no llene el ancho del iframe y
      // asome el fondo oscuro al costado del bloque blanco. Acá el bloque
      // entero se atenúa y el negro de la tarjeta se lee debajo.
      //
      // 90% y no menos porque el texto del embed no es nuestro y no se puede
      // corregir: a esta opacidad la tracklist queda en 10,9:1 sobre el fondo
      // atenuado y el rojo de los links no baja de 4,5:1. Al pasar el mouse o
      // al entrar con teclado vuelve a opaco, que es cuando se lee en serio.
      className="group/bc overflow-hidden rounded-md border border-muted/25
        bg-pure-white opacity-90 transition duration-200
        hover:border-accent/70 hover:opacity-100
        focus-within:border-accent focus-within:opacity-100"
    >
      <iframe
        // loading="lazy" importa: el catálogo monta 15 tarjetas y cada iframe es
        // una petición a Bandcamp.
        loading="lazy"
        src={src}
        title={`${t('bandcamp_player')} — ${title}`}
        className="w-full border-0 block"
        height={ALTO_EMBED}
        seamless
      >
        <a href={bandcampLink ?? 'https://atklrecords.bandcamp.com'}>{title}</a>
      </iframe>
    </div>
  );
};

export default BandcampPlayer;

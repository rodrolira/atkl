import { useTranslation } from 'react-i18next';
import { bandcampEmbedKind, bandcampEmbedHeight } from '@/utils/utils';
import { tokenHex } from '@/themes/tokens';

interface BandcampPlayerProps {
  albumId: string;
  title: string;
  /**
   * URL pública del release en Bandcamp. Define si el embed es `album=` o
   * `track=`, además de servir de enlace de respaldo.
   */
  bandcampLink?: string;
  /** Cantidad de tracks, para darle al iframe el alto justo. */
  trackCount?: number | null;
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
const BandcampPlayer = ({ albumId, title, bandcampLink, trackCount }: BandcampPlayerProps) => {
  const { t } = useTranslation();
  const kind = bandcampEmbedKind(bandcampLink);

  // Bandcamp quiere hex sin '#'. bgcol va con la superficie de la tarjeta para
  // que el iframe no se vea pegado encima.
  //
  // linkcol usa el token de texto y no el acento a propósito: el acento sobre
  // la superficie da 3,80:1, y linkcol pinta el título y los enlaces buy/share,
  // que son texto chico y necesitan 4,5:1. El rojo de la marca entra por el
  // borde y el hover del contenedor, donde el umbral es 3:1.
  const bgcol = tokenHex('surface');
  const linkcol = tokenHex('text');

  const src =
    `https://bandcamp.com/EmbeddedPlayer/${kind}=${encodeURIComponent(albumId)}` +
    `/size=large/tracklist=true/artwork=small/bgcol=${bgcol}/linkcol=${linkcol}/transparent=true/`;

  return (
    <div
      className="group/bc overflow-hidden rounded-md border border-muted/25
        bg-surface transition-colors duration-200
        hover:border-accent/70 focus-within:border-accent"
    >
      <iframe
        // loading="lazy" importa: el catálogo monta 15 tarjetas y cada iframe es
        // una petición a Bandcamp.
        loading="lazy"
        src={src}
        title={`${t('bandcamp_player')} — ${title}`}
        className="w-full border-0 block"
        height={bandcampEmbedHeight(trackCount)}
        seamless
      >
        <a href={bandcampLink ?? 'https://atklrecords.bandcamp.com'}>{title}</a>
      </iframe>
    </div>
  );
};

export default BandcampPlayer;

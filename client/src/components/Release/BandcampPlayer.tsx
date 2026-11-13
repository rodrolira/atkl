import { bandcampEmbedKind, bandcampEmbedHeight } from '@/utils/utils';

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
  const kind = bandcampEmbedKind(bandcampLink);
  const src =
    `https://bandcamp.com/EmbeddedPlayer/${kind}=${encodeURIComponent(albumId)}` +
    '/size=large/tracklist=true/artwork=small/bgcol=000000/linkcol=ffffff/transparent=true/';

  return (
    <iframe
      // loading="lazy" importa: el catálogo monta 15 tarjetas y cada iframe es
      // una petición a Bandcamp.
      loading="lazy"
      src={src}
      title={`Reproductor de Bandcamp — ${title}`}
      className="w-full border-0 block"
      height={bandcampEmbedHeight(trackCount)}
      seamless
    >
      <a href={bandcampLink ?? 'https://atklrecords.bandcamp.com'}>{title}</a>
    </iframe>
  );
};

export default BandcampPlayer;

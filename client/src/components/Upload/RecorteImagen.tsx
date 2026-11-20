import React, { useCallback, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { recortarImagen } from '@/utils/recorte';

interface RecorteImagenProps {
  src: string;
  nombreArchivo: string;
  onConfirmar: (archivo: File) => void;
  onCancelar: () => void;
}

/**
 * Elige qué parte de la foto se sube.
 *
 * Cuadrado fijo porque es lo que termina mostrando la tarjeta (4:5 en móvil,
 * alto fijo en escritorio): dejar elegir otra proporción daría una vista
 * previa que no es la que después se ve en la grilla.
 */
const RecorteImagen: React.FC<RecorteImagenProps> = ({
  src,
  nombreArchivo,
  onConfirmar,
  onCancelar,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recortando, setRecortando] = useState(false);

  const handleCropComplete = useCallback((_: Area, areaEnPixeles: Area) => {
    setArea(areaEnPixeles);
  }, []);

  const handleConfirmar = async () => {
    if (!area) return;

    setError(null);
    setRecortando(true);
    try {
      onConfirmar(await recortarImagen(src, area, nombreArchivo));
    } catch (e) {
      // El recorte pasa por canvas: si falla, el formulario se queda sin
      // imagen nueva y sin decir por qué.
      setError(e instanceof Error ? e.message : 'No se pudo recortar la imagen.');
    } finally {
      setRecortando(false);
    }
  };

  return (
    <div className="mt-3 border border-metallic-gray/40 bg-surface p-3">
      {/* react-easy-crop posiciona en absoluto: necesita un contenedor con
          alto propio o colapsa a cero. */}
      <div className="relative h-72 w-full bg-black">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
        />
      </div>

      <label className="mt-3 block text-xs font-semibold uppercase tracking-[0.2em] text-metallic-gray">
        Zoom
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="mt-1 block w-full accent-white"
        />
      </label>

      <p className="mt-2 text-xs text-metallic-gray">
        Arrastrá la foto para elegir qué parte se sube.
      </p>

      {error && <p role="alert" className="error-message">{error}</p>}

      <div className="mt-3 flex items-center justify-between">
        <button type="button" onClick={onCancelar} className="btn btn-cancel h-10">
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleConfirmar}
          disabled={!area || recortando}
          className="btn btn-save h-10"
        >
          {recortando ? 'Recortando…' : 'Usar este recorte'}
        </button>
      </div>
    </div>
  );
};

export default RecorteImagen;

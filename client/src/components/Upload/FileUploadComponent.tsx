import React, { useEffect, useRef, useState } from 'react';
import { useField } from 'formik';
import RecorteImagen from './RecorteImagen';

interface FileUploadComponentProps {
  name: string;
  label: string;
  setFieldValue: (field: string, value: any) => void;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ name, label, setFieldValue }) => {
  const [, meta] = useField(name);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [recortando, setRecortando] = useState(false);
  // El archivo tal cual lo eligió el usuario: el recorte es opcional y se
  // puede deshacer sin volver a buscar la foto en el disco.
  const [original, setOriginal] = useState<File | null>(null);
  const [recortada, setRecortada] = useState(false);
  const previewUrl = useRef<string | null>(null);
  // La URL del original sobrevive al recorte: es la fuente que lee el cropper
  // y la que hay que restaurar si vuelven a la imagen completa.
  const originalUrl = useRef<string | null>(null);

  const liberarPreview = () => {
    if (previewUrl.current && previewUrl.current !== originalUrl.current) {
      URL.revokeObjectURL(previewUrl.current);
    }
    previewUrl.current = null;
  };

  useEffect(() => () => {
    liberarPreview();
    if (originalUrl.current) {
      URL.revokeObjectURL(originalUrl.current);
    }
    // Solo limpieza al desmontar: las URLs viven en refs, no en estado.
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setFileError('Selecciona un archivo de imagen válido.');
      return;
    }
    setFileError(null);

    liberarPreview();
    if (originalUrl.current) {
      URL.revokeObjectURL(originalUrl.current);
    }

    const objectUrl = URL.createObjectURL(file);
    originalUrl.current = objectUrl;
    previewUrl.current = objectUrl;
    setPreview(objectUrl);
    setOriginal(file);
    setRecortada(false);
    setRecortando(false);
    // Sin tocar el recorte se sube la foto entera, como antes.
    setFieldValue(name, file);
  };

  const handleRecorte = (archivo: File) => {
    liberarPreview();

    const objectUrl = URL.createObjectURL(archivo);
    previewUrl.current = objectUrl;
    setPreview(objectUrl);
    setRecortada(true);
    setRecortando(false);
    setFieldValue(name, archivo);
  };

  const handleImagenCompleta = () => {
    if (!original || !originalUrl.current) return;

    liberarPreview();
    previewUrl.current = originalUrl.current;
    setPreview(originalUrl.current);
    setRecortada(false);
    setFieldValue(name, original);
  };

  return (
    <div className="mb-3 text-left">
      {/* Mismo tratamiento que el resto de los campos del panel: gris de marca
          sobre la superficie, esquinas rectas. Tenía `border-gray-300` y
          `rounded`, que no son de la paleta. */}
      <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-metallic-gray" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="file"
        accept="image/*"
        onChange={handleChange}
        aria-invalid={!!meta.error && meta.touched}
        className="block w-full border border-metallic-gray/40 bg-surface p-2 text-white
          file:mr-3 file:border-0 file:bg-metallic-gray file:px-3 file:py-1 file:font-semibold
          file:uppercase file:tracking-wider file:text-black hover:file:bg-white"
      />
      {fileError && <p role="alert" className="error-message">{fileError}</p>}

      {preview && !recortando && (
        <div className="mt-3 flex items-center gap-3">
          <img src={preview} alt="Preview" className="w-32 h-32 object-cover" />
          <div className="flex flex-col items-start gap-2">
            <button
              type="button"
              onClick={() => setRecortando(true)}
              className="text-xs font-semibold uppercase tracking-wider text-metallic-gray underline hover:text-white"
            >
              {recortada ? 'Cambiar recorte' : 'Elegir qué parte se sube'}
            </button>
            {recortada && (
              <button
                type="button"
                onClick={handleImagenCompleta}
                className="text-xs font-semibold uppercase tracking-wider text-metallic-gray underline hover:text-white"
              >
                Usar la imagen completa
              </button>
            )}
          </div>
        </div>
      )}

      {recortando && originalUrl.current && original && (
        <RecorteImagen
          src={originalUrl.current}
          nombreArchivo={original.name}
          onConfirmar={handleRecorte}
          onCancelar={() => setRecortando(false)}
        />
      )}
    </div>
  );
};

export default FileUploadComponent;

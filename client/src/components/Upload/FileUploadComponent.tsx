import React, { useEffect, useRef, useState } from 'react';
import { useField } from 'formik';

interface FileUploadComponentProps {
  name: string;
  label: string;
  setFieldValue: (field: string, value: any) => void;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ name, label, setFieldValue }) => {
  const [, meta] = useField(name);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const previewUrl = useRef<string | null>(null);

  useEffect(() => () => {
    if (previewUrl.current) {
      URL.revokeObjectURL(previewUrl.current);
    }
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

    if (previewUrl.current) {
      URL.revokeObjectURL(previewUrl.current);
    }

    const objectUrl = URL.createObjectURL(file);
    previewUrl.current = objectUrl;
    setPreview(objectUrl);
    setFieldValue(name, file);
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
      {preview && <img src={preview} alt="Preview" className="mt-3 w-32 h-32 object-cover" />}
    </div>
  );
};

export default FileUploadComponent;

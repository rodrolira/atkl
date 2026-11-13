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
    <div className="mb-3">
      <label className="block mb-1" htmlFor={name}>{label}:</label>
      <input
        id={name}
        name={name}
        type="file"
        accept="image/*"
        onChange={handleChange}
        aria-invalid={!!meta.error && meta.touched}
        className="block w-full rounded border border-gray-300 p-2"
      />
      {fileError && <p role="alert" className="text-red-400 mt-1">{fileError}</p>}
      {preview && <img src={preview} alt="Preview" className="mt-3 w-32 h-32 object-cover" />}
    </div>
  );
};

export default FileUploadComponent;

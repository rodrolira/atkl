import React, { useState } from 'react';
import { useField } from 'formik';
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap';

interface FileUploadComponentProps {
  name: string;
  label: string;
  setFieldValue: (field: string, value: any) => void;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ name, label, setFieldValue }) => {
  const [field, meta] = useField(name);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    setLoading(true);
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result); // Vista previa local de la imagen.
      setFieldValue(name, result); // Actualiza el campo en Formik.
      setLoading(false);
    };

    reader.onerror = () => {
      alert('Error reading file.');
      setLoading(false);
    };

    reader.readAsDataURL(file); // Convertir imagen a base64.
  };

  return (
    <FormGroup className="mb-3">
      <FormLabel htmlFor={name}>{label}:</FormLabel>
      <FormControl
        type="file"
        onChange={handleChange}
        aria-invalid={!!meta.error && meta.touched}
      />
      {loading && <p>Uploading...</p>}
      {preview && <img src={preview} alt="Preview" className="mt-3 w-32 h-32 object-cover" />}
    </FormGroup>
  );
};

export default FileUploadComponent;

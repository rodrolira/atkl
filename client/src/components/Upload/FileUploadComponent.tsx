import React, { useEffect, useRef, useState } from 'react';
import { useField } from 'formik';
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap';

interface FileUploadComponentProps {
  name: string;
  label: string;
  setFieldValue: (field: string, value: any) => void;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ name, label, setFieldValue }) => {
  const [, meta] = useField(name);
  const [preview, setPreview] = useState<string | null>(null);
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
      alert('Please select a valid image file.');
      return;
    }

    if (previewUrl.current) {
      URL.revokeObjectURL(previewUrl.current);
    }

    const objectUrl = URL.createObjectURL(file);
    previewUrl.current = objectUrl;
    setPreview(objectUrl);
    setFieldValue(name, file);
  };

  return (
    <FormGroup className="mb-3">
      <FormLabel htmlFor={name}>{label}:</FormLabel>
      <FormControl
        type="file"
        accept="image/*"
        onChange={handleChange}
        aria-invalid={!!meta.error && meta.touched}
      />
      {preview && <img src={preview} alt="Preview" className="mt-3 w-32 h-32 object-cover" />}
    </FormGroup>
  );
};

export default FileUploadComponent;

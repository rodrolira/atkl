import React, { useState } from 'react';
import { useField } from 'formik';
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import uploadImageToServer from '@/services/imageService';

interface FileUploadComponentProps {
  name: string;
  labelKey: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ name, labelKey, setFieldValue }) => {
  const { t } = useTranslation();
  const [field, meta] = useField(name);
  const { error, touched } = meta;


  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('Selected file:', file);
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    setLoading(true);

    try {
      const imageUrl = await uploadImageToServer(file);
      setPreview(imageUrl); // Previsualiza la imagen
      setFieldValue(name, imageUrl); // Actualiza el campo con la URL de la imagen subida
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  }



  return (
    <FormGroup className="mb-3 w-full flex justify-center items-center" controlId={name}>
      <FormLabel className="block font-bold mb-2 w-1/5 text-gray-300" htmlFor={name}>
        {t(labelKey)}:
      </FormLabel>
      <div className="w-full flex justify-center mx-auto">
        <FormControl
          type="file"
          className="shadow !mx-auto appearance-none border border-1 solid rounded !w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          onChange={handleChange}
          aria-invalid={!!meta.error && meta.touched}
          aria-describedby={`${name}-error`}
        />
        {meta.error && meta.touched && (
          <FormControl.Feedback type="invalid">{meta.error}</FormControl.Feedback>
        )}
      </div>

      {loading && <p>Uploading...</p>}

      {preview && (
        <img src={preview} alt="Preview" className="mt-3 w-full max-w-xs" />
      )}
    </FormGroup>
  );
};

export default FileUploadComponent;

import React, { useState } from 'react';
import { useField } from 'formik';
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import uploadImageToServer from '@/services/imageService';

interface FileUploadComponentProps {
  name: string;
  labelKey: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ name, labelKey, setFieldValue }) => {
  const { t } = useTranslation();
  const [field, meta] = useField(name);
  const { error, touched } = meta;
  const isInvalid = touched && !!error;
  const isValid = touched && !error;

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.currentTarget as HTMLInputElement;

    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      console.log('Selected file:', file);
      setLoading(true);
      try {
        const image = await uploadImageToServer(file);
        setPreview(image); // Previsualiza la imagen
        setFieldValue('image', image); // Actualiza el campo con la URL de la imagen subida
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <FormGroup className="mb-3 w-full flex justify-center items-center" controlId={name}>
      <FormLabel className="block font-bold mb-2 w-1/5 text-gray-300">
        {t(labelKey)}:
      </FormLabel>
      <div className="w-full flex justify-center mx-auto">
        <FormControl
          type="file"
          className="shadow !mx-auto appearance-none border border-1 solid rounded !w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          onChange={handleChange}
          isInvalid={isInvalid}
          isValid={isValid}
        />
        {isInvalid && (
          <FormControl.Feedback type="invalid">{error}</FormControl.Feedback>
        )}
      </div>
      {loading && <p>Uploading...</p>}
      {preview && <img src={preview} alt="Preview" className="mt-3 w-full max-w-xs" />}
    </FormGroup>
  );
};

export default FileUploadComponent;

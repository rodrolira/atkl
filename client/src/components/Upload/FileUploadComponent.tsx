import React, { useState } from 'react';
import { FormikErrors, useField, useFormikContext } from 'formik';
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Artist } from '@/types/interfaces/Artist';

interface FileUploadComponentProps {
  name: string;       // The name of the field in Formik
  labelKey: string;   // The translation key for the label
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<Artist>>;
  
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ name, labelKey, setFieldValue }) => {
  const { t } = useTranslation();
  const [field, meta] = useField(name);
  const { error, touched } = meta;
  const isInvalid = touched && !!error;
  const isValid = touched && !error;

  // State to preview the selected image
  const [preview, setPreview] = useState<string | null>(null);
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.currentTarget as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        const file = target.files[0];
        console.log("Selected file:", file); // Log the file object
        setFieldValue(name, file);  // Set the value of the field
    } else {
        setFieldValue(name, null); // Clear the value of the field
    }
};

  return (
    <FormGroup className="mb-3 w-full flex justify-center items-center" controlId={name}>
      <FormLabel className="block font-bold mb-2 w-1/5 text-gray-700">
        {t(labelKey)}:
      </FormLabel>
      <div className="w-full flex justify-center  mx-auto">
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
    </FormGroup>
  );
};

export default FileUploadComponent;

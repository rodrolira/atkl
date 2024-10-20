import React from 'react';
import { useField, useFormikContext } from 'formik';
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface FileUploadComponentProps {
  name: string;       // The name of the field in Formik
  labelKey: string;   // The translation key for the label
  
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ name, labelKey }) => {
  const { t } = useTranslation();
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  const { error, touched } = meta;
  const isInvalid = touched && !!error;
  const isValid = touched && !error;

  return (
    <FormGroup className="mb-3 w-full" controlId={name}>
      <FormLabel className="block font-bold mb-2 w-full">
        {t(labelKey)}
      </FormLabel>
      <div className="w-full">
        <FormControl
          type="file"
          className="shadow appearance-none border border-1 solid rounded !w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          onChange={(event) => {
            const target = event.currentTarget as HTMLInputElement;
            if (target.files) {
              setFieldValue(name, target.files[0]);
            }
          }}
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

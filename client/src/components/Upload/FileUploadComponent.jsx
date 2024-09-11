// FileUploadComponent.jsx (componente reutilizable)
import React from 'react';
import { useField, useFormikContext } from 'formik';
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const FileUploadComponent = ({ name, labelKey }) => {
  const { t } = useTranslation();
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  const { error, touched } = meta;
  const isInvalid = touched && !!error;
  const isValid = touched && !error;

  return (
    <FormGroup className="mb-3" controlId={name}>
      <FormLabel className="block text-gray-700 font-bold mb-2">
        {t(labelKey)}
      </FormLabel>
      <FormControl
        name={name}
        type="file"
        className="shadow appearance-none border border-1 solid rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        onChange={(event) => {
          setFieldValue(name, event.currentTarget.files[0]);
        }}
        isInvalid={isInvalid}
        isValid={isValid}
      />
      {isInvalid && (
        <FormControl.Feedback type="invalid">{error}</FormControl.Feedback>
      )}
    </FormGroup>
  );
};

export default FileUploadComponent;

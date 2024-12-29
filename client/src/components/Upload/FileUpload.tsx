import React from 'react';
import FileUploadComponent from './FileUploadComponent';
import { Artist } from '@/types/interfaces/Artist';
import { useFormikContext } from 'formik';

const FileUpload: React.FC = () => {
  const { setFieldValue } = useFormikContext<Artist>();

  return (
    <FileUploadComponent
      name="image"
      setFieldValue={setFieldValue} label={"Image"}    />
  );
};

export default FileUpload;

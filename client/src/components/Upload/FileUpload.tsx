import React from 'react';
import FileUploadComponent from './FileUploadComponent';
import { Artist } from '@/types/interfaces/Artist';
import { useFormikContext } from 'formik';

const FileUpload: React.FC = () => {
  const { setFieldValue } = useFormikContext<Artist>();

  return <FileUploadComponent
    name="image"
    labelKey="upload_profile_image"
    setFieldValue={setFieldValue} />;
};

export default FileUpload;

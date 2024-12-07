import React from 'react';
import FileUploadComponent from './FileUploadComponent';
import { useFormikContext } from 'formik';
import { Release } from '@/types/interfaces/Release';

const FileUploadRelease: React.FC = () => {
  const { setFieldValue } = useFormikContext<Release>();

  return (
    <FileUploadComponent
      name="cover_image_url"
      labelKey="upload_cover_image"
      setFieldValue={setFieldValue}
    />
  );
};

export default FileUploadRelease;

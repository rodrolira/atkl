import React from 'react';
import FileUploadComponent from './FileUploadComponent';
import { FormikErrors } from 'formik';
import { Artist } from '@/types/interfaces/Artist';

interface FileUploadProps {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<Artist>>;
  name: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
   setFieldValue,
   }) => {
  return <FileUploadComponent name="image" labelKey="upload_profile_image" />;
};

export default FileUpload;

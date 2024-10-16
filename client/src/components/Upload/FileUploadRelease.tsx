import React from 'react';
import FileUploadComponent from './FileUploadComponent';
import { FormikErrors } from 'formik';
import Release from '@/types/interfaces/Release';

interface FileUploadReleaseProps {
  name?: string; // Optional prop if you want to pass a different name
  labelKey?: string; // Optional prop if you want to pass a different label key
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<Release>>
}

const FileUploadRelease: React.FC<FileUploadReleaseProps> = ({
  name = "cover_image_url",
  labelKey = "upload_cover_image",
  setFieldValue = () => { },
}) => {
  return (
    <FileUploadComponent name={name} labelKey={labelKey} />
  );
};

export default FileUploadRelease;

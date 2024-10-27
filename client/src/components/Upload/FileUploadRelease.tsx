import React from 'react';
import FileUploadComponent from './FileUploadComponent';
import {  useFormikContext } from 'formik';
import {Release} from '@/types/interfaces/Release';

const FileUploadRelease: React.FC = () => {
  const {setFieldValue} = useFormikContext<Release>();
  return (
    <FileUploadComponent  labelKey="upload_release_image" name="cover_image_url" setFieldValue={setFieldValue} />
  );
};

export default FileUploadRelease;

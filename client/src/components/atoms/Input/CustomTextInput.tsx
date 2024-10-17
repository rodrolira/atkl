import React from 'react';
import { useField, ErrorMessage } from 'formik';
import { TextField } from '@mui/material';

interface CustomTextInputProps {
  name: string;
  [key: string]: any; // Accepts any additional props
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({ name, ...props }) => {
  const [field, meta] = useField(name);

  return (
    <TextField
      {...field}
      {...props}
      color='success'
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
};


export default CustomTextInput;

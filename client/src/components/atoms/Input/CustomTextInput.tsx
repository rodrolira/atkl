import React from 'react';
import { useField, ErrorMessage } from 'formik';

interface CustomTextInputProps {
  name: string;
  [key: string]: any; // Accepts any additional props
}

const CustomTextInput: React.FC<CustomTextInputProps> = (props) => {
  const [field] = useField(props);

  return (
    <>
      <input {...field} {...props} />
      <ErrorMessage name={props.name} component="span" className="error" />
    </>
  );
};

export default CustomTextInput;

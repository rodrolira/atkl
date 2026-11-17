import React from 'react';
import { Field, ErrorMessage } from 'formik';

interface FieldInputProps {
  label: string;
  id: string;
  name: string;
  as?: 'input' | 'select' | 'textarea'; // Asegúrate de incluir 'select' y 'textarea'
  type?: string;
  options?: string[]; // Agrega esta línea para incluir options
}

const FieldInput: React.FC<FieldInputProps> = ({ label, id, name, as = 'input', type = 'text', options }) => {
  return (
    <div className="mb-4 flex items-center justify-center">
      <label htmlFor={id} className="block text-gray-300 font-bold mb-2 w-1/5">{label}</label>
      {as === 'select' ? (
        <Field as="select" id={id} name={name} className="input-style shadow appearance-none w-full py-2 px-3 leading-tight">
          {options?.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </Field>
      ) : (
        <Field as={as} type={type} id={id} name={name} className="input-style shadow appearance-none w-full py-2 px-3 leading-tight" />
      )}
      <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
    </div>
  );
};

export default FieldInput;
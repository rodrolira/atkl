import React from 'react'
import { useField, ErrorMessage } from 'formik'

const CustomTextInput = (props) => {
    const [field] = useField(props)

    return (
        <>
            <input {...field} {...props} />
            <ErrorMessage name={props.name} component="span" className="error" />
        </>
    )
}

export default CustomTextInput

import axios from './axios';

export const sendDemoForm = async (formData) => {
    const response = await axios.post('/submit-demo', formData, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

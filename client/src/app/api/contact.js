import axios from './axios';

export const sendContactForm = async (formData) => {
    try {
        const response = await axios.post('/submit-form', formData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error sending contact form:', error);
        throw error;
    }
};

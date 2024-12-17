// src/services/imageService.ts
import axios from '../app/api/axios';

const uploadImageToServer = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await axios.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }})

        return response.data.image; 
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export default uploadImageToServer;

// cloudinaryService.ts

import axios from 'axios';

export const uploadImageToCloudinary = async (
    file: File,
    presetName: string = import.meta.env.VITE_CLOUDINARY_PRESET_NAME || 'default_preset_name',
    cloudName: string = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'default_cloud_name'
): Promise<string> => {

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', presetName);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Cloudinary upload failed with status ${response.status}`);
        }

        const data = await response.json();
        return data.secure_url; // URL segura de la imagen subida
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }
};

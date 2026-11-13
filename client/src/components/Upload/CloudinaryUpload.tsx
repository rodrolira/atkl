import React, { useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const CloudinaryUpload: React.FC = () => {
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!adminAuthenticated) {
    return <p className="text-red-500">🚫 No tienes permisos para subir archivos.</p>;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setUploadError('Selecciona al menos un archivo para subir.');
      return;
    }

    setUploadError(null);
    setUploading(true);
    const uploadedFiles: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "");
      formData.append("folder", import.meta.env.VITE_CLOUDINARY_FOLDER || "");

      try {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData }
        );

        if (!response.ok) throw new Error(`Cloudinary respondió ${response.status}`);

        const data = await response.json();
        if (data.secure_url) uploadedFiles.push(data.secure_url);
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : 'Error al subir el archivo');
      }
    }

    setUploadedUrls((prevUrls) => [...prevUrls, ...uploadedFiles]);
    setUploading(false);
  };

  return (
    <div className="upload-container">
      <input type="file" multiple accept="image/*,audio/*" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={uploading}>
        {uploading ? <CircularProgress size={24} /> : "Subir Archivos"}
      </Button>

      {uploadError && (
        <p role="alert" className="text-red-400">{uploadError}</p>
      )}

      {uploadedUrls.length > 0 && (
        <div>
          <h3>Archivos Subidos:</h3>
          <ul>
            {uploadedUrls.map((url, index) => (
              <li key={index}>
                {url.endsWith(".mp3") || url.endsWith(".wav") ? (
                  <audio controls src={url}></audio>
                ) : (
                  <img src={url} alt={`Subida ${index}`} width="100" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CloudinaryUpload;

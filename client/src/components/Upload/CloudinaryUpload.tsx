import React, { useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const CloudinaryUpload: React.FC = () => {
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  if (!adminAuthenticated) {
    return <p className="text-red-500">🚫 No tienes permisos para subir archivos.</p>;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return alert("Selecciona al menos un archivo para subir.");

    setUploading(true);
    const uploadedFiles: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "");
      formData.append("folder", import.meta.env.VITE_CLOUDINARY_FOLDER || "");

      try {
        const response = await fetch(
          'https://res.cloudinary.com/dotfwyxwr/image/upload/releases/sample.jpg',
          { method: "POST", body: formData }
        );

        const data = await response.json();
        uploadedFiles.push(data.secure_url);
      } catch (error) {
        console.error("Error al subir el archivo:", error);
      }
    }

    setUploadedUrls((prevUrls) => [...prevUrls, ...uploadedFiles]);
    setUploading(false);
    alert("Archivos subidos correctamente!");
  };

  return (
    <div className="upload-container">
      <input type="file" multiple onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={uploading}>
        {uploading ? <CircularProgress size={24} /> : "Subir Archivos"}
      </Button>
      
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

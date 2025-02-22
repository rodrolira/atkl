import React, { useState } from "react";

const CloudinaryUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Selecciona un archivo para subir.");

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setUploadedUrl(data.secure_url);
      alert("Archivo subido correctamente!");
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      alert("Hubo un error al subir el archivo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Subiendo..." : "Subir Archivo"}
      </button>
      {uploadedUrl && (
        <div>
          <p>Archivo subido:</p>
          {file?.type.startsWith("image/") ? (
            <img src={uploadedUrl} alt="Subida" width="200" />
          ) : (
            <audio controls src={uploadedUrl}></audio>
          )}
        </div>
      )}
    </div>
  );
};

export default CloudinaryUploader;

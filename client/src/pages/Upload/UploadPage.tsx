import React from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import CloudinaryUpload from "@/components/Upload/CloudinaryUpload";

const UploadPage: React.FC = () => {
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();

  return (
    <div>
      <h2>Subir Archivos a UKN001</h2>
      {adminAuthenticated ? <CloudinaryUpload /> : <p>🚫 Acceso denegado</p>}
    </div>
  );
};

export default UploadPage;

import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";

interface CloudinaryLinkInputProps {
  links: string[];
  setLinks: (links: string[]) => void;
}

const CloudinaryLinkInput: React.FC<CloudinaryLinkInputProps> = ({ links, setLinks }) => {
  const [newLink, setNewLink] = useState("");

  const handleAddLink = () => {
    if (newLink.trim() === "") return;
    setLinks([...links, newLink]);
    setNewLink("");
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">🎵 Ingresar Enlaces de Cloudinary</h3>
      <Stack spacing={2}>
        {links.map((link, index) => (
          <div key={index} className="flex items-center">
            <TextField fullWidth variant="outlined" value={link} disabled />
            <IconButton onClick={() => handleRemoveLink(index)} color="error">
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <TextField
            fullWidth
            variant="outlined"
            label="Agregar nuevo enlace"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleAddLink}>
            Agregar
          </Button>
        </div>
      </Stack>
    </div>
  );
};

export default CloudinaryLinkInput;

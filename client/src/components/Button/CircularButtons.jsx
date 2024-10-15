import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // Icono para agregar artista
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'; // Icono para agregar release
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Icono para salir (logout)
import './CircularButtons.css'; // Importa los estilos para los botones circulares
import AddArtistForm from '@/components/Artist/AddArtist/AddArtistForm';
import AddReleaseForm from '@/components/Release/AddRelease/AddReleaseForm'; // Importa el formulario
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useTranslation } from 'react-i18next';

// Botón para agregar artista
export const AddArtistButton = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();

  const handleOpen = () => setIsDialogOpen(true);
  const handleClose = () => setIsDialogOpen(false);

  const openPopup = () => setOpen(true);
  const closePopup = () => setOpen(false);

  return (
    <>
      {/* Botón circular */}
      {adminAuthenticated && (
        <IconButton onClick={handleOpen} className="circular-button">
          <PersonAddIcon fontSize="large" className="button-icon" />
          {/* Formulario emergente */}
        </IconButton>
      )}

      {/* Formulario para agregar artista */}
      {isDialogOpen && (
        <AddArtistForm
          openPopup={isDialogOpen}
          closePopup={handleClose}
          onArtistAdded={(newArtist) => {
            console.log('Nuevo artista agregado:', newArtist);
          }}
        />
      )}
    </>
  );
};

// Botón para agregar release
export const AddReleaseButton = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();

  const functionOpenPopup = () => {
    setOpen(true);
  };

  const closePopup = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Botón circular */}
      {adminAuthenticated && (
        <IconButton onClick={functionOpenPopup} className="circular-button">
          <LibraryMusicIcon fontSize="large" className="button-icon" />
        </IconButton>
      )}

      {/* Formulario emergente */}
      <AddReleaseForm open={open} closePopup={closePopup} />
    </>
  );
};

// Botón para salir (logout)
export const AdminLogoutButton = () => {
  const { signout, isAuthenticated: adminAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signout(); // Llama a tu función de cerrar sesión
    navigate('/');
  };

  return (
    <>
      {adminAuthenticated && (
        <IconButton onClick={handleLogout} className="circular-button">
          <ExitToAppIcon fontSize="large" className="button-icon" />
        </IconButton>
      )}
    </>
  );
};

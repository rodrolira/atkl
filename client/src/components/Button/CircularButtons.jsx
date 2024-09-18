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

// Botón para agregar artista
export const AddArtistButton = () => {
    const [open, setOpen] = useState(false);
    const { adminAuthenticated } = useAdminAuth()

    const openPopup = () => setOpen(true)
    const closePopup = () => setOpen(false)

    return (
        <>
            {/* Botón circular */}
            {!adminAuthenticated && (
                <IconButton onClick={openPopup} open={open} className="circular-button">
                    <PersonAddIcon fontSize="large" className="button-icon" />
                    {/* Formulario emergente */}
                </IconButton>
            )}

            {/* Formulario para agregar artista */}
            <AddArtistForm
                open={open}
                closePopup={closePopup}
                onArtistAdded={(newArtist) => {
                    console.log("Nuevo artista agregado:", newArtist)
                }}
            />

        </>
    );
};

// Botón para agregar release
export const AddReleaseButton = () => {
    const [open, setOpen] = useState(false);
    const { adminAuthenticated } = useAdminAuth();

    const functionOpenPopup = () => {
        setOpen(true);
    };

    const closePopup = () => {
        setOpen(false);
    };

    return (
        <>
            {/* Botón circular */}
            {!adminAuthenticated && (
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
    const { signout, adminAuthenticated } = useAdminAuth(); // Utiliza tu función de cerrar sesión
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signout(); // Llama a tu función de cerrar sesión
        navigate('/');
    };

    return (
        <>
            {!adminAuthenticated && (
                <IconButton onClick={handleLogout} className="circular-button">
                    <ExitToAppIcon fontSize="large" className="button-icon" />
                </IconButton>
            )}
        </>
    );

};

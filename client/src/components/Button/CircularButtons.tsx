import React, { useState, useCallback } from 'react';
import IconButton from '@mui/material/IconButton';
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // Icon for adding artist
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'; // Icon for adding release
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Icon for logout
import './CircularButtons.css'; // Import styles for circular buttons
import AddArtistForm from '@/components/Artist/AddArtistForm';
import AddReleaseForm from '@/components/Release/AddRelease/AddReleaseForm'; // Import form
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useTranslation } from 'react-i18next';
import { Artist } from '../../types/interfaces/Artist';

// Type definitions for props or event handling if necessary


// Button to add artist
export const AddArtistButton: React.FC = React.memo(() => {
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();

  const handleOpen = () => setIsDialogOpen(true);
  const handleClose = () => setIsDialogOpen(false);

  const openPopup = () => setOpen(true);
  const closePopup = () => setOpen(false);

  return (
    <>
      {/* Circular Button */}
      {adminAuthenticated && (
        <IconButton onClick={handleOpen} className="circular-button">
          <PersonAddIcon fontSize="large" className="button-icon" />
          {/* Form popup */}
        </IconButton>
      )}

      {/* Form to add artist */}
      {isDialogOpen && (
        <AddArtistForm
          openPopup={isDialogOpen}
          closePopup={handleClose}
          onArtistAdded={(newArtist: Artist) => {
            console.log('New artist added:', newArtist);
          }}
        />
      )}
    </>
  );
});

// Button to add release
export const AddReleaseButton: React.FC = React.memo(() => {
  const [open, setOpen] = useState<boolean>(false);
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();

  const functionOpenPopup = () => {
    setOpen(true);
  };

  const closePopup = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Circular Button */}
      {adminAuthenticated && (
        <IconButton onClick={functionOpenPopup} className="circular-button">
          <LibraryMusicIcon fontSize="large" className="button-icon" />
        </IconButton>
      )}

      {/* Form popup */}
      <AddReleaseForm open={open} closePopup={closePopup} onReleaseAdded={(newRelease: any) => {}} />
    </>
  );
});

// Button for logout
export const AdminLogoutButton: React.FC = React.memo(() => {
  const { signout, isAuthenticated: adminAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    await signout(); // Call your logout function
    navigate('/');
  }, [signout, navigate]);

  return (
    <>
      {adminAuthenticated && (
        <IconButton onClick={handleLogout} className="circular-button">
          <ExitToAppIcon fontSize="large" className="button-icon" />
        </IconButton>
      )}
    </>
  );
});

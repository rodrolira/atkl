import React, { useState } from 'react';
import AddArtistForm from '@/components/Artist/AddArtistForm'; // Importa el formulario de agregar artista
import Button from './Button';
import { useTranslation } from 'react-i18next';

interface AddArtistButtonProps {
  className?: string;
  openPopup?: boolean;
  closePopup?: () => void;
  onArtistAdded?: () => void;
  children: React.ReactNode;
}

const AddArtistButton: React.FC<AddArtistButtonProps> = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleOpen = () => setIsDialogOpen(true);
  const handleClose = () => setIsDialogOpen(false);

  const functionOpenPopup = () => {
    setOpen(true);
  };
  const closePopup = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        fontWeight="font-bold"
        colorClass="bg-[#24db13] text-[#051403]"
      >
        {t('addArtist.title')}
      </Button>

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

export default AddArtistButton;

import { useState } from 'react';
import AddArtistForm from '@/components/Artist/AddArtist/AddArtistForm'; // Importa el formulario de agregar artista
import Button from './Button';
import { useTranslation } from 'react-i18next';

const AddArtistButton = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      {/* Botón para abrir el popup */}
      <Button
        onClick={handleOpen}
        fontWeight="font-bold"
        colorClass="bg-[#24db13] text-[#051403]"
      >
        {t('addArtist.title')}
      </Button>

      {/* Formulario para agregar artista */}
      {isDialogOpen && (
      <AddArtistForm
        openPopup={isDialogOpen} // Estado que controla si está abierto o no
        closePopup={handleClose} // Función para cerrar el formulario
        onArtistAdded={(newArtist) => {
          console.log('Nuevo artista agregado:', newArtist);
        }}
      />
      )}
    </>
  );
};

export default AddArtistButton;

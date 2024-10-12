import { useState } from 'react';
import AddArtistForm from '@/components/Artist/AddArtist/AddArtistForm'; // Importa el formulario de agregar artista
import Button from './Button';
import { useTranslation } from 'react-i18next';

const AddArtistButton = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

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
        onClick={functionOpenPopup}
        fontWeight="font-bold"
        colorClass="bg-[#24db13] text-[#051403]"
      >
        {t('addArtist.title')}
      </Button>

      {/* Formulario para agregar artista */}
      <AddArtistForm
        openPopup={open} // Estado que controla si está abierto o no
        closePopup={closePopup} // Función para cerrar el formulario
        onArtistAdded={(newArtist) => {
          console.log('Nuevo artista agregado:', newArtist);
        }}
      />
    </>
  );
};

export default AddArtistButton;

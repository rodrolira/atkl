// src/components/Team/AddTeamMemberButton.jsx
import { useState } from 'react';
import AddTeamMemberForm from '@/components/Team/AddTeamMemberForm';
import Button from './Button';
import { useTranslation } from 'react-i18next';

const AddTeamMemberButton = () => {
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
        {t('addTeamMember.title')}
      </Button>

      {/* Formulario para agregar miembro del equipo */}
      <AddTeamMemberForm
        open={open}
        closePopup={closePopup}
        onTeamMemberAdded={(newTeamMember) => {
          console.log('Nuevo miembro del equipo agregado:', newTeamMember);
        }}
      />
    </>
  );
};

export default AddTeamMemberButton;

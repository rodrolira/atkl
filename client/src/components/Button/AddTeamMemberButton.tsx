import React, { useState } from 'react';
import AddTeamMemberForm from '@/components/Team/AddTeamMemberForm';
import Button from './Button';
import { useTranslation } from 'react-i18next';

const AddTeamMemberButton: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  const functionOpenPopup = () => {
    setOpen(true);
  };
  const closePopup = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={functionOpenPopup}
        fontWeight="font-bold"
        colorClass="bg-[#24db13] text-[#051403]"
      >
        {t('addTeamMember.title')}
      </Button>

      <AddTeamMemberForm
        open={open}
        closePopup={closePopup}
        onTeamMemberAdded={(newTeamMember: any) => {
          console.log('Nuevo miembro del equipo agregado:', newTeamMember);
        }}
      />
    </>
  );
};

export default AddTeamMemberButton;

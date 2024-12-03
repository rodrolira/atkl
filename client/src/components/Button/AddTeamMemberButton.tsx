import React, { useState, useCallback } from 'react';
import AddTeamMemberForm from '@/components/Team/AddTeamMemberForm';
import Button from './Button';
import { useTranslation } from 'react-i18next';

const AddTeamMemberButton: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  const functionOpenPopup = useCallback(() => {
    setOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setOpen(false);
  }, []);

  const onTeamMemberAdded = useCallback((newTeamMember: any) => {
    console.log('Nuevo miembro del equipo agregado:', newTeamMember);
  }, []);

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
        onTeamMemberAdded={onTeamMemberAdded}
      />
    </>
  );
};

export default React.memo(AddTeamMemberButton);

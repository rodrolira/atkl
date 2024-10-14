import { useState } from 'react';
import AddReleaseForm from '@/components/Release/AddRelease/AddReleaseForm';
import Button from './Button';
import { useTranslation } from 'react-i18next';

const AddReleaseButton = () => {
  const { t } = useTranslation();
  const [open, openChange] = useState(false);
  const functionOpenPopup = () => {
    openChange(true);
  };
  const closePopup = () => {
    openChange(false);
  };

  return (
    <>
      <Button
        onClick={functionOpenPopup}
        fontWeight="font-bold"
        colorClass="bg-[#24db13] text-[#051403]"
      >
        {t('add_release')}
      </Button>

      <AddReleaseForm open={open} closePopup={closePopup} />
    </>
  );
};

export default AddReleaseButton;

import React, { useCallback, memo } from 'react';
import Button from './Button';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

const DemoButton: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleButtonClick = useCallback(() => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollToDemos: true } });
    } else {
      const demosSection = document.getElementById('demo');
      if (demosSection) {
        demosSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.pathname, navigate]);

  return (
    <div className="sm:h-full md:block lg:h-[60%] xl:h-auto cursor-pointer">
      <Button
        variant="primary"
        onClick={handleButtonClick}
        // El className traia bg-gray-600/gray-400 y un focus:ring propio que
        // peleaban con la variante; los estados ya los da Button.
        className="justify-center sm:w-32 md:w-auto lg:text-sm md:text-xs md:font-normal lg:font-bold md:m-0 lg:mx-2 md:order-2"
      >
        {t('send_demo')}
      </Button>
    </div>
  );
};

export default memo(DemoButton);

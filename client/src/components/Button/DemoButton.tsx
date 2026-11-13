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
        colorClass="bg-metallic-gray text-white hover:bg-white hover:text-black focus:ring-4 focus:outline-none focus:ring-metallic-gray md:order-1"
        onClick={handleButtonClick}
        className="justify-center sm:w-32 md:w-auto lg:text-sm md:text-xs h-full md:font-normal lg:font-bold bg-gray-600 hover:bg-gray-400 hover:text-black focus:ring-4 focus:outline-none focus:ring-gray-400 px-5 md:m-0 lg:mx-2 py-2.5 text-center uppercase tracking-wider md:order-2"
      >
        {t('send_demo')}
      </Button>
    </div>
  );
};

export default memo(DemoButton);

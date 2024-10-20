import React from 'react';
import { useTranslation } from 'react-i18next';
import Title from '@/components/atoms/Title/Title';
import Background from '../Layout/Background';
import { Link } from 'react-router-dom';

const AboutSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className='relative z-50'>
      <div className="container mx-auto p-4 sm:p-16 z-50 relative">
        <Link to="/about">
          <Title>{t('aboutSection.title')}</Title>
        </Link>
        <p className="text-sm sm:text-xl text-white">
          <span dangerouslySetInnerHTML={{ __html: t('aboutSection.text') }} />
        </p>
        {/* Add more content for the "About" section as necessary */}
      </div>
      <Background />
    </section>
  );
};

export default AboutSection;

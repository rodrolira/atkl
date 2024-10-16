import React from 'react';
import { useTranslation } from 'react-i18next';
import Title from '@/components/atoms/Title/Title';

const AboutSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="about">
      <div className="container mx-auto p-4 sm:p-16">
        <Title>{t('aboutSection.title')}</Title>
        <p className="text-sm sm:text-xl text-white">
          <span dangerouslySetInnerHTML={{ __html: t('aboutSection.text') }} />
        </p>
        {/* Add more content for the "About" section as necessary */}
      </div>
    </section>
  );
};

export default AboutSection;

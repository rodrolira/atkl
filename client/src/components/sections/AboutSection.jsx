import React from 'react';
import { useTranslation } from 'react-i18next';
import Title from '@/components/atoms/Title/Title';

function AboutSection() {
  const { t } = useTranslation();

  return (
    <section id="about">
      <div className="container mx-auto p-4 sm:p-16">
        <Title>{t('aboutSection.title')}</Title>
        <p className="text-sm sm:text-xl text-white">
          <span dangerouslySetInnerHTML={{ __html: t('aboutSection.text') }} />
        </p>
        {/* Agrega más contenido sobre la sección "About" según sea necesario */}
      </div>
    </section>
  );
}

export default AboutSection;

import React from 'react';
import { useTranslation } from 'react-i18next';
import Title from '@/components/atoms/Title/Title';
import Navbar from '@/components/Navbar/Navbar';

function AboutPage() {
  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white">
        <section id="about" className="container mx-auto p-4 sm:p-16">
          <Title>{t('aboutSection.title')}</Title>
          <p className="text-sm sm:text-xl">
            <span dangerouslySetInnerHTML={{ __html: t('aboutSection.text') }} />
          </p>

          {/* Información adicional de la empresa */}
          <div className="mt-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {t('aboutSection.missionTitle')}
            </h2>
            <p className="text-sm sm:text-lg">
              {t('aboutSection.missionText')}
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold mt-8 mb-4">
              {t('aboutSection.visionTitle')}
            </h2>
            <p className="text-sm sm:text-lg">
              {t('aboutSection.visionText')}
            </p>

            {/* El equipo se mostrará cuando se conecte /api/team.
                Antes había datos de ejemplo (John Doe / example.com) visibles en producción. */}
          </div>
        </section>
      </main>
    </>
  );
}

export default AboutPage;

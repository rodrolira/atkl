import React, { Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Home.module.css';
import { useTranslation } from 'react-i18next';
import Loading from '@/components/atoms/Loading/Loading';
import ErrorBoundary from '@/components/Error/ErrorBoundary';
// Usando React.lazy para cargar los componentes de forma perezosa
const Navbar = React.lazy(() => import('@/components/Navbar/Navbar'));
const ArtistsSection = React.lazy(() => import('@/components/sections/ArtistsSection'));
const ReleasesSection = React.lazy(() => import('@/components/sections/ReleasesSection'));
const AboutSection = React.lazy(() => import('@/components/sections/AboutSection'));
const DemosSection = React.lazy(() => import('@/components/sections/DemoSection'));
const ContactSection = React.lazy(() => import('@/components/sections/ContactSection'));


const Home: React.FC = () => {
  const { t } = useTranslation(); // Hook de traducción
  const location = useLocation();


  useEffect(() => {
    if (location.state?.scrollToDemos) {
      const demosSection = document.getElementById('demo');
      if (demosSection) {
        demosSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.state?.scrollToDemos]);

  return (
    <>
      <Suspense fallback={<Loading />}>

        <Navbar />
        <div id="home">
          <div
            className={`${styles.parallaxContainer} flex relative h-screen overflow-hidden z-50`}
          >
            <div
              className={`${styles.parallaxContent} inset-0 bg-gradient-to-b from-transparent to-[#122e0f] backdrop-blur-md`}
            >
              {/* Contenido del encabezado aquí */}
              <div className={`${styles.container} h-full`}>
                <section
                  id="main"
                  className={`${styles.main} w-full flex flex-col justify-around`}
                >
                  <div>
                    <img
                      alt="main"
                      className="mt-0 mx-auto md:mt-16 lg:mt-24 md:w-1/2 sm:w-3/4 xl:w-2/5 lg:w-1/2 inverted md:inset-0"
                      src="/img/main.webp"
                      loading="lazy"
                    />
                  </div>
                  <div className="text-center mx-auto w-full text-white flex flex-col lg:mb-24">
                    {/* Usamos el hook `t` para la traducción */}
                    <h1 className="font-extrabold mx-auto text-center lg:text-5xl text-3xl">
                      {t('homeHeader.title')}{' '}
                    </h1>
                    <h2 className="text-xl lg:text-3xl">
                      {t('homeHeader.subtitle')}{' '}
                    </h2>
                  </div>
                </section>
              </div>
            </div>
          </div>
          <ArtistsSection />
          <ErrorBoundary>
            <ReleasesSection />
          </ErrorBoundary>
          <AboutSection />
          <DemosSection />
          <ErrorBoundary>
            <ContactSection />
          </ErrorBoundary>
        </div>
      </Suspense>
    </>

  );
};

export default React.memo(Home);

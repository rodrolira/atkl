import React, { Suspense, useEffect, useState, memo } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Home.module.css';
import { useTranslation } from 'react-i18next';
import Loading from '@/components/atoms/Loading/Loading';
import ErrorBoundary from '@/components/Error/ErrorBoundary';
import { scrollearASeccion } from '@/utils/scroll';
// Usando React.lazy para cargar los componentes de forma perezosa
const Navbar = React.lazy(() => import('@/components/Navbar/Navbar'));
const ArtistsSection = React.lazy(() => import('@/components/sections/ArtistsSection'));
const ReleasesSection = React.lazy(() => import('@/components/sections/ReleasesSection'));
const AboutSection = React.lazy(() => import('@/components/sections/AboutSection'));
const DemosSection = React.lazy(() => import('@/components/sections/DemoSection'));
const ContactSection = React.lazy(() => import('@/components/sections/ContactSection'));

const Home: React.FC = memo(() => {
  const { t } = useTranslation(); // Hook de traducción

  const location = useLocation();

  // react-router tipa `state` como `any`: el cast acota lo único que se manda
  // acá. Antes esto era una interfaz que extendía `Location`, pero agarraba el
  // Location del DOM (window.location), no el de react-router.
  const { scrollToDemos } = (location.state ?? {}) as { scrollToDemos?: boolean };

  // Las dos esperan a que la sección exista: son lazy y al llegar desde otra
  // ruta todavía no están montadas cuando corre el efecto.
  useEffect(() => {
    if (!scrollToDemos) {
      return;
    }

    return scrollearASeccion('demo');
  }, [scrollToDemos]);

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    return scrollearASeccion(location.hash.replace('#', ''));
  }, [location.hash]);

  return (
    <>
      <Suspense fallback={<Loading />}>

        <Navbar />
        <main id="home">
          <div
            className={`${styles.parallaxContainer} flex relative h-screen overflow-hidden z-50`}
          >
            <div className={`${styles.parallaxContent} inset-0`}>
              {/* Contenido del encabezado aquí */}
              <div className={`${styles.container} h-full`}>
                <section
                  id="main"
                  className={`${styles.main} w-full flex flex-col justify-around`}
                >
                  <div>
                    <img
                      alt="ATKL Records"
                      // El archivo es trazo negro sobre fondo transparente, así
                      // que sobre el hero oscuro no se veía. No existe una
                      // variante blanca: `brightness-0` lo aplana a silueta y
                      // `invert` la pasa a blanca, igual que el componente Logo
                      // del navbar. Es el uso que marca el manual sobre negro.
                      // La clase `inverted` que estaba acá no existe en ningún
                      // stylesheet: nunca hizo nada.
                      className="mt-0 mx-auto md:mt-16 lg:mt-24 md:w-1/2 sm:w-3/4 xl:w-2/5 lg:w-1/2 brightness-0 invert md:inset-0"
                      src="/img/main.webp"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                    />
                  </div>
                  <div className="text-center mx-auto w-full text-white flex flex-col lg:mb-24">
                    {/* Usamos el hook `t` para la traducción */}
                    <h1 className="font-extrabold mx-auto text-center lg:text-5xl text-3xl">
                      {t('homeHeader.title')}

                    </h1>

                    <h2 className="text-xl lg:text-3xl">
                      {t('homeHeader.subtitle')}
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
        </main>
      </Suspense>
    </>

  );
});

export default React.memo(Home);

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import Navbar from '@/components/Navbar/Navbar';
import styles from './Home.module.css'
import ArtistsSection from '@/components/sections/ArtistsSection';
import ReleasesSection from '@/components/sections/ReleasesSection';
import AboutSection from '@/components/sections/AboutSection';
import DemosSection from '@/components/sections/DemoSection';
import ContactSection from '@/components/sections/ContactSection';
import { useTranslation } from 'react-i18next'

function Home() {
  const { t } = useTranslation(); // Hook de traducción
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToDemos) {
      const demosSection = document.getElementById('demo')
      if (demosSection) {
        demosSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [location.state]);

  return (
    <>
      <Navbar />
      <div id="home">
        <div className={`${styles.parallaxContainer} flex relative h-screen overflow-hidden`}>
          <div className={`${styles.parallaxContent} inset-0 bg-gradient-to-b from-transparent to-[#122e0f] backdrop-blur-md`}>
            {/* Contenido del encabezado aquí */}
            <div className={`${styles.container} h-full`}>
              <section
                id="main"
                className={`${styles.main} w-full flex flex-col justify-around`}>
                <div>
                  <img
                    alt="main"
                    className="mt-0 mx-auto md:mt-24 sm:w-3/4 xl:w-2/5 lg:w-1/2"
                    src="/img/main.png"
                  />
                </div>
                <div className="text-center mx-auto w-full text-white flex flex-col lg:mb-24">
                  {/* Usamos el hook `t` para la traducción */}
                  <h1 className="font-extrabold mx-auto text-center lg:text-5xl text-3xl">
                    {t('homeHeader.title')} {/* Traducción de "HARD TECHNO IS LIFE" */}
                  </h1>
                  <h2 className="text-xl lg:text-3xl">
                    {t('homeHeader.subtitle')} {/* Traducción de "LABEL" o "SELLO DISCOGRÁFICO" */}
                  </h2>
                </div>
              </section>
            </div>
          </div>
        </div>
        <ArtistsSection />
        <ReleasesSection />
        <AboutSection />
        <DemosSection />
        <ContactSection />
      </div>
    </>
  );
}

export default Home;

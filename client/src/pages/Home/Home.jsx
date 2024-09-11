import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { useLanguage } from '@/hooks/useLanguage'
import Navbar from '@/components/Navbar/Navbar';
import styles from './Home.module.css'
import ArtistsSection from '@/components/Artist/ArtistsSection';
import ReleasesSection from '@/components/Release/ReleasesSection';
import AboutSection from '@/components/About/AboutSection';
import DemosSection from '@/components/Demo/DemoSection';
import ContactSection from '@/components/Contact/ContactSection';

function Home() {
  const { language } = useLanguage() // Obtiene el estado del idioma desde el contexto
  const location = useLocation()

 

  useEffect(() => {
    if (location.state && location.state.scrollToDemos) {
      const demosSection = document.getElementById('demos')
      if (demosSection) {
        demosSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [location])

  return (
    <>
      <Navbar />
      <div id="home">
        <div className={`${styles.parallaxContainer} flex relative h-screen overflow-hidden`}>
          <div className={`${styles.parallaxContent} inset-0 bg-gradient-to-b from-transparent to-[#122e0f] backdrop-blur-md`}>
            {/* Contenido del encabezado aquí */}
            <div className={`${styles.container} h-screen`}>
              <section
                id="main"
                className={`${styles.main} w-full flex flex-col justify-evenly`}>
                <div className={`${styles.logoMain} flex items-center md:h-full w-full`}>
                  <img
                    alt="main"
                    className=" mt-0 mx-auto md:mt-80"
                    src="/img/main.png"
                  />
                </div>
                <div className="text-center mx-auto w-full text-white flex flex-col lg:mb-24">
                  <h1 className="font-extrabold mx-auto text-center lg:text-5xl text-3xl">
                    {language === 'en'
                      ? 'HARD TECHNO IS LIFE'
                      : 'HARD TECHNO IS LIFE'}
                  </h1>
                  <h2 className="text-xl lg:text-3xl ">
                    {language === 'en'
                      ? 'LABEL'
                      : 'SELLO DISCOGRÁFICO'}
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

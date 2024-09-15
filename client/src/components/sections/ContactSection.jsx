import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
// Importa ContactForm usando importación dinámica
const ContactForm = React.lazy(() => import('@/components/Contact/ContactForm'));
import Title from '@/components/atoms/Title/Title';

const ContactSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative">
      <div className="relative container p-4 sm:p-16 z-0 max-w-screen-xl mx-auto text-gray-900 sm:px-4 md:px-8">
        <div className="max-w-lg space-y-3 px-4 sm:mx-auto sm:text-center sm:px-0">
          <Title>
            {t('contactSection.title')}
          </Title>
        </div>
        <div className="mt-8 sm:mt-12 mx-auto sm:p-8 bg-white sm:max-w-lg sm:px-8 sm:rounded-xl rounded-md">
          <Suspense fallback={<div>Loading...</div>}>
            <ContactForm /> {/* Renderiza el componente ContactForm */}
          </Suspense>
        </div>
      </div>
      <div
        className="absolute inset-0 blur-[118px] max-w-lg h-[800px] mx-auto sm:max-w-3xl sm:h-[400px]"
        style={{
          background:
            'linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)',
        }}
      ></div>
    </section>
  );
};

export default ContactSection;

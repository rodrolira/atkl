import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
// Import ContactForm using dynamic import
const ContactForm = React.lazy(() => import('../Contact/ContactForm'));
import Title from '@/components/atoms/Title/Title';
import BaseCard from '../Layout/BaseCard';
import Loading from '../atoms/Loading/Loading';
import ErrorBoundary from '../Error/ErrorBoundary';

const ContactSection: React.FC = React.memo(() => {
  const { t } = useTranslation();

  return (
    <section className="relative" id="contact">
      <div className="relative container p-4 sm:p-16 max-w-screen-xl mx-auto text-white sm:px-4 md:px-8">
        <div className="max-w-lg space-y-3 px-4 sm:mx-auto sm:text-center sm:px-0">
          <Title>{t('contactSection.title')}</Title>
        </div>
        <BaseCard className="mt-8 sm:mt-12 mx-auto sm:p-8 sm:max-w-lg sm:px-8 sm:rounded-lg rounded-md">
          <ErrorBoundary>
            <Suspense fallback={<Loading />}>
              <ContactForm /> {/* Renders the ContactForm component */}
            </Suspense>
          </ErrorBoundary>
        </BaseCard>
      </div>
      <div
        className="absolute z-0 inset-0 blur-[118px] max-w-lg max-h-lg h-[800px] mx-auto sm:max-w-3xl sm:h-[400px]"
        style={{
          background:
            'linear-gradient(106.89deg, rgba(26, 26, 26, 0.15) 15.73%, rgba(42, 42, 42, 0.1) 15.74%, rgba(74, 74, 74, 0.08) 56.49%, rgba(154, 154, 154, 0.05) 115.91%)',
        }}
      ></div>
    </section>
  );
});

export default ContactSection;
import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Title from '@/components/atoms/Title/Title';
import Background from '../Layout/Background';
import BaseCard from '../Layout/BaseCard';
import Loading from '../atoms/Loading/Loading';
import ErrorBoundary from '../Error/ErrorBoundary';

const DemoForm = React.lazy(() => import('../Demo/DemoForm'));

const DemosSection: React.FC = React.memo(() => {
  const { t } = useTranslation();

  return (
    <section id="demo" className="relative z-50">
      <div className="container relative z-50 mx-auto max-w-screen-xl p-4 sm:p-16">
        <div className="max-w-lg space-y-3 px-4 sm:mx-auto sm:px-0 sm:text-center">
          <Title>{t('demoForm.title')}</Title>
          <p className="text-sm text-muted">{t('demoForm.intro')}</p>
        </div>
        <BaseCard className="mx-auto mt-8 rounded-md sm:mt-12 sm:max-w-2xl sm:rounded-lg sm:p-8">
          <ErrorBoundary>
            <Suspense fallback={<Loading />}>
              <DemoForm />
            </Suspense>
          </ErrorBoundary>
        </BaseCard>
      </div>
      <Background />
    </section>
  );
});

export default DemosSection;

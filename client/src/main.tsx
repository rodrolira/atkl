// client/src/main.tsx
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import React from 'react';
import store from './app/store';
// i18n se auto-inicializa al importarse (ver ./i18n)
import './i18n';
import AppThemeProvider from './themes/AppThemeProvider';
import { ThemeModeProvider } from '@/contexts/ThemeModeContext';
import App from './App';
import './main.css';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { ArtistProvider } from '@/contexts/ArtistContext';
import { GenreProvider } from '@/contexts/GenreContext';
import { ReleaseProvider } from '@/contexts/ReleaseContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ErrorBoundary from './components/Error/ErrorBoundary';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <ThemeModeProvider>
          <AppThemeProvider>
          <LanguageProvider>
            <AdminAuthProvider>
              <ArtistProvider>
                <ReleaseProvider>
                  <GenreProvider>
                    <ErrorBoundary>
                      <App />
                    </ErrorBoundary>
                  </GenreProvider>
                </ReleaseProvider>
              </ArtistProvider>
            </AdminAuthProvider>
          </LanguageProvider>
          </AppThemeProvider>
        </ThemeModeProvider>
      </Provider>
    </React.StrictMode>,
  );
} else {
  console.error('Root element not found');
}
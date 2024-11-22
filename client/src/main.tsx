import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import React from 'react';
import store from './app/store';
import AppThemeProvider2 from './themes/AppThemeProvider2';
import App from './App';
import './main.css';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { ArtistProvider } from '@/contexts/ArtistContext';
import { GenreProvider } from '@/contexts/GenreContext';
import { ReleaseProvider } from '@/contexts/ReleaseContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ErrorBoundary from './components/Error/ErrorBoundary';


// Cargar React DevTools solo en desarrollo
if (process.env.NODE_ENV === 'development') {
  const script = document.createElement('script');
  document.body.appendChild(script);
}

const rootElement = document.getElementById('root');
if (rootElement) {
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppThemeProvider2>
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
      </AppThemeProvider2>
    </Provider>
  </React.StrictMode>,
);
} else {
  console.error('Root element not found');
}
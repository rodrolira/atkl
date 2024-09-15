import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import React from 'react';
import store from './app/store';
import AppThemeProvider from './themes/AppThemeProvider';
import App from './App';
import './main.css';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { ArtistProvider } from '@/contexts/ArtistContext';
import { GenreProvider } from '@/contexts/GenreContext';
import { ReleaseProvider } from '@/contexts/ReleaseContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppThemeProvider>
        <LanguageProvider>
          <AdminAuthProvider>
            <ArtistProvider>
              <ReleaseProvider>
                <GenreProvider>
                  <App />
                </GenreProvider>
              </ReleaseProvider>
            </ArtistProvider>
          </AdminAuthProvider>
        </LanguageProvider>
      </AppThemeProvider>
    </Provider>
  </React.StrictMode >
);

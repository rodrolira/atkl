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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppThemeProvider>
      <AdminAuthProvider>
      <ArtistProvider>
      <ReleaseProvider>
      <GenreProvider>
        <App />
        </GenreProvider>
        </ReleaseProvider>
        </ArtistProvider>
        </AdminAuthProvider>
      </AppThemeProvider>
    </Provider>
  </React.StrictMode>,
);

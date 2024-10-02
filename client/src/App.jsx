import React, { useEffect } from 'react';
import supabase from './utils/supabase';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Routing from './routes/Routing';
import { useTranslation } from 'react-i18next';
import './App.css';

import './i18n';
import Footer from './components/Footer/Footer';
import { AuthProvider } from '@/contexts/AuthContext'; // Importa el AuthProvider

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        localStorage.setItem('session', JSON.stringify(session));
      }
    });
  }, []);

  return (
    <div id="app" className="flex">
      <div className="layout">
        <AuthProvider>
          <BrowserRouter>
            <CssBaseline />
            <Routing />
            <Footer />
          </BrowserRouter>
        </AuthProvider>
      </div>
    </div>
  );
}

export default App;

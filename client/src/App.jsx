import React, { useEffect } from 'react';
import { supabase } from './utils/supabase'
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Routing from './routes/Routing';
import { useTranslation } from 'react-i18next'
import './App.css'

import './i18n'
import Footer from './components/Footer/Footer';

function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage)
    }
  }, [i18n])
  
  return (
    <div id='app' className='flex'>
      <div className='layout'>
        <BrowserRouter>
          <CssBaseline />
          <Routing />
          <Footer/>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;

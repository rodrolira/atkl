import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Routing from './routes/Routing';
import './App.css';

import './i18n';
import Footer from './components/Footer/Footer';

const App: React.FC = () => {


  return (
    <div id="app" className="flex">
      <div className="layout">
          <BrowserRouter>
            <CssBaseline />
            <Routing />
            <Footer isAdminLogin={false} />
          </BrowserRouter>
      </div>
    </div>
  );
};

export default App;

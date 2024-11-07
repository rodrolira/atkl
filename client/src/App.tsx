import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Routing from './routes/Routing';
import './App.css';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/react';

import './i18n';
import Footer from './components/Footer/Footer';

const App: React.FC = () => {


  return (
    <BrowserRouter>

      <div id="app" className="flex">
        <div className="layout">
          <Analytics />
          <SpeedInsights />
          <CssBaseline />
          <Routing />
          <Footer isAdminLogin={false} />
        </div>
      </div>
    </BrowserRouter>

  );
};

export default App;

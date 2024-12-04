// client/src/App.tsx
import React, { useEffect, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Routing from './routes/Routing';
import './App.css';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/react';
import Loglib from '@loglib/tracker/react';
import './i18n';
import Footer from './components/Footer/Footer';


const App: React.FC = () => {
  useEffect(() => {
    console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
  }, []);

  const memoizedAnalytics = useMemo(() => <Analytics />, []);
  const memoizedCssBaseline = useMemo(() => <CssBaseline />, []);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>

      <div id="app" className="flex">
        <div className="layout">
          {memoizedAnalytics}
          <SpeedInsights />
          {memoizedCssBaseline}
          <Loglib
            config={{
              id: "atkl"
            }}
          />
          <Routing />
          <Footer isAdminLogin={false} />
        </div>
      </div>
    </BrowserRouter>

  );
};

export default App;

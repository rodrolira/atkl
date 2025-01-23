// client/src/App.tsx
import React, { useEffect, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Routing from './routes/Routing';
import './App.css';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from '@vercel/speed-insights/react';
import Loglib from '@loglib/tracker/react';
import './i18n';
import Footer from './components/Footer/Footer';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';

const App: React.FC = () => {
  const { trackList, isVisible } = useMusicPlayer();

  useEffect(() => {
    console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
  }, []);

  const config = useMemo(() => ({ id: "atkl" }), []);
  const future = useMemo(
    () => ({
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }),
    []
  );

  return (
    <BrowserRouter future={future}>
      <div id="app" className="flex min-h-screen">
        <div className="layout flex-1">
          <Analytics />
          <SpeedInsights />
          <CssBaseline />
          <Loglib config={config} />
          <Routing />
          <Footer isAdminLogin={false} />
        </div>

        {/* Reproductor de audio siempre visible en la parte inferior */}
        <MusicPlayer />
      </div>
    </BrowserRouter>
  );
};

export default App;

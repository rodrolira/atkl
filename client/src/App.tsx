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
import { MusicPlayerProvider } from '@/contexts/MusicPlayerContext'; // 🔹 Importamos el Provider
import { MusicPlaylistProvider } from "@/contexts/MusicPlaylistContext";
import MusicPlayer from './components/MusicPlayer/MusicPlayer';

const App: React.FC = () => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    console.log('VITE_API_URL:', VITE_API_URL);
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
    <BrowserRouter>
      <MusicPlayerProvider> {/* 🔹 Aseguramos que `MusicPlayerProvider` envuelve todo */}
        <MusicPlaylistProvider>
          <div id="app" className="flex min-h-screen">
            <div className="layout flex-1">
              <Analytics />
              <SpeedInsights />
              <CssBaseline />
              <Loglib config={config} />
              <Routing />
              <Footer isAdminLogin={false} />
            </div>

            {/* 🔹 Reproductor de música correctamente envuelto en su Provider */}
            <MusicPlayer />
          </div>
        </MusicPlaylistProvider>
      </MusicPlayerProvider>
    </BrowserRouter>
  );
};

export default App;

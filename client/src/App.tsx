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
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from "@cloudinary/react";

const App: React.FC = () => {
  const cld = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    },
  })


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
      <div id="app" className="flex">
        <div className="layout">
          <Analytics />
          <SpeedInsights />
          <CssBaseline />
          <Loglib config={config} />
          <Routing />
          <Footer isAdminLogin={false} />
        </div>
      </div>
    </BrowserRouter>

  );
};

export default App;

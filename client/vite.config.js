import MillionLint from '@million/lint';
import million from 'million/compiler';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';
import compression from 'vite-plugin-compression';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // million.vite({
    //   auto: true,
    // }),
    // MillionLint.vite({
    //   enabled: true
    // }),
    react(), compression({
      brotli: true, // Enable Brotli compression
      gzip: true,    // Enable gzip compression
    })],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['lodash', 'lodash-es'],
  },  
  server: {
    configureServer: (server) => {
      server.middlewares.use((req, res, next) => {
        // Establecer cabeceras de seguridad
        res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
        res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' https://trusted.cdn.com;");
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()');
        res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');

        next();
      });
    },
    host: true,
    strictPort: true,
    cors: true,
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      input: 'src/main.tsx',
      assetFileNames:(assetInfo) => {
        if (assetInfo.name === '_headers' ) return '_headers';
        return assetInfo.name;
      },
      external: ['lodash', 'lodash-es'],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  test: {
    css: false,
    include: ['src/**/__tests__/*'],
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
    clearMocks: true,
  },
  base: './'
});

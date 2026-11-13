import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import * as path from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  server: {
    host: true,
    strictPort: true,
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    // Sin sourcemaps públicos: antes se publicaban 13 MB de código fuente.
    sourcemap: false,
    // Sin manualChunks a mano. El config anterior repartía las dependencias por
    // nombre de ruta y dejaba React en un chunk distinto del de los paquetes que
    // leen sus internals (use-sync-external-store, react-transition-group...).
    // Esos chunks inicializaban antes que React y reventaban con
    // "Cannot read properties of undefined (reading 'useSyncExternalStore')",
    // dejando TODA la página en blanco. Rollup ya conoce el grafo de
    // dependencias y ordena los chunks solo; los imports dinámicos del código
    // (secciones del home) siguen generando chunks por separado igual.
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
});

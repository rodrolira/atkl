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
    rollupOptions: {
      output: {
        // Separamos las librerías grandes para no servir un único vendor de 1 MB.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('@mui') || id.includes('@emotion')) return 'mui';
          if (id.includes('@fortawesome') || id.includes('react-icons') || id.includes('@iconify'))
            return 'icons';
          if (id.includes('framer-motion')) return 'motion';
          if (id.includes('i18next')) return 'i18n';
          if (id.includes('react-bootstrap') || id.includes('flowbite')) return 'ui';
          if (id.includes('formik') || id.includes('yup')) return 'forms';
          if (id.includes('react-dom') || id.includes('react-router') || id.includes('/react/'))
            return 'react';
          return 'vendor';
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
});

import MillionLint from '@million/lint';
import million from 'million/compiler';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import * as path from 'path';
import compression from 'vite-plugin-compression';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    million.vite({
      auto: true,
    }),
    MillionLint.vite({
      enabled: true
    }),
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
  server: {
    host: true,
    strictPort: true,
    cors: true,
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
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
});

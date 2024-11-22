import MillionLint from '@million/lint';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import * as path from 'path';
import compression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    MillionLint.vite(),
    react(),
    compression({
      brotli: true, // Enable Brotli compression
      gzip: true,    // Enable gzip compression
    })],
  server: {
    host: true,
    strictPort: true,
    //port: 8080,
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: [],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
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

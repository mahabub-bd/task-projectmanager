import tailwindcss from "@tailwindcss/vite";
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss(),],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 5000,
    proxy: {
      '/v1': {
        target: 'http://localhost:3000/v1/',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React ecosystem
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router/')) {
            return 'react-vendor';
          }
          // Redux and state management
          if (id.includes('node_modules/@reduxjs/') || id.includes('node_modules/react-redux/') || id.includes('node_modules/redux-persist/')) {
            return 'redux-vendor';
          }
          // UI libraries
          if (id.includes('node_modules/react-hook-form/') ||
            id.includes('node_modules/@hookform/') ||
            id.includes('node_modules/react-hot-toast/') ||
            id.includes('node_modules/lucide-react/')) {
            return 'ui-vendor';
          }
          // Date and utilities
          if (id.includes('node_modules/date-fns/') || id.includes('node_modules/zod/')) {
            return 'utils-vendor';
          }
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },
});

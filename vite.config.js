import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'public',
  publicDir: 'vendor',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'public/index.html')
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@config': path.resolve(__dirname, './src/config'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@js': path.resolve(__dirname, './src/js')
    }
  },
  server: {
    port: 8080,
    open: true
  }
});

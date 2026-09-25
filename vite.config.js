import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/lavoir.github.io/',
  plugins: [react()],
  server: {
    port: 3000,
    open: false
  }
});

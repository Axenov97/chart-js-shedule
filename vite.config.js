import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: "/chart-js-shedule",
  plugins: [react()],
  optimizeDeps: {exclude: ['js-big-decimal']}
});


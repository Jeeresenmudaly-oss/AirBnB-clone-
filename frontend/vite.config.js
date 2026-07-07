import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Public frontend runs on port 3000 in development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});

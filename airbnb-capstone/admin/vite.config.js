import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The admin app runs on port 3001 in
// with the public frontend (which will run on
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
  },
});

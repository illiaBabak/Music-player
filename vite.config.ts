import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import checker from 'vite-plugin-checker';
import react from '@vitejs/plugin-react';
import { ghPages } from 'vite-plugin-gh-pages';

export default defineConfig({
  base: '/Music-player',
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
  server: {
    open: true,
    port: 3000,
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  plugins: [react(), ghPages(), eslint(), checker({ typescript: true })],
  resolve: {
    alias: {
      src: '/src',
    },
  },
});

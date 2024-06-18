import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";
import checker from "vite-plugin-checker";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    outDir: "build",
    emptyOutDir: true,
  },
  server: {
    open: true,
    port: 3000,
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  plugins: [react(), eslint(), checker({ typescript: true })],
  resolve: {
    alias: {
      src: "/src",
    },
  },
});

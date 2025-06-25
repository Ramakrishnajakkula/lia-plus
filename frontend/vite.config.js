import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist" // Ensure this is set so Vercel can find the output directory
  },
  server: {
    host: "0.0.0.0"
  }
});

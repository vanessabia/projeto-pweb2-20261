import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

import moduleFederationConfig from "./module-federation.config.ts";

export default defineConfig({
  base: "http://localhost:5001/",

  server: {
    port: 5001,
    strictPort: true,
    origin: "http://localhost:5001",
  },

  preview: {
    port: 5001,
    strictPort: true,
  },

  plugins: [
    react(),
    federation(moduleFederationConfig),
  ],

  build: {
    target: "chrome89",
  },
});
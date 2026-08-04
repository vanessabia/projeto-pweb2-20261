import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

import moduleFederationConfig from "./module-federation.config";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    origin: "http://localhost:5173",
  },

  plugins: [
    react(),
    federation(moduleFederationConfig),
  ],

  build: {
    target: "chrome89",
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
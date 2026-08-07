import { createModuleFederationConfig } from "@module-federation/vite";

export default createModuleFederationConfig({
  name: "financas_webapp",

  remotes: {
    financas_summary_mfe: {
      type: "module",
      name: "financas_summary_mfe",
      entry: "http://localhost:5001/remoteEntry.js",
    },
  },

  shared: {
    react: {
      singleton: true,
    },
    "react/": {
      singleton: true,
    },
    "react-dom": {
      singleton: true,
    },
    "react-dom/": {
      singleton: true,
    },
  },
});
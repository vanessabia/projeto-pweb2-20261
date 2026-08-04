import { createModuleFederationConfig } from "@module-federation/vite";

export default createModuleFederationConfig({
  name: "financas_summary_mfe",
  filename: "remoteEntry.js",
  manifest: true,

  dts: false,

  exposes: {
    "./FinancialSummary":
      "./src/components/FinancialSummary/FinancialSummary.tsx",
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
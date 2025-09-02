import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./public/manifest.json";

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
    }),
    crx({ manifest }),
  ],
  build: {
    rollupOptions: {
      input: {
        popup: "src/extension/popup/popup.html",
        content: "src/extension/content/index.tsx",
        background: "src/extension/background/index.ts",
      },
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./public/manifest.json";
import path from "path";
import svgr from "vite-plugin-svgr";

export default defineConfig(() => {
  return {
    plugins: [
      react({
        jsxImportSource: "@emotion/react",
        babel: {
          plugins: [
            [
              "@emotion/babel-plugin",
              {
                autoLabel: "dev-only",
              },
            ],
          ],
        },
      }),
      crx({
        manifest,
      }),
      svgr(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@/assets": path.resolve(__dirname, "./src/assets"),
        "@shared": path.resolve(__dirname, "../shared/src"),
      },
    },
    build: {
      minify: "esbuild" as const, // 타입 명시
      target: "chrome90",
      sourcemap: false,
      outDir: "dist",
      emptyOutDir: true,
      assetsDir: "assets",
      rollupOptions: {
        output: {
          format: "es" as const,
        },
      },
    },
    base: "./",
    server: {
      port: 5173,
      open: false,
    },
  };
});

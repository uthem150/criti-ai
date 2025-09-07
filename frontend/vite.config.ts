import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import type { PluginOption } from 'vite';
import path from "path";

export default defineConfig(() => {
  // 환경 변수로 웹 빌드와 확장 프로그램 빌드 구분
  const isWebBuild = process.env.VITE_BUILD_MODE === 'web' || process.env.NODE_ENV === 'production';
  
  const plugins: PluginOption[] = [
    react({
      jsxImportSource: "@emotion/react",
    }),
  ];

  // Chrome Extension 플러그인은 웹 빌드가 아닐 때만 추가
  if (!isWebBuild) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const manifest = require("./public/manifest.json");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { crx } = require("@crxjs/vite-plugin");
      plugins.push(crx({ manifest }));
    } catch (error) {
      console.warn('Chrome Extension 플러그인 로드 실패, 웹 모드로 계속:', error);
    }
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@shared": path.resolve(__dirname, "../shared/src"),
      },
    },
    build: {
      minify: 'esbuild' as const,
      target: isWebBuild ? 'es2020' : 'chrome90', // 웹용과 확장용 타겟 구분
      sourcemap: false,
      outDir: 'dist',
      emptyOutDir: true,
      assetsDir: 'assets',
      rollupOptions: {
        input: isWebBuild ? {
          main: path.resolve(__dirname, 'index.html'),
          challenge: path.resolve(__dirname, 'challenge.html')
        } : undefined,
        output: {
          format: 'es' as const,
        }
      }
    },
    base: './',
    server: {
      port: 5173,
      open: false,
    },
  };
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        // Emotion babel 플러그인은 프로덕션 빌드에만 적용 (개발 속도 향상)
        plugins: mode === "production" ? ["@emotion/babel-plugin"] : [],
      },
    }),
    svgr(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/assets": path.resolve(__dirname, "./src/assets"),
      "@criti-ai/shared": path.resolve(__dirname, "../shared/src"),
    },
  },
  // 의존성 사전 번들링 최적화 (로딩 속도 개선)
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@emotion/react",
      "@emotion/styled",
      "react-youtube",
    ],
    // shared 패키지는 제외하여 항상 최신 상태 유지
    exclude: ["@criti-ai/shared"],
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          emotion: ["@emotion/react", "@emotion/styled"],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
    // HMR(Hot Module Replacement) 최적화
    hmr: {
      overlay: true, // 에러 오버레이 표시
    },
    // 파일 감시 설정 (핫 리로딩 개선)
    watch: {
      // shared 패키지 변경사항 감지
      ignored: ["!**/node_modules/@criti-ai/shared/**"],
      usePolling: false, // 성능을 위해 폴링 비활성화
    },
    // 상위 디렉토리 접근 허용 (shared 패키지)
    fs: {
      allow: [".."],
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    ),
  },
}));

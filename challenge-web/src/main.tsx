import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { GlobalStyles } from "./styles/globalStyles";
import { router } from "./routes/AppRouter";
import { ErrorBoundary } from "./components";
import { logger } from "./utils";

/**
 * Main Application Component (App)
 * 앱의 최상위 래퍼(Wrapper) 컴포넌트
 */
const App: React.FC = () => {
  return (
    // ErrorBoundary: 앱 전역 오류 처리
    // 자식 컴포넌트(GlobalStyles, Suspense, RouterProvider)에서
    // 렌더링 중 오류가 발생하면, 앱이 죽는 대신 ErrorBoundary의 UI를 보여줌
    <ErrorBoundary>
      {/* GlobalStyles: 전역 스타일 적용 */}
      {/* Reset CSS, 폰트, body 배경색 등 앱 전체에 적용될 스타일 */}
      <GlobalStyles />
      {/* RouterProvider: 라우팅 관리 */}
      {/* router 객체의 설정에 따라 현재 URL에 맞는 페이지 렌더링 */}
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

/**
 * Application Initialization (initializeApp)
 * 실제 앱을 DOM에 마운트하는 로직을 함수로 분리
 */
const initializeApp = (): void => {
  // public/index.html에서 id="root"인 div를 찾음
  const container = document.getElementById("root");

  if (!container) {
    logger.error("❌ Root container not found");
    return;
  }

  const root = ReactDOM.createRoot(container);

  // 생성된 root에 App 컴포넌트를 렌더링
  root.render(
    // React.StrictMode: 개발 모드에서 잠재적 문제를 감지하기 위한 래퍼
    // (e.g., 부수 효과 두 번 실행, deprecated API 사용 경고 등)
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  logger.info("✅ Criti.AI 웹앱 시작");
  logger.info("📍 환경:", import.meta.env.MODE);
};

// 앱 실행
initializeApp();

// Export for testing
export { App };

import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { GlobalStyles } from "./styles/globalStyles";
import { router } from "./routes/AppRouter";
import { ErrorBoundary, LoadingFallback } from "./components";

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

      {/* Suspense: 코드 스플리팅(Lazy Loading) 지원 */}
      {/* AppRouter 내부에서 lazy()로 불러오는 페이지가 로드될 때까지 
          fallback으로 LoadingFallback 컴포넌트(스피너)를 보여줌 */}
      <Suspense fallback={<LoadingFallback />}>
        {/* RouterProvider: 라우팅 관리 */}
        {/* router 객체의 설정에 따라 현재 URL에 맞는 페이지 렌더링 */}
        <RouterProvider router={router} />
      </Suspense>
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
    console.error("❌ Root container not found");
    return;
  }

  // React 18 방식으로 root를 생성
  const root = ReactDOM.createRoot(container);

  // 생성된 root에 App 컴포넌트를 렌더링
  root.render(
    // React.StrictMode: 개발 모드에서 잠재적 문제를 감지하기 위한 래퍼
    // (e.g., 부수 효과 두 번 실행, deprecated API 사용 경고 등)
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // 개발 환경(development mode)일 때만 콘솔에 로그를 출력
  // (import.meta.env.DEV는 Vite 환경 변수)
  if (import.meta.env.DEV) {
    console.log("✅ Criti.AI 웹앱 시작");
    console.log("📍 환경:", import.meta.env.MODE);
  }
};

// 4. 앱 실행
initializeApp();

// Export for testing
export { App };

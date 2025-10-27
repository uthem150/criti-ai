import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ChallengePage } from './pages/ChallengePage'
import YoutubeAnalysisPage from './pages/YoutubeAnalysisPage'

// 전역 스타일 리셋
const globalStyles = `
  *, *::before, *::after {
    box-sizing: border-box;
  }
  
  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    line-height: 1.5;
    color: #111827;
    background-color: #f9fafb;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }
  
  #root {
    min-height: 100vh;
    width: 100%;
  }
  
  /* 접근성 개선 */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  
  /* 포커스 스타일 */
  *:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  
  /* 선택 스타일 */
  ::selection {
    background-color: #bfdbfe;
    color: #1e40af;
  }
`;

// 전역 스타일 주입
const styleSheet = document.createElement('style');
styleSheet.textContent = globalStyles;
document.head.appendChild(styleSheet);

// 메인 앱 컴포넌트
export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChallengePage />} />
        <Route path="/youtube" element={<YoutubeAnalysisPage />} />
      </Routes>
    </BrowserRouter>
  );
};

// React 앱 마운트
const container = document.getElementById('root');
if (container) {
  // 기존 로딩 상태 제거
  container.innerHTML = '';
  
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
  
  console.log('✅ Criti.AI Challenge 웹앱 시작');
} else {
  console.error('❌ Root container not found');
  // 에러 상황 대비
  document.body.innerHTML = `
    <div style="
      display: flex; 
      align-items: center; 
      justify-content: center; 
      height: 100vh; 
      flex-direction: column; 
      gap: 1rem; 
      color: #dc2626;
      font-family: system-ui;
    ">
      <h1>앱 로딩 실패</h1>
      <p>root 요소를 찾을 수 없습니다.</p>
      <button onclick="window.location.reload()" style="
        padding: 0.75rem 1.5rem; 
        background: #3b82f6; 
        color: white; 
        border: none; 
        border-radius: 0.375rem; 
        cursor: pointer;
        font-size: 1rem;
      ">
        새로고침
      </button>
    </div>
  `;
}

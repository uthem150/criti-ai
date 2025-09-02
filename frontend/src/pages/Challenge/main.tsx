import { createRoot } from 'react-dom/client';
import { ChallengePage } from './ChallengePage';

// CSS 초기화 및 기본 스타일
const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    line-height: 1.6;
    color: #111827;
    background-color: #f9fafb;
    overflow-x: hidden;
  }

  #challenge-root {
    min-height: 100vh;
  }

  /* 스크롤바 스타일링 */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  ::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  /* 선택 영역 스타일링 */
  ::selection {
    background-color: #0ea5e9;
    color: white;
  }
`;

// 전역 스타일 주입
const styleElement = document.createElement('style');
styleElement.textContent = globalStyles;
document.head.appendChild(styleElement);

// 로딩 화면 제거
const loadingElement = document.getElementById('loading');
if (loadingElement) {
  loadingElement.style.display = 'none';
}

// React 앱 마운트
const container = document.getElementById('challenge-root');
if (container) {
  const root = createRoot(container);
  
  const handleNavigateBack = () => {
    // 크롬 확장 프로그램으로 돌아가기 (새 탭 닫기)
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.close();
    }
  };

  root.render(<ChallengePage onNavigateBack={handleNavigateBack} />);
} else {
  console.error('챌린지 루트 엘리먼트를 찾을 수 없습니다.');
}

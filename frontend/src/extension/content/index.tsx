import { createRoot } from 'react-dom/client';
import { ContentScriptApp } from '../../components/ContentScriptApp';

// CSS 스타일을 직접 주입
const injectCSS = () => {
  const css = `
    /* 크리티 AI 사이드바 기본 스타일 */
    #criti-ai-sidebar {
      all: initial;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
    }

    /* 플로팅 버튼 스타일 */
    #criti-ai-toggle-button {
      position: fixed;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #0ea5e9, #0284c7);
      border: none;
      border-radius: 50%;
      color: white;
      font-size: 24px;
      cursor: pointer;
      z-index: 999999;
      box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #criti-ai-toggle-button:hover {
      transform: translateY(-50%) scale(1.1);
      box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
    }

    /* 하이라이트 스타일 */
    .criti-ai-highlight {
      position: relative;
    }

    .criti-ai-highlight-bias {
      background-color: rgba(245, 158, 11, 0.2) !important;
      border-bottom: 2px solid #f59e0b !important;
    }

    .criti-ai-highlight-fallacy {
      background-color: rgba(239, 68, 68, 0.2) !important;
      border-bottom: 2px solid #ef4444 !important;
    }

    .criti-ai-highlight-manipulation {
      background-color: rgba(168, 85, 247, 0.2) !important;
      border-bottom: 2px solid #a855f7 !important;
    }

    /* 툴팁 스타일 */
    .criti-ai-tooltip {
      position: absolute !important;
      background: #1f2937 !important;
      color: white !important;
      padding: 8px 12px !important;
      border-radius: 6px !important;
      font-size: 14px !important;
      max-width: 300px !important;
      z-index: 1000000 !important;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
    }
  `;
  
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};

// Content Script 진입점
console.log('🔍 크리티 AI Content Script 로드됨');

// 뉴스 사이트 감지
const isNewsArticle = (): boolean => {
  const indicators = [
    'article',
    '[role="main"]',
    '.article-content',
    '.news-content',
    '.post-content'
  ];
  
  return indicators.some(selector => document.querySelector(selector) !== null);
};

// 기사 내용 추출
const extractArticleContent = (): { title: string; content: string } => {
  const title = document.querySelector('h1')?.textContent?.trim() || 
                document.title;
  
  const contentSelectors = [
    'article',
    '.article-content',
    '.news-content', 
    '.post-content',
    '[role="main"]'
  ];
  
  let content = '';
  for (const selector of contentSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      content = element.textContent?.trim() || '';
      break;
    }
  }
  
  return { title, content };
};

// 플로팅 토글 버튼 생성
const createToggleButton = (onToggle: () => void) => {
  const button = document.createElement('button');
  button.id = 'criti-ai-toggle-button';
  button.innerHTML = '🔍';
  button.title = '크리티 AI - 뉴스 분석 (클릭하여 열기/닫기)';
  
  // 클릭 이벤트 추가 - 명시적으로 바인딩
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔍 플로팅 버튼 클릭!');
    onToggle();
  });
  
  document.body.appendChild(button);
  console.log('✅ 플로팅 버튼 생성 완료');
  return button;
};

// 사이드바 마운트
const mountSidebar = () => {
  // CSS 주입
  injectCSS();
  
  let sidebarVisible = false;
  let sidebarContainer: HTMLElement | null = null;
  let toggleButton: HTMLElement | null = null;

  const toggleSidebar = () => {
    console.log('🔄 사이드바 토글 시도, 현재 상태:', sidebarVisible);
    
    if (!sidebarContainer) {
      console.log('🏠 사이드바 최초 생성');
      // 사이드바 생성
      sidebarContainer = document.createElement('div');
      sidebarContainer.id = 'criti-ai-sidebar';
      sidebarContainer.style.cssText = `
        position: fixed;
        top: 0;
        right: -420px;
        width: 400px;
        height: 100vh;
        z-index: 1000000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        transition: right 0.3s ease-in-out;
        background: white;
        border-left: 1px solid #e5e7eb;
        box-shadow: -4px 0 6px rgba(0, 0, 0, 0.1);
        overflow-y: auto;
      `;
      
      document.body.appendChild(sidebarContainer);
      
      // React 컴포넌트 렌더링
      const root = createRoot(sidebarContainer);
      const articleData = extractArticleContent();
      
      console.log('📋 기사 데이터 추출:', {
        title: articleData.title,
        contentLength: articleData.content.length
      });
      
      root.render(
        <ContentScriptApp 
          url={window.location.href}
          title={articleData.title}
          content={articleData.content}
          onClose={() => {
            console.log('✖️ 사이드바 닫기 요청');
            toggleSidebar();
          }}
        />
      );
    }

    // 사이드바 토글
    sidebarVisible = !sidebarVisible;
    if (sidebarContainer) {
      sidebarContainer.style.right = sidebarVisible ? '0px' : '-420px';
      console.log('🔄 사이드바 상태 변경:', sidebarVisible ? '열림' : '닫힘');
    }
    
    // 버튼 아이콘 및 툴팁 변경
    if (toggleButton) {
      toggleButton.innerHTML = sidebarVisible ? '✕' : '🔍';
      toggleButton.title = sidebarVisible ? 
        '크리티 AI - 닫기' : 
        '크리티 AI - 뉴스 분석 (클릭하여 열기)';
      
      // 버튼 색상 변경
      if (sidebarVisible) {
        toggleButton.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        toggleButton.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
      } else {
        toggleButton.style.background = 'linear-gradient(135deg, #0ea5e9, #0284c7)';
        toggleButton.style.boxShadow = '0 4px 12px rgba(14, 165, 233, 0.3)';
      }
    }
  };

  // 토글 버튼 생성
  toggleButton = createToggleButton(toggleSidebar);
  console.log('🔄 전체 사이드바 시스템 초기화 완료');
};

// 페이지 로드 완료 후 실행
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (isNewsArticle()) {
      mountSidebar();
    }
  });
} else {
  if (isNewsArticle()) {
    mountSidebar();
  }
}

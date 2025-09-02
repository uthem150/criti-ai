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

// 사이드바 마운트
const mountSidebar = () => {
  // CSS 주입
  injectCSS();
  
  // 이미 존재하면 제거
  const existing = document.getElementById('criti-ai-sidebar');
  if (existing) existing.remove();

  // 사이드바 컨테이너 생성
  const container = document.createElement('div');
  container.id = 'criti-ai-sidebar';
  container.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 400px;
    height: 100vh;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  `;
  
  document.body.appendChild(container);
  
  // React 컴포넌트 렌더링
  const root = createRoot(container);
  const articleData = extractArticleContent();
  
  root.render(
    <ContentScriptApp 
      url={window.location.href}
      title={articleData.title}
      content={articleData.content}
    />
  );
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

import { createRoot } from 'react-dom/client';
import { ContentScriptApp } from './components/ContentScriptApp';

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

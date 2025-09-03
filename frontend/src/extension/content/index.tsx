import { createRoot } from "react-dom/client";
import { ContentScriptApp } from "../../components/ContentScriptApp";

// CSS 스타일을 직접 주입
const injectCSS = () => {
  const css = `
    /* Criti AI 전역 스타일 리셋 및 기본 설정 */
    #criti-ai-sidebar {
      all: initial;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif !important;
      font-size: 16px !important;
      line-height: 1.6 !important;
      color: #111827 !important;
      letter-spacing: -0.01em !important;
      box-sizing: border-box !important;
    }
    
    #criti-ai-sidebar *, 
    #criti-ai-sidebar *::before, 
    #criti-ai-sidebar *::after {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif !important;
      font-size: inherit !important;
      line-height: inherit !important;
      box-sizing: border-box !important;
    }
    
    /* 네이버 뉴스에서 적절한 글씨 크기 적용 */
    body[data-domain*="naver.com"] #criti-ai-sidebar,
    body[class*="naver"] #criti-ai-sidebar,
    #criti-ai-sidebar[data-enhanced="true"] {
      font-size: 17px !important;
    }
    
    /* 네이버 뉴스 특별 처리 */
    body[data-domain*="n.news.naver.com"] #criti-ai-sidebar,
    body[data-domain*="news.naver.com"] #criti-ai-sidebar {
      font-size: 17px !important;
    }

    /* 하이라이트 스타일 */
    .criti-ai-highlight {
      position: relative;
      cursor: pointer !important;
      padding: 1px 3px !important;
      border-radius: 3px !important;
      transition: all 0.2s ease !important;
    }
    
    .criti-ai-highlight:hover {
      transform: scale(1.02) !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
    }

    .criti-ai-highlight-bias {
      background-color: rgba(245, 158, 11, 0.3) !important;
      border-bottom: 2px solid #f59e0b !important;
      color: #92400e !important;
      font-weight: 600 !important;
    }

    .criti-ai-highlight-fallacy {
      background-color: rgba(239, 68, 68, 0.3) !important;
      border-bottom: 2px solid #ef4444 !important;
      color: #991b1b !important;
      font-weight: 600 !important;
    }

    .criti-ai-highlight-manipulation {
      background-color: rgba(168, 85, 247, 0.3) !important;
      border-bottom: 2px solid #a855f7 !important;
      color: #7c2d12 !important;
      font-weight: 600 !important;
    }

    /* 툴팁 스타일 개선 */
    .criti-ai-tooltip {
      position: fixed !important;
      background: linear-gradient(135deg, #1f2937, #374151) !important;
      color: white !important;
      padding: 12px 16px !important;
      border-radius: 12px !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      line-height: 1.5 !important;
      max-width: 320px !important;
      z-index: 1000000 !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      backdrop-filter: blur(20px) !important;
      animation: tooltipFadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    
    @keyframes tooltipFadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
};

// Content Script 진입점
console.log("🔍 Criti AI Content Script 로드됨");

// 컨텐츠 감지
const isAnalyzableContent = (): boolean => {
  const excludedDomains = [
    "chrome://",
    "chrome-extension://",
    "about:",
    "file://",
  ];

  const currentUrl = window.location.href;
  if (excludedDomains.some((domain) => currentUrl.startsWith(domain))) {
    return false;
  }

  const textContent = document.body.textContent?.trim() || "";
  return textContent.length > 100;
};

// 기사/컨텐츠 추출
const extractPageContent = (): { title: string; content: string } => {
  const titleSelectors = [
    "h1",
    ".article-title",
    ".news-title",
    ".post-title",
    '[data-testid="headline"]',
    ".title",
  ];

  let title = document.title;
  for (const selector of titleSelectors) {
    const element = document.querySelector(selector);
    if (element?.textContent?.trim()) {
      title = element.textContent.trim();
      break;
    }
  }

  const contentSelectors = [
    "article",
    ".article-content",
    ".news-content",
    ".post-content",
    ".entry-content",
    ".content",
    '[role="main"]',
    "main",
    ".main-content",
  ];

  let content = "";
  for (const selector of contentSelectors) {
    const element = document.querySelector(selector);
    if (element?.textContent?.trim()) {
      content = element.textContent.trim();
      break;
    }
  }

  if (content.length < 200) {
    content = document.body.textContent?.trim() || "";
  }

  return { title, content: content.substring(0, 2000) };
};

// 사이드바 마운트
const mountApp = () => {
  injectCSS();

  let sidebarVisible = false;
  let sidebarContainer: HTMLElement | null = null;

  const toggleSidebar = () => {
    console.log("🔄 사이드바 토글 시도, 현재 상태:", sidebarVisible);

    if (!sidebarContainer) {
      console.log("🏠 사이드바 최초 생성");
      sidebarContainer = document.createElement("div");
      sidebarContainer.id = "criti-ai-sidebar";

      const hostname = window.location.hostname.toLowerCase();
      const isNaverDomain = hostname.includes("naver.com");
      const isNaverNews =
        hostname.includes("n.news.naver.com") ||
        hostname.includes("news.naver.com");

      if (isNaverDomain || isNaverNews) {
        sidebarContainer.setAttribute("data-enhanced", "true");
        document.body.setAttribute("data-domain", hostname);
        console.log("📰 네이버 사이트 감지:", hostname);
      }

      const fontSize = isNaverNews || isNaverDomain ? "17px" : "16px";

      sidebarContainer.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        right: -420px !important;
        width: 400px !important;
        height: 100vh !important;
        z-index: 999998 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif !important;
        font-size: ${fontSize} !important;
        line-height: 1.6 !important;
        transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        background: white !important;
        border-left: 1px solid #e5e7eb !important;
        box-shadow: -8px 0 25px rgba(0, 0, 0, 0.15) !important;
        overflow-y: auto !important;
        transform: translateZ(0) !important;
      `;

      document.body.appendChild(sidebarContainer);

      const root = createRoot(sidebarContainer);
      const pageData = extractPageContent();

      console.log("📋 페이지 데이터 추출:", {
        title: pageData.title,
        contentLength: pageData.content.length,
        domain: hostname,
      });

      root.render(
        <ContentScriptApp
          url={window.location.href}
          title={pageData.title}
          content={pageData.content}
          onClose={() => {
            console.log("✖️ 사이드바 닫기 요청");
            closeSidebar();
          }}
        />
      );
    }

    if (!sidebarVisible) {
      openSidebar();
    } else {
      closeSidebar();
    }
  };

  const openSidebar = () => {
    console.log("🔓 사이드바 열기 시작");
    sidebarVisible = true;
    if (sidebarContainer) {
      requestAnimationFrame(() => {
        sidebarContainer!.style.right = "0px";
        console.log("🔄 사이드바 열림 상태: 열림");
      });
    }
  };

  const closeSidebar = () => {
    console.log("🔒 사이드바 닫기 시작");
    sidebarVisible = false;
    if (sidebarContainer) {
      requestAnimationFrame(() => {
        sidebarContainer!.style.right = "-420px";
        console.log("🔄 사이드바 닫힘 상태: 닫힘");
      });
    }
  };

  // 전역 범위에서 toggleSidebar 접근 가능하도록 설정
  interface CritiAIGlobal {
    critiAI: {
      toggleSidebar: () => void;
    };
  }

  // TypeScript 안전한 방식으로 window 객체 확장
  (window as unknown as CritiAIGlobal).critiAI = {
    toggleSidebar,
  };

  // popup에서의 메시지 리스너 추가
  chrome.runtime.onMessage.addListener(
    (
      request: { action: string },
      _sender,
      sendResponse: (response: { success: boolean }) => void
    ) => {
      if (request.action === "toggleSidebar") {
        console.log("📨 popup에서 사이드바 토글 요청 수신");
        toggleSidebar();
        sendResponse({ success: true });
        return true;
      }
    }
  );

  console.log("🔄 Criti AI 시스템 초기화 완료 - popup에서 사용 가능");
};

// 페이지 로드 완료 후 실행
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if (isAnalyzableContent()) {
      mountApp();
    }
  });
} else {
  if (isAnalyzableContent()) {
    mountApp();
  }
}

import { createRoot } from "react-dom/client";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ContentScriptApp } from "../../components/ContentScriptApp";
import { debugCommands } from "../../utils/debugUtils";

// Shadow DOM용 최소 CSS - reset + 폰트 격리
const getShadowCSS = () => `
  /* Shadow DOM 기본 reset + 폰트 격리 */
  :host {
    all: initial;
    display: block;
    /* 명시적 폰트 설정으로 외부 영향 차단 */
    font-family: 'Pretendard', Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #111827;
  }
  
  * {
    box-sizing: border-box !important;
    margin: 0;
    padding: 0;
    /* 모든 요소가 호스트 폰트를 상속받도록 */
    font-family: 'Pretendard', Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif !important;
  }

  /* 사이드바 기본 컨테이너 */
  .criti-ai-sidebar-container {
    position: fixed;
    top: 0;
    right: -420px;
    width: 420px;
    height: 100vh;
    z-index: 999999;
    background: #ffffff;
    border-left: 1px solid #E2E7EB;
    box-shadow: -12px 0 40px rgba(0, 0, 0, 0.15);
    overflow-y: auto;
    transition: right 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    padding: 0;
  }

  .criti-ai-sidebar-container.open {
    right: 0px;
  }

  /* 스크롤바 커스터마이징 */
  .criti-ai-sidebar-container::-webkit-scrollbar {
    width: 6px;
  }
  
  .criti-ai-sidebar-container::-webkit-scrollbar-track {
    background: #EEF0F2;
  }
  
  .criti-ai-sidebar-container::-webkit-scrollbar-thumb {
    background: #B0B8C1;
    border-radius: 3px;
  }
  
  .criti-ai-sidebar-container::-webkit-scrollbar-thumb:hover {
    background: #8B95A1;
  }
`;

// Content Script 진입점
console.log("🔍 Criti AI Content Script 로드됨 (Shadow DOM + Emotion 버전)");

// 전역에서 사용될 선택자 리스트
// '노이즈': 콘텐츠 추출을 방해하는 불필요한 요소
const NOISE_SELECTORS = [
  // 스크립트 및 스타일
  "script",
  "style",
  "noscript",
  "template",
  'link[rel="stylesheet"]',

  // 네비게이션 및 UI
  "nav",
  "header",
  "footer",
  ".navigation",
  ".nav",
  ".menu",
  ".header",
  ".footer",
  ".sidebar",
  ".breadcrumb",
  ".pagination",
  ".toolbar",

  // 광고 관련
  ".ad",
  ".ads",
  ".advertisement",
  ".adsense",
  ".adsbygoogle",
  ".banner",
  ".promotion",
  ".sponsored",
  ".affiliate",
  ".marketing",
  ".commercial",
  '[class*="ad-"]',
  '[class*="ads-"]',
  '[class*="banner-"]',
  '[class*="promo-"]',
  '[id*="ad"]',
  '[id*="google_ads"]',
  'iframe[src*="googlesyndication"]',

  // 소셜 및 공유
  ".social",
  ".share",
  ".sharing",
  ".sns",
  ".facebook",
  ".twitter",
  ".instagram",
  ".youtube",
  ".social-share",
  ".share-button",

  // 댓글 및 상호작용
  ".comment",
  ".comments",
  ".reply",
  ".replies",
  ".discussion",
  ".feedback",
  ".review",
  ".rating",
  ".vote",

  // 추천 및 관련
  ".related",
  ".recommendation",
  ".suggestion",
  ".more",
  ".similar",
  ".recommended",
  ".trending",
  ".popular",

  // 메타데이터
  ".tag",
  ".tags",
  ".category",
  ".metadata",
  ".byline",
  ".author-info",
  ".date",
  ".time",
  ".share-count",
  ".view-count",
  ".read-time",

  // 기타 노이즈
  ".popup",
  ".modal",
  ".overlay",
  ".tooltip",
  ".notification",
  ".cookie",
  ".privacy",
  ".legal",
  ".copyright",
  ".subscription",
];

// ============================================================================
// 웹페이지에 직접 주입되어 콘텐츠를 분석하고, 사이드바 UI 생성
//
// 1. 페이지의 제목과 본문 콘텐츠 추출
// 2. Shadow DOM 사용하여 기존 페이지의 CSS 및 JavaScript와 충돌 없이 사이드바 주입
// 3. 추출된 텍스트에 하이라이트와 툴 적용하고, 스크롤 이동 기능 제공
// ============================================================================

// ============================================================================
// 1. 콘텐츠 추출 모듈
// 웹페이지의 핵심 콘텐츠(제목, 본문) 추출
// ============================================================================

/**
 * 주어진 컨테이너에서 미리 정의된 노이즈 요소 제거
 * @param container - 노이즈 제거할 HTML Element 또는 Document 객체
 */
const removeNoiseElements = (container: Element | Document): void => {
  // 정의된 모든 노이즈 선택자를 순회하며 해당 요소들을 찾음
  NOISE_SELECTORS.forEach((selector) => {
    try {
      // querySelectorAll을 사용하여 해당 선택자에 맞는 모든 요소 가져옴
      const elements = container.querySelectorAll(selector);
      // 찾은 요소들을 하나씩 순회하며 제거
      elements.forEach((element) => {
        // 부모 노드가 존재하는지 확인하여 안전하게 제거
        if (element && element.parentNode) {
          element.remove(); // DOM에서 요소 제거하는 메서드
        }
      });
    } catch (error) {
      // 유효하지 않은 선택자가 있을 경우 에러를 발생시키지 않고 경고 출력
      console.warn(`노이즈 선택자 처리 실패: ${selector}`);
    }
  });

  // display:none, hidden 속성을 가진 숨겨진 요소들 추가로 제거
  const hiddenElements = container.querySelectorAll(
    '[style*="display:none"], [style*="display: none"], [hidden]'
  );
  hiddenElements.forEach((element) => {
    if (element && element.parentNode) {
      element.remove();
    }
  });
};

/**
 * 네이버 블로그 페이지에서 콘텐츠 추출
 * 네이버 블로그는 콘텐츠가 iframe 내부에 있어 특별한 접근 방식이 필요
 * @returns 추출된 제목과 본문 객체 또는 null
 */
const extractNaverBlogContent = async (): Promise<{
  title: string;
  content: string;
} | null> => {
  console.log("🔍 네이버 블로그 콘텐츠 추출 시도");

  // 네이버 블로그 본문이 담긴 iframe을 #mainFrame 선택자로 찾음
  const mainFrame = document.querySelector("#mainFrame") as HTMLIFrameElement;
  if (!mainFrame) {
    console.log("❌ 네이버 블로그 메인 프레임을 찾을 수 없음");
    return null;
  }

  try {
    // iframe 내부 DOM 문서에 접근
    const frameDocument =
      mainFrame.contentDocument || mainFrame.contentWindow?.document;
    if (!frameDocument) {
      console.log("❌ iframe 내부 문서에 접근할 수 없음");
      return null;
    }

    // 원본 문서에 직접 조작하면 페이지가 변경되므로, body를 복제하여 사용
    const clonedBody = frameDocument.body.cloneNode(true) as Element;

    // 복사본에서 불필요한 노이즈 요소들을 제거
    removeNoiseElements(clonedBody);
    console.log("네이버 블로그 노이즈 제거 완료");

    // 네이버 블로그 본문 내용을 찾기 위한 선택자 목록
    const blogSelectors = [
      ".se-main-container",
      ".se-component-content",
      ".se-text-paragraph",
      "#postViewArea",
      ".post-view",
      ".post_ct",
      "#post-view-content",
      ".se-viewer",
      ".content-area",
    ];

    // 제목 찾기 위한 선택자 목록
    const titleSelectors = [
      ".se-title-text",
      ".post_title",
      ".title_post",
      "#title_1",
      "h2.title",
      ".post-title",
    ];

    // 여러 제목 선택자 순회하며 유효한 제목을 찾음
    let title = "";
    for (const selector of titleSelectors) {
      // 복제된 문서와 원본 문서에서 제목 찾아봄
      const titleElement =
        clonedBody.querySelector(selector) ||
        frameDocument.querySelector(selector);
      // 요소가 존재하고 내용이 비어있지 않으면 제목으로 확정하고 반복 중단
      if (titleElement?.textContent?.trim()) {
        title = titleElement.textContent.trim();
        console.log("✅ 네이버 블로그 제목 발견:", title);
        break;
      }
    }

    // 본문 내용 찾기 위한 로직
    let content = "";
    let maxTextLength = 0;

    // 여러 본문 선택자 순회하며 가장 긴 텍스트 가진 요소를 찾음
    for (const selector of blogSelectors) {
      const elements = clonedBody.querySelectorAll(selector);
      if (elements.length > 0) {
        // NodeList 배열로 변환하고, 각 요소의 텍스트 추출
        const textArray = Array.from(elements)
          .map((el) => el.textContent?.trim() || "")
          // 짧은 텍스트는 노이즈일 가능성이 높으므로 20자 이상인 것만 필터링
          .filter((text) => text.length > 20);

        if (textArray.length > 0) {
          // 추출된 텍스트 배열을 개행 문자로 합침
          const combinedText = textArray.join("\n\n");
          // 현재까지 찾은 가장 긴 텍스트와 비교하여 더 길면 교체
          if (combinedText.length > maxTextLength) {
            maxTextLength = combinedText.length;
            content = combinedText;
            console.log(
              `✅ 네이버 블로그 콘텐츠 발견 (${selector}):`,
              content.length,
              "글자"
            );
          }
        }
      }
    }

    // 제목 찾지 못했다면 문서의 타이틀을 기본값으로 설정
    if (!title) {
      title = document.title || frameDocument.title || "네이버 블로그 포스트";
    }

    // 추출된 콘텐츠 길이가 50자 미만이면 콘텐츠가 불완전하다고 판단
    if (content.length < 50) {
      console.log("❌ 네이버 블로그 콘텐츠가 너무 짧음:", content.length);

      // 동적 로딩 위해 2초 대기 후 재시도
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 2차 시도: 다시 한번 본문 선택자들을 순회
      for (const selector of blogSelectors) {
        const elements = clonedBody.querySelectorAll(selector);
        if (elements.length > 0) {
          const textArray = Array.from(elements)
            .map((el) => el.textContent?.trim() || "")
            .filter((text) => text.length > 20);

          if (textArray.length > 0) {
            content = textArray.join("\n\n");
            console.log(
              `✅ 재시도로 네이버 블로그 콘텐츠 발견:`,
              content.length,
              "글자"
            );
            break;
          }
        }
      }
    }

    // 50자 이상이면 콘텐츠 반환. 최대 4000자로 제한.
    if (content.length >= 50) {
      return { title, content: content.substring(0, 4000) };
    } else {
      console.log("❌ 네이버 블로그 콘텐츠 추출 실패 - 내용이 부족함");
      return null;
    }
  } catch (error) {
    console.error("❌ 네이버 블로그 추출 중 오류:", error);
    return null;
  }
};

/**
 * 주어진 페이지가 분석 가능한 컨텐츠 포함하는지 확인
 * @returns 분석 가능 여부 (boolean)
 */
const isAnalyzableContent = async (): Promise<boolean> => {
  // 분석에서 제외할 도메인 목록
  const excludedDomains = [
    "chrome://",
    "chrome-extension://",
    "about:",
    "file://",
    "chrome-devtools://",
    "moz-extension://",
    "edge://",
    "safari-extension://",
  ];

  const currentUrl = window.location.href;
  // 현재 URL이 제외된 도메인으로 시작하는지 확인
  if (excludedDomains.some((domain) => currentUrl.startsWith(domain))) {
    console.log("❌ 제외된 도메인:", currentUrl);
    return false;
  }

  // 네이버 블로그 URL인 경우, 전용 추출 함수를 사용하여 콘텐츠를 확인
  if (currentUrl.includes("blog.naver.com")) {
    console.log("🔍 네이버 블로그 감지 - 특별 처리 시작");
    const naverContent = await extractNaverBlogContent();
    // 콘텐츠가 50자 이상이면 분석 가능하다고 판단
    if (naverContent && naverContent.content.length > 50) {
      console.log(
        "✅ 네이버 블로그 분석 가능:",
        naverContent.content.length,
        "글자"
      );
      return true;
    } else {
      console.log("❌ 네이버 블로그 콘텐츠 부족");
      return false;
    }
  }

  // 일반 페이지의 경우, body의 텍스트 콘텐츠 길이를 확인하여 분석 가능 여부를 판단
  const textContent = document.body.textContent?.trim() || "";
  const isValid = textContent.length > 30; // 30자 이상이면 유효하다고 판단

  console.log("📝 컨텐츠 체크:", {
    url: currentUrl,
    textLength: textContent.length,
    isValid: isValid,
  });

  return isValid;
};

/**
 * 일반 페이지에서 제목과 본문 콘텐츠 추출
 * 네이버 블로그 페이지인 경우 `extractNaverBlogContent` 호출
 * @returns 추출된 제목과 본문 객체.
 */
const extractPageContent = async (): Promise<{
  title: string;
  content: string;
}> => {
  console.log("📄 컨텐츠 추출 시작");

  // 네이버 블로그 페이지인지 확인하고, 그렇다면 전용 함수 호출
  if (window.location.href.includes("blog.naver.com")) {
    console.log("🔍 네이버 블로그 콘텐츠 추출 시도");
    const naverContent = await extractNaverBlogContent();
    if (naverContent) {
      console.log("네이버 블로그 콘텐츠 추출 성공");
      return naverContent;
    }
    console.log("네이버 블로그 추출 실패, 일반 방식으로 시도");
  }

  // 원본 DOM 변경하지 않기 위해 body 복제
  const clonedBody = document.body.cloneNode(true) as Element;

  // 복사된 DOM에서 노이즈 요소 제거
  removeNoiseElements(clonedBody);
  console.log("일반 페이지 노이즈 제거 완료");

  // 제목 찾기 위한 여러 선택자 목록
  const titleSelectors = [
    ".art_title",
    ".article_title",
    ".news_title",
    ".tit_view",
    "h1",
    ".article-title",
    ".post-title",
    ".entry-title",
    "[data-testid='headline']",
    ".title",
    ".headline",
    ".subject",
    ".article-header h1",
    ".content-title",
    ".main-title",
    ".page-title",
    ".story-title",
    "#articleTitle",
    ".title_text",
  ];

  // 기본 제목은 문서의 title로 설정
  let title = document.title;
  // 여러 선택자 순회하며 유효한 제목을 찾음
  for (const selector of titleSelectors) {
    const element = clonedBody.querySelector(selector);
    if (element?.textContent?.trim()) {
      const text = element.textContent.trim();
      if (text.length > 5 && text.length < 200) {
        title = text;
        console.log(`✅ 제목 발견 (${selector}):`, title.substring(0, 50));
        break;
      }
    }
  }

  // 본문 추출 - 우선순위 그룹별로 처리
  const priorityGroups = [
    {
      name: "우선순위 1 (구체적인 본문)",
      minLength: 800, // 이 그룹에서는 800자 이상이면 충분
      selectors: [
        ".news_txt",
        ".article_txt",
        ".article-content",
        ".news-content",
        ".post-content",
        ".entry-content",
        "#article-view-content-div",
        ".article_view",
        ".article-body",
        ".post-body",
        ".content-body",
        ".article-text",
        ".news-body",
        ".story-body",
      ],
    },
    {
      name: "우선순위 2 (일반 본문)",
      minLength: 1500, // 이 그룹은 더 긴 것만 선택 (노이즈 가능성)
      selectors: [
        ".content",
        ".main-content",
        "[role='main']",
        "main",
        ".detail-content",
        ".view-content",
        ".read-content",
      ],
    },
    {
      name: "우선순위 3 (넓은 범위)",
      minLength: 2000, // 가장 넓은 범위는 훨씬 긴 것만
      selectors: ["article"],
    },
  ];

  let content = "";
  let selectedInfo = { selector: "", length: 0, group: "" };

  // 각 우선순위 그룹을 순회
  for (const group of priorityGroups) {
    let groupMaxLength = 0;
    let groupContent = "";
    let groupSelector = "";

    // 그룹 내에서 가장 긴 콘텐츠 찾기
    for (const selector of group.selectors) {
      const element = clonedBody.querySelector(selector);
      if (element?.textContent?.trim()) {
        const text = cleanText(element.textContent);
        const textLength = text.length;

        if (textLength > groupMaxLength) {
          groupMaxLength = textLength;
          groupContent = text;
          groupSelector = selector;
          console.log(
            `📝 ${group.name} 후보 (${selector}):`,
            textLength,
            "글자"
          );
        }
      }
    }

    // 이 그룹에서 충분한 길이를 찾았으면 선택하고 종료
    if (groupMaxLength >= group.minLength) {
      content = groupContent;
      selectedInfo = {
        selector: groupSelector,
        length: groupMaxLength,
        group: group.name,
      };
      console.log(
        `✅ ${group.name}에서 선택:`,
        groupSelector,
        groupMaxLength,
        "글자"
      );
      break;
    }
  }

  // 모든 그룹에서 충분한 길이를 못 찾았지만 뭔가는 있으면 사용
  if (content.length < 200 && selectedInfo.length > 0) {
    console.log(
      `⚠️ 충분하지 않지만 최선의 선택:`,
      selectedInfo.selector,
      selectedInfo.length,
      "글자"
    );
  }

  // 여전히 부족하면 Intelligent 추출
  if (content.length < 200) {
    console.log("🤖 Intelligent 콘텐츠 추출 시도");
    content = intelligentExtract(clonedBody);
  }

  const finalContent = content.substring(0, 4000);

  console.log("📤 최종 콘텐츠:", {
    title: title.substring(0, 50),
    selectedSelector: selectedInfo.selector,
    contentLength: finalContent.length,
    preview: finalContent.substring(0, 150).replace(/\s+/g, " "),
  });

  return { title, content: finalContent };
};

/**
 * 텍스트 정제 - 과도한 공백/줄바꿈 제거
 */
const cleanText = (text: string): string => {
  return text
    .replace(/[\r\n]+/g, "\n") // 줄바꿈 통일
    .replace(/[ \t]+/g, " ") // 공백 통일
    .replace(/\n\s+/g, "\n") // 줄바꿈 후 공백 제거
    .replace(/\s+\n/g, "\n") // 줄바꿈 전 공백 제거
    .replace(/\n{3,}/g, "\n\n") // 연속 줄바꿈 최대 2개
    .trim();
};

const intelligentExtract = (container: Element): string => {
  const potentialElements = container.querySelectorAll(
    "p, div, section, article"
  );
  const candidates: Array<{ element: Element; score: number }> = [];

  Array.from(potentialElements).forEach((element) => {
    const text = element.textContent?.trim() || "";
    const textLength = text.length;
    const childCount = element.children.length;

    const density = childCount > 0 ? textLength / (childCount + 1) : textLength;

    if (element.tagName.match(/script|style|noscript/i)) return;

    if (textLength > 100 && density > 40) {
      candidates.push({ element, score: textLength * density });
    }
  });

  if (candidates.length === 0) return "";

  candidates.sort((a, b) => b.score - a.score);

  const extracted = candidates
    .slice(0, 5)
    .map(({ element }) => cleanText(element.textContent || ""))
    .filter((text) => text.length > 50)
    .join("\n\n");

  console.log("✅ Intelligent 추출 성공:", extracted.length, "글자");
  return extracted;
};

// ============================================================================
// 2. Shadow DOM 마운트 모듈
// 기존 페이지에 영향을 주지 않고 사이드바 삽입하는 로직
// ============================================================================

/**
 * Shadow DOM을 사용하여 사이드바를 페이지에 마운트
 */
const mountApp = () => {
  console.log("🏠 Shadow DOM 기반 앱 마운트 시작 (Emotion)");

  let sidebarVisible = false;
  let shadowHost: HTMLElement | null = null;
  let shadowRoot: ShadowRoot | null = null;
  let reactRoot: import("react-dom/client").Root | null = null;
  let emotionCache: ReturnType<typeof createCache> | null = null;

  // 사이드바의 표시/숨김 상태를 토글하는 함수
  const toggleSidebar = () => {
    console.log("🔄 사이드바 토글, 현재 상태:", sidebarVisible);

    // Shadow DOM이 아직 생성되지 않았다면, 생성 과정을 시작
    if (!shadowHost) {
      console.log("🌟 Shadow DOM 생성");

      // Shadow Host 역할을 할 div 요소를 생성
      shadowHost = document.createElement("div");
      shadowHost.id = "criti-ai-shadow-host";
      // 페이지의 다른 요소와 충돌하지 않도록 스타일 설정
      shadowHost.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        right: 0 !important;
        width: 0 !important;
        height: 0 !important;
        z-index: 999999 !important;
        pointer-events: none !important;
      `;
      document.body.appendChild(shadowHost);

      // Shadow Host에 Shadow Root 연결
      // `mode: "closed"`는 외부 JavaScript에서 Shadow DOM 내부에 접근할 수 없도록 해줌
      shadowRoot = shadowHost.attachShadow({ mode: "closed" });

      // 기본 CSS 주입
      const baseStyle = document.createElement("style");
      baseStyle.textContent = getShadowCSS();
      shadowRoot.appendChild(baseStyle);

      // Emotion 스타일 컨테이너 생성 (기본 CSS 다음에 추가)
      const emotionStyleContainer = document.createElement("div");
      emotionStyleContainer.id = "criti-ai-emotion-styles";
      shadowRoot.appendChild(emotionStyleContainer);

      // Emotion cache 생성 - Shadow DOM 전용 설정
      emotionCache = createCache({
        key: "criti-ai",
        container: emotionStyleContainer,
        speedy: false, // Shadow DOM에서 DOM 방식으로 스타일 주입 (스타일 시트가 명확히 생성되도록)
      });

      const sidebarContainer = document.createElement("div");
      sidebarContainer.className = "criti-ai-sidebar-container";
      sidebarContainer.style.pointerEvents = "auto";
      shadowRoot.appendChild(sidebarContainer);

      // React 앱을 컨테이너에 마운트
      reactRoot = createRoot(sidebarContainer);

      // 페이지 데이터를 추출하고 React 앱을 렌더링
      extractPageContent().then((pageData) => {
        if (reactRoot && emotionCache) {
          reactRoot.render(
            <CacheProvider value={emotionCache}>
              <ContentScriptApp
                url={window.location.href}
                title={pageData.title}
                content={pageData.content}
                sidebarVisible={sidebarVisible}
                onClose={() => {
                  console.log("✖️ 사이드바 닫기 요청");
                  closeSidebar();
                }}
              />
            </CacheProvider>
          );
        }
      });
    }

    // Shadow DOM 이미 생성되어 있다면, 단순히 사이드바를 열거나 닫음
    if (!sidebarVisible) {
      openSidebar();
    } else {
      closeSidebar();
    }
  };

  const openSidebar = () => {
    console.log("🔓 사이드바 열기");
    sidebarVisible = true;
    if (shadowRoot) {
      const container = shadowRoot.querySelector(".criti-ai-sidebar-container");
      if (container) {
        // CSS 클래스 추가하여 사이드바 보이게 함 (CSS 애니메이션으로 처리)
        container.classList.add("open");
      }
    }
    // React 컴포넌트 상태 업데이트해서 UI 갱신
    updateReactAppState();
  };

  const closeSidebar = () => {
    console.log("🔒 사이드바 닫기 및 하이라이트 제거");
    sidebarVisible = false;

    // 사이드바 닫기 애니메이션
    if (shadowRoot) {
      const container = shadowRoot.querySelector(".criti-ai-sidebar-container");
      if (container) {
        // CSS 클래스를 제거하여 사이드바 숨김
        container.classList.remove("open");
      }
    }

    // 사이드바가 닫힐 때 페이지의 모든 하이라이트 제거
    clearAllHighlights();

    // React 상태 업데이트하여 UI 갱신
    updateReactAppState();
  };

  // React 앱의 상태(props) 업데이트하는 함수
  const updateReactAppState = () => {
    if (reactRoot && emotionCache) {
      // 최신 페이지 데이터를 다시 추출하여 props 갱신
      extractPageContent().then((pageData) => {
        if (reactRoot && emotionCache) {
          reactRoot.render(
            <CacheProvider value={emotionCache}>
              <ContentScriptApp
                url={window.location.href}
                title={pageData.title}
                content={pageData.content}
                sidebarVisible={sidebarVisible}
                onClose={() => {
                  console.log("✖️ 사이드바 닫기 요청");
                  closeSidebar();
                }}
              />
            </CacheProvider>
          );
        }
      });
    }
  };

  // ============================================================================
  // 3. 하이라이트 및 스크롤 모듈
  // 하이라이트 요소 관리하고, 스크롤 이동 기능을 제공하는 로직
  // ============================================================================

  // 하이라이트된 요소 ID와 함께 저장하는 Map
  const highlightElements = new Map<string, HTMLElement>();
  // 현재 활성화된 툴팁 요소 저장하는 Set
  const activeTooltips = new Set<HTMLElement>();
  // 메모리 누수 방지를 위해 추가된 이벤트 리스너들 추적하는 Set
  const eventListeners = new Set<() => void>();

  // 페이지 언로드 시 모든 리소스 정리하는 함수입니다.
  const cleanupResources = () => {
    console.log("🧹 리소스 정리 시작");

    // 모든 이벤트 리스너 제거
    eventListeners.forEach((cleanup) => {
      try {
        cleanup();
      } catch (error) {
        console.warn("⚠️ 이벤트 리스너 정리 실패:", error);
      }
    });
    eventListeners.clear();

    // 모든 툴팁 DOM에서 제거
    activeTooltips.forEach((tooltip) => {
      if (tooltip.parentNode) {
        tooltip.remove();
      }
    });
    activeTooltips.clear();

    // 하이라이트 요소 맵 정리
    highlightElements.clear();

    console.log("✅ 리소스 정리 완료");
  };

  /**
   * 주어진 ID 가진 하이라이트 요소로 스크롤
   * @param highlightId - 스크롤할 하이라이트 요소의 ID.
   */
  const scrollToHighlight = (highlightId: string): void => {
    console.log("🎯 스크롤 요청:", highlightId);
    // 맵에서 ID로 요소 찾음
    const element = highlightElements.get(highlightId);
    if (element) {
      // `scrollIntoView` 메서드 사용하여 요소로 스크롤
      element.scrollIntoView({
        behavior: "smooth", // 부드러운 스크롤 효과
        block: "center", // 화면 중앙에 오도록 스크롤
        inline: "nearest",
      });

      // 스크롤 후 일시적인 강조 효과 주기 위해 클래스 추가
      element.classList.add("criti-ai-highlight-focused");
      setTimeout(() => {
        element.classList.remove("criti-ai-highlight-focused");
      }, 2000); // 2초 후 클래스 제거

      console.log("✅ 스크롤 완료:", highlightId);
    } else {
      console.log("❌ 하이라이트 요소를 찾을 수 없음:", highlightId);
    }
  };

  /**
   * 페이지에 있는 모든 하이라이트, 툴팁 제거
   */
  const clearAllHighlights = (): void => {
    console.log("🗑️ 모든 하이라이트 제거 시작");

    // 메인 문서에 있는 툴팁 제거
    const tooltips = document.querySelectorAll(".criti-ai-tooltip");
    tooltips.forEach((tooltip) => {
      activeTooltips.delete(tooltip as HTMLElement);
      tooltip.remove();
    });

    // 메인 문서에 있는 하이라이트 요소 제거하고 원래 텍스트로 되돌림
    const highlights = document.querySelectorAll(".criti-ai-highlight");
    highlights.forEach((element) => {
      const parent = element.parentNode;
      if (parent) {
        // 하이라이트된 텍스트 노드로 요소 대체
        parent.replaceChild(
          document.createTextNode(element.textContent || ""),
          element
        );
        // DOM 트리 정리
        parent.normalize();
      }
    });

    // 네이버 블로그 iframe 내부 하이라이트 제거
    if (window.location.href.includes("blog.naver.com")) {
      const mainFrame = document.querySelector(
        "#mainFrame"
      ) as HTMLIFrameElement;
      if (mainFrame && mainFrame.contentDocument) {
        try {
          // iframe 내부의 툴팁과 하이라이트를 위와 동일한 방식으로 제거
          const frameTooltips =
            mainFrame.contentDocument.querySelectorAll(".criti-ai-tooltip");
          frameTooltips.forEach((tooltip) => {
            activeTooltips.delete(tooltip as HTMLElement);
            tooltip.remove();
          });

          const frameHighlights = mainFrame.contentDocument.querySelectorAll(
            ".criti-ai-highlight"
          );
          frameHighlights.forEach((element) => {
            const parent = element.parentNode;
            if (parent) {
              parent.replaceChild(
                mainFrame.contentDocument!.createTextNode(
                  element.textContent || ""
                ),
                element
              );
              parent.normalize();
            }
          });

          console.log("✅ iframe 하이라이트 제거 완료");
        } catch (error) {
          // 보안 제한으로 인해 iframe에 접근할 수 없는 경우 처리
          console.log("⚠️ iframe 하이라이트 제거 실패 (보안 제한):", error);
        }
      }
    }

    // 모든 맵과 셋 초기화
    highlightElements.clear();
    activeTooltips.clear();

    console.log("✅ 모든 하이라이트 제거 완료");
  };

  /**
   * 특정 텍스트를 포함하는 하이라이트 요소로 스크롤
   * @param text - 찾고자 하는 텍스트.
   * @param type - 하이라이트 타입 (예: 'bias')
   * @returns 스크롤 성공 여부 (boolean)
   */
  const scrollToHighlightByText = (text: string, type?: string): boolean => {
    console.log("🔍 텍스트로 하이라이트 찾기:", text, type);

    // 저장된 맵에서 텍스트를 포함하는 요소를 찾음
    for (const [id, element] of highlightElements) {
      const elementText = element.textContent?.trim() || "";
      const isTextMatch =
        elementText.includes(text) || text.includes(elementText);
      const isTypeMatch = !type || id.includes(type);

      if (isTextMatch && isTypeMatch) {
        scrollToHighlight(id); // 찾으면 스크롤 함수 호출하고 true 반환
        return true;
      }
    }

    // 맵에서 찾지 못했을 경우, 직접 DOM에서 모든 하이라이트 검색하는 대체(fallback) 로직
    const allHighlights = document.querySelectorAll(".criti-ai-highlight");
    for (const highlight of allHighlights) {
      const highlightText = highlight.textContent?.trim() || "";
      const isTextMatch =
        highlightText.includes(text) || text.includes(highlightText);
      const isTypeMatch =
        !type || highlight.className.includes(`criti-ai-highlight-${type}`);

      if (isTextMatch && isTypeMatch) {
        // 찾으면 스크롤하고 강조 효과 줌
        highlight.scrollIntoView({ behavior: "smooth", block: "center" });
        highlight.classList.add("criti-ai-highlight-focused");
        setTimeout(() => {
          highlight.classList.remove("criti-ai-highlight-focused");
        }, 2000);
        console.log("✅ Fallback 스크롤 성공");
        return true;
      }
    }

    console.log("❌ 해당 텍스트의 하이라이트를 찾을 수 없음");
    return false;
  };

  // ============================================================================
  // 4. 메시지 및 전역 인터페이스
  // 확장 프로그램의 다른 부분과 통신하고, 디버깅 위한 인터페이스 제공
  // ============================================================================

  // 전역 `window` 객체에 `critiAI`라는 객체를 정의하여 외부에서 접근할 수 있게 함
  interface CritiAIGlobal {
    critiAI: {
      toggleSidebar: () => void;
      isReady: boolean;
      highlightElements: Map<string, HTMLElement>;
      scrollToHighlight: (highlightId: string) => void;
      clearAllHighlights: () => void;
      scrollToHighlightByText: (text: string, type?: string) => boolean;
      cleanupResources: () => void;
      version: string;
    };
  }

  (window as unknown as CritiAIGlobal).critiAI = {
    toggleSidebar,
    isReady: true,
    highlightElements,
    scrollToHighlight,
    clearAllHighlights,
    scrollToHighlightByText,
    cleanupResources,
    version: "2.0.0-emotion",
  };

  // 확장 프로그램의 팝업(popup)이나 백그라운드 스크립트에서 보낸 메시지 수신
  chrome.runtime.onMessage.addListener(
    (
      request: { action: string },
      _sender,
      sendResponse: (response: { success: boolean; ready?: boolean }) => void
    ) => {
      console.log("📨 메시지 수신:", request);

      // 'ping' 액션: 콘텐츠 스크립트가 준비되었는지 확인하는 용도
      if (request.action === "ping") {
        console.log("📡 Ping 요청 - Content Script 준비 상태 확인");
        sendResponse({ success: true, ready: true });
        return true;
      }

      // 'toggleSidebar' 액션: 팝업에서 사이드바 토글 요청할 때 사용
      if (request.action === "toggleSidebar") {
        console.log("📨 Popup에서 사이드바 토글 요청");
        try {
          toggleSidebar();
          sendResponse({ success: true });
        } catch (error) {
          console.error("❌ 사이드바 토글 실패:", error);
          sendResponse({ success: false });
        }
        return true;
      }

      // 정의되지 않은 액션에 대한 기본 응답
      sendResponse({ success: false });
      return true;
    }
  );

  console.log("✅ Shadow DOM + Emotion 기반 Criti AI 시스템 초기화 완료");
};

// ============================================================================
// 5. CSS 주입 및 초기화
// 하이라이트 스타일을 페이지에 주입하고, 전체 애플리케이션 시작
// ============================================================================

// 하이라이트 및 툴팁 스타일을 정의하는 함수
// `!important`를 사용하여 기존 페이지 스타일 덮어씀
const getOptimizedHighlightCSS = () => `
  /* 하이라이트 기본 스타일 */
  .criti-ai-highlight {
    position: relative !important;
    cursor: pointer !important;
    padding: 2px 4px !important;
    border-radius: 4px !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    z-index: 999990 !important;
    display: inline !important;
    line-height: inherit !important;
    font-family: inherit !important;
    font-size: inherit !important;
    text-decoration: none !important;
    border: none !important;
    outline: none !important;
    box-sizing: border-box !important;
  }
  
  .criti-ai-highlight:hover {
    transform: scale(1.02) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
    filter: brightness(1.1) !important;
  }

  /* 편향성 하이라이트 */
  .criti-ai-highlight-bias {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(251, 191, 36, 0.35)) !important;
    border-bottom: 2px solid #FAB007 !important;
    color: #92400e !important;
    font-weight: 600 !important;
  }
  
  .criti-ai-highlight-bias:hover {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.4), rgba(251, 191, 36, 0.5)) !important;
  }

  /* 논리적 오류 하이라이트 */
  .criti-ai-highlight-fallacy {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(248, 113, 113, 0.35)) !important;
    border-bottom: 2px solid #FF5E5E !important;
    color: #CC3030 !important;
    font-weight: 600 !important;
  }
  
  .criti-ai-highlight-fallacy:hover {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.4), rgba(248, 113, 113, 0.5)) !important;
  }

  /* 감정 조작 하이라이트 */
  .criti-ai-highlight-manipulation {
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(196, 181, 253, 0.35)) !important;
    border-bottom: 2px solid #a855f7 !important;
    color: #6b21a8 !important;
    font-weight: 600 !important;
  }
  
  .criti-ai-highlight-manipulation:hover {
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(196, 181, 253, 0.5)) !important;
  }

  /* 광고성 하이라이트 */
  .criti-ai-highlight-advertisement {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(52, 211, 153, 0.35)) !important;
    border-bottom: 2px solid #00B29A !important;
    color: #065f46 !important;
    font-weight: 600 !important;
  }
  
  .criti-ai-highlight-advertisement:hover {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.4), rgba(52, 211, 153, 0.5)) !important;
  }

  /* 핵심 주장 하이라이트 */
  .criti-ai-highlight-claim {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(147, 197, 253, 0.35)) !important;
    border-bottom: 2px solid #6B8AFF !important;
    color: #1e40af !important;
    font-weight: 500 !important;
  }
  
  .criti-ai-highlight-claim:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(147, 197, 253, 0.5)) !important;
  }

  /* 포커스 효과 */
  .criti-ai-highlight-focused {
    animation: critiHighlightPulse 2s ease-in-out !important;
    transform: scale(1.05) !important;
    z-index: 999999 !important;
    position: relative !important;
  }
  
  @keyframes critiHighlightPulse {
    0% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.8);
      background-color: rgba(59, 130, 246, 0.5);
    }
    50% {
      box-shadow: 0 0 0 15px rgba(59, 130, 246, 0.3);
      background-color: rgba(59, 130, 246, 0.7);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
    }
  }

  /* 툴팁 스타일 */
  .criti-ai-tooltip {
    position: fixed !important;
    background: linear-gradient(135deg, #1f2937, #374151) !important;
    color: white !important;
    padding: 16px 20px !important;
    border-radius: 12px !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    line-height: 1.5 !important;
    max-width: 350px !important;
    z-index: 1000000 !important;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.35) !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    backdrop-filter: blur(20px) !important;
    animation: critiTooltipFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    pointer-events: none !important;
    user-select: none !important;
    word-wrap: break-word !important;
    white-space: normal !important;
  }
  
  @keyframes critiTooltipFadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  /* 다크 모드 지원 */
  @media (prefers-color-scheme: dark) {
    .criti-ai-highlight {
      filter: brightness(1.2) !important;
    }
    
    .criti-ai-tooltip {
      background: linear-gradient(135deg, #191F2B, #191F2B) !important;
      border-color: rgba(255, 255, 255, 0.2) !important;
    }
  }
  
  /* 모바일 최적화 */
  @media (max-width: 768px) {
    .criti-ai-highlight {
      padding: 1px 2px !important;
    }
    
    .criti-ai-tooltip {
      max-width: 280px !important;
      font-size: 13px !important;
      padding: 12px 16px !important;
    }
  }
`;

// 하이라이트 CSS를 메인 문서와 iframe에 주입하는 함수
const injectHighlightCSS = () => {
  const cssText = getOptimizedHighlightCSS();

  // 1. 메인 문서에 스타일 주입
  if (!document.getElementById("criti-ai-highlight-styles")) {
    const style = document.createElement("style");
    style.id = "criti-ai-highlight-styles";
    style.textContent = cssText;
    document.head.appendChild(style);
    console.log("✅ 메인 문서에 하이라이트 CSS 주입 완료");
  }

  // 2. 네이버 블로그 iframe에 스타일 주입 (동적 로딩 대응)
  if (window.location.href.includes("blog.naver.com")) {
    const iframe = document.querySelector("#mainFrame") as HTMLIFrameElement;
    if (iframe) {
      // 즉시 CSS 주입 시도
      const injectFrameCSS = () => {
        try {
          const frameDocument = iframe.contentDocument;
          if (
            frameDocument &&
            !frameDocument.getElementById("criti-ai-highlight-styles")
          ) {
            const frameStyle = frameDocument.createElement("style");
            frameStyle.id = "criti-ai-highlight-styles";
            frameStyle.textContent = cssText;
            frameDocument.head.appendChild(frameStyle);
            console.log("✅ 네이버 블로그 iframe에 CSS 주입 성공");
            return true;
          }
        } catch (e) {
          console.log("⚠️ iframe CSS 주입 실패 (보안 제한):", e);
          return false;
        }
        return false;
      };

      // 즉시 시도하고, iframe 로드 이벤트에도 리스너 추가
      injectFrameCSS();

      // iframe 로드 이벤트
      iframe.addEventListener("load", injectFrameCSS);

      // 혹시 로드가 지연될 경우를 대비해 반복적으로 주입 시도
      let retryCount = 0;
      const maxRetries = 10;
      const retryInjection = () => {
        if (retryCount >= maxRetries) return;

        if (!injectFrameCSS()) {
          retryCount++;
          setTimeout(retryInjection, 500);
        }
      };

      setTimeout(retryInjection, 1000);
    }
  }
};

/**
 * 전체 애플리케이션의 초기화 함수
 * 페이지 로드 상태를 확인하여 적절한 시점에 실행됨
 */
const initialize = async () => {
  // 페이지가 분석 가능한지 확인
  const canAnalyze = await isAnalyzableContent();

  if (canAnalyze) {
    // 분석 가능하면 CSS를 주입하고 앱을 마운트
    injectHighlightCSS();
    mountApp();
    console.log("🎉 Criti AI 초기화 완료 - 분석 가능한 페이지");
  } else {
    // 분석 불가능한 페이지에서도 'ping' 메시지에는 응답할 수 있도록 리스너 설정
    chrome.runtime.onMessage.addListener(
      (
        request: { action: string },
        _sender,
        sendResponse: (response: {
          success: boolean;
          ready?: boolean;
          reason?: string;
        }) => void
      ) => {
        if (request.action === "ping") {
          console.log("📡 분석 불가능한 페이지에서 Ping 응답");
          sendResponse({
            success: false,
            ready: false,
            reason: "not_analyzable", // 분석 불가능한 이유 알려줌
          });
          return true;
        }
        sendResponse({ success: false });
        return true;
      }
    );
    console.log("⚠️ 분석 불가능한 페이지 - Criti AI 대기 모드");
  }
};

// DOM이 완전히 로드되면 `initialize` 함수 실행
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize(); // 이미 로드되었다면 즉시 실행합
}

// ============================================================================
// 6. 동적 페이지 변화 감지
// SPA 환경(URL이 바뀌어도 페이지가 새로고침되지 않는)을 지원하기 위한 로직
// ============================================================================
let lastUrl = window.location.href;
let pageObserver: MutationObserver | null = null;
let frameObserver: MutationObserver | null = null;
let cleanupTimeout: NodeJS.Timeout | null = null;

// MutationObserver를 정리하는 함수. 메모리 누수 방지.
const cleanupObservers = () => {
  console.log("📊 관찰자 정리 시작");

  if (pageObserver) {
    pageObserver.disconnect();
    pageObserver = null;
  }

  if (frameObserver) {
    frameObserver.disconnect();
    frameObserver = null;
  }

  if (cleanupTimeout) {
    clearTimeout(cleanupTimeout);
    cleanupTimeout = null;
  }

  console.log("✅ 관찰자 정리 완료");
};

// MutationObserver를 설정하는 함수
const setupObservers = () => {
  cleanupObservers();

  // URL 변화를 감지하는 MutationObserver
  pageObserver = new MutationObserver(async (mutations) => {
    // 현재 URL이 이전과 다르면 페이지가 변경된 것으로 판단
    if (lastUrl !== window.location.href) {
      lastUrl = window.location.href;
      console.log("🔄 페이지 URL 변화 감지, 재초기화");
      // 기존 리소스를 정리하고,
      if (window.critiAI?.cleanupResources) {
        window.critiAI.cleanupResources();
      }
      // 1초 후 재초기화하여 페이지가 안정화될 시간 줌
      cleanupTimeout = setTimeout(initialize, 1000);
      return;
    }

    // 네이버 블로그와 같은 동적 컨테이너 변화 감지
    if (window.location.href.includes("blog.naver.com")) {
      const hasContentChanges = mutations.some((mutation) =>
        Array.from(mutation.addedNodes).some(
          (node) =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node as Element).querySelector &&
            ((node as Element).querySelector(".se-main-container") ||
              (node as Element).querySelector(".se-component-content") ||
              (node as Element).matches(
                ".se-main-container, .se-component-content"
              ))
        )
      );
      if (hasContentChanges) {
        console.log("🔄 네이버 블로그 컨테이너 변화 감지");
        // 하이라이트 재적용 로직은 TextHighlighter에서 처리
      }
    }
  });

  // `document.body`의 자식 요소 추가/제거 관찰
  pageObserver.observe(document.body, {
    childList: true, // 자식 노드 변경 감지
    subtree: true, // 하위 트리 전체 변경 감지
    attributes: false,
    characterData: false,
  });

  // 네이버 블로그 iframe 내부의 변화 감지
  if (window.location.href.includes("blog.naver.com")) {
    const mainFrame = document.querySelector("#mainFrame") as HTMLIFrameElement;
    if (mainFrame) {
      const setupFrameObserver = () => {
        try {
          if (mainFrame.contentDocument && !frameObserver) {
            frameObserver = new MutationObserver(() => {
              console.log("🔄 네이버 블로그 iframe 컨테이너 변화 감지");
            });

            frameObserver.observe(mainFrame.contentDocument.body, {
              childList: true,
              subtree: true,
              attributes: false,
              characterData: false,
            });

            console.log("✅ iframe 관찰자 설정 완료");
          }
        } catch (error) {
          console.log("⚠️ iframe 관찰 설정 실패 (보안 제한):", error);
        }
      };

      // 즉시 시도 및 load 이벤트
      setupFrameObserver();
      mainFrame.addEventListener("load", setupFrameObserver);
    }
  }
};

// 페이지가 로드되면 관찰자 설정 시작
setupObservers();

// 페이지가 언로드될 때 모든 리소스 정리
window.addEventListener("beforeunload", () => {
  console.log("📊 페이지 언로드 - 리소스 정리");
  cleanupObservers();
  if (window.critiAI?.cleanupResources) {
    window.critiAI.cleanupResources();
  }
});

// 개발 모드에서 디버깅 위한 전역 객체 추가
if (typeof process !== "undefined" && process.env?.NODE_ENV === "development") {
  // `debugCommands` 객체는 다른 파일에 정의되어 있다고 가정
  (window as Window & { critiAIDebug?: typeof debugCommands }).critiAIDebug =
    debugCommands;
  console.log("🔧 개발자 도구 활성화: window.critiAIDebug");
} else {
  // 프로덕션 환경에서는 최소한의 디버깅 기능만 제공
  (
    window as Window & { critiAIDebug?: Partial<typeof debugCommands> }
  ).critiAIDebug = {
    version: debugCommands.version,
    diagnose: debugCommands.diagnose,
    checkHighlights: debugCommands.checkHighlights,
  };
}

// Background Script - API 프록시 및 확장 프로그램 관리
console.log("🚀 Criti AI Background Script 시작");

// 환경변수에서 백엔드 URL 가져오기
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
console.log('🔗 Backend URL:', BACKEND_URL);

// 타입 정의
interface LegacyAnalyzeRequest {
  action: "analyze";
  url: string;
  content: string;
  title: string;
}

interface ApiProxyRequest {
  type: "API_PROXY";
  url: string;
  endpoint: string;
  method?: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
}

interface HealthCheckRequest {
  type: "HEALTH_CHECK";
}

type BackgroundRequest =
  | LegacyAnalyzeRequest
  | ApiProxyRequest
  | HealthCheckRequest;

interface BackgroundResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  status?: number;
}

type SendResponseFunction = (response: BackgroundResponse) => void;

// 타입 가드 함수들
const isLegacyAnalyzeRequest = (
  request: BackgroundRequest
): request is LegacyAnalyzeRequest => {
  return "action" in request && request.action === "analyze";
};

const isApiProxyRequest = (
  request: BackgroundRequest
): request is ApiProxyRequest => {
  return "type" in request && request.type === "API_PROXY";
};

const isHealthCheckRequest = (
  request: BackgroundRequest
): request is HealthCheckRequest => {
  return "type" in request && request.type === "HEALTH_CHECK";
};

// 설치 시 실행
chrome.runtime.onInstalled.addListener(() => {
  console.log("📦 Criti AI 확장 프로그램 설치 완료");
});

// 확장 프로그램 아이콘 클릭 시
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    // Content script 주입 (필요한 경우)
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
  }
});

// Content Script와의 메시지 통신 처리
chrome.runtime.onMessage.addListener(
  (request: BackgroundRequest, _sender, sendResponse) => {
    console.log(
      "📨 메시지 수신:",
      isLegacyAnalyzeRequest(request)
        ? request.action
        : (request as ApiProxyRequest | HealthCheckRequest).type
    );

    // 기존 analyze 방식 유지
    if (isLegacyAnalyzeRequest(request)) {
      handleLegacyAnalyze(request, sendResponse);
      return true;
    }

    // 새로운 API 프록시 방식
    if (isApiProxyRequest(request)) {
      handleApiProxy(request, sendResponse);
      return true;
    }

    // 헬스 체크
    if (isHealthCheckRequest(request)) {
      handleHealthCheck(sendResponse);
      return true;
    }
  }
);

// 기존 analyze 핸들러 (역호환성)
async function handleLegacyAnalyze(
  request: LegacyAnalyzeRequest,
  sendResponse: SendResponseFunction
): Promise<void> {
  try {
    console.log("🔄 레거시 분석 요청 처리");

    const response = await fetch(`${BACKEND_URL}/api/analysis/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: request.url,
          content: request.content,
          title: request.title,
        }),
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      sendResponse({ success: true, data: data.data });
    } else {
      throw new Error(data.error || "API 에러");
    }
  } catch (error) {
    console.error("❌ 레거시 분석 에러:", error);
    sendResponse({
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
    });
  }
}

// 새로운 API 프록시 핸들러
async function handleApiProxy(
  request: ApiProxyRequest,
  sendResponse: SendResponseFunction
): Promise<void> {
  try {
    console.log("🔄 API 프록시 요청 처리:", request.endpoint);

    const response = await fetch(request.url, {
      method: request.method || "GET",
      headers: request.headers || {
        "Content-Type": "application/json",
      },
      body: request.body ? JSON.stringify(request.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ API 프록시 응답 성공");

    sendResponse({
      success: true,
      data: data,
      status: response.status,
    });
  } catch (error) {
    console.error("❌ API 프록시 에러:", error);

    sendResponse({
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
      status: 0,
    });
  }
}

// 헬스 체크 핸들러
async function handleHealthCheck(
  sendResponse: SendResponseFunction
): Promise<void> {
  try {
    console.log("🚑 헬스 체크 시작");
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();

    console.log("✅ 헬스 체크 성공:", data);
    sendResponse({
      success: true,
      data: data,
      status: response.status,
    });
  } catch (error) {
    console.error("❌ 헬스 체크 에러:", error);
    sendResponse({
      success: false,
      error: "백엔드 서버에 연결할 수 없습니다",
      status: 0,
    });
  }
}

// 탭 변경 감지 (선택적 기능)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    // 뉴스 사이트에서만 아이콘 활성화
    const isNewsPage =
      /\/(news|article|story)/i.test(tab.url) ||
      /(news|joongang|chosun|hankyoreh|hani)/i.test(tab.url);

    if (isNewsPage) {
      chrome.action.setBadgeText({ tabId, text: "✓" });
      chrome.action.setBadgeBackgroundColor({ tabId, color: "#0ea5e9" });
    } else {
      chrome.action.setBadgeText({ tabId, text: "" });
    }
  }
});

export {};

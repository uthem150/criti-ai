/**
 * 디버깅 및 진단을 위한 유틸리티 함수들
 * 디버깅 도구
 */

export interface CritiAIDebugInfo {
  version: string;
  sidebarState: boolean;
  highlightsCount: number;
  activeTooltips: number;
  memoryUsage: {
    highlightElements: number;
    eventListeners: number;
  };
  pageInfo: {
    url: string;
    domain: string;
    isNaverBlog: boolean;
    hasIframe: boolean;
  };
  performance: {
    initTime: number;
    lastHighlightTime: number;
  };
}

/**
 * Criti AI 시스템의 현재 상태를 진단
 */
export const diagnoseSystem = (): CritiAIDebugInfo => {
  const critiAI = window.critiAI;
  
  const highlightsCount = document.querySelectorAll('.criti-ai-highlight').length;
  const activeTooltips = document.querySelectorAll('.criti-ai-tooltip').length;
  
  const isNaverBlog = window.location.href.includes('blog.naver.com');
  const iframe = document.querySelector('#mainFrame') as HTMLIFrameElement;
  
  let iframeHighlights = 0;
  if (isNaverBlog && iframe?.contentDocument) {
    try {
      iframeHighlights = iframe.contentDocument.querySelectorAll('.criti-ai-highlight').length;
    } catch (error) {
      console.log('⚠️ iframe 접근 실패:', error);
    }
  }
  
  return {
    version: critiAI?.version || 'unknown',
    sidebarState: critiAI?.isReady || false,
    highlightsCount: highlightsCount + iframeHighlights,
    activeTooltips,
    memoryUsage: {
      highlightElements: critiAI?.highlightElements?.size || 0,
      eventListeners: 0 // 추적이 어려움
    },
    pageInfo: {
      url: window.location.href,
      domain: window.location.hostname,
      isNaverBlog,
      hasIframe: !!iframe
    },
    performance: {
      initTime: performance.now(),
      lastHighlightTime: 0
    }
  };
};

/**
 * 하이라이트 시스템 상태 확인
 */
export const checkHighlightSystem = (): {
  status: 'ok' | 'warning' | 'error';
  issues: string[];
  suggestions: string[];
} => {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Criti AI 시스템 확인
  if (!window.critiAI) {
    issues.push('Criti AI 전역 객체가 초기화되지 않음');
    suggestions.push('페이지를 새로고침하거나 확장 프로그램을 재시작하세요');
  }
  
  // CSS 스타일 확인
  const styleElement = document.getElementById('criti-ai-highlight-styles');
  if (!styleElement) {
    issues.push('하이라이트 CSS가 주입되지 않음');
    suggestions.push('Content Script 초기화를 확인하세요');
  }
  
  // 네이버 블로그 특별 확인
  if (window.location.href.includes('blog.naver.com')) {
    const iframe = document.querySelector('#mainFrame') as HTMLIFrameElement;
    if (!iframe) {
      issues.push('네이버 블로그 메인 프레임을 찾을 수 없음');
    } else if (!iframe.contentDocument) {
      issues.push('iframe 내부에 접근할 수 없음 (보안 제한 가능성)');
      suggestions.push('네이버 블로그에서 CORS 정책으로 인해 제한될 수 있습니다');
    } else {
      const frameStyleElement = iframe.contentDocument.getElementById('criti-ai-highlight-styles');
      if (!frameStyleElement) {
        issues.push('iframe 내부에 CSS가 주입되지 않음');
        suggestions.push('iframe CSS 주입 재시도가 필요할 수 있습니다');
      }
    }
  }
  
  // 하이라이트 요소 확인
  const highlights = document.querySelectorAll('.criti-ai-highlight');
  if (highlights.length === 0) {
    suggestions.push('분석을 실행하여 하이라이트를 생성하세요');
  }
  
  let status: 'ok' | 'warning' | 'error' = 'ok';
  if (issues.length > 0) {
    status = issues.some(issue => issue.includes('초기화되지 않음') || issue.includes('접근할 수 없음')) ? 'error' : 'warning';
  }
  
  return { status, issues, suggestions };
};

/**
 * 메모리 사용량 모니터링
 */
export const monitorMemoryUsage = (): {
  jsHeapSize: number;
  highlightElements: number;
  domNodes: number;
  recommendations: string[];
} => {
  // 메모리 정보 안전하게 접근
  const memInfo = (performance as Performance & {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }).memory;
  
  const recommendations: string[] = [];
  
  const highlightElements = document.querySelectorAll('.criti-ai-highlight').length;
  const domNodes = document.querySelectorAll('*').length;
  
  if (highlightElements > 100) {
    recommendations.push('하이라이트 요소가 많습니다. 페이지 성능에 영향을 줄 수 있습니다.');
  }
  
  if (memInfo && memInfo.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
    recommendations.push('메모리 사용량이 높습니다. 리소스 정리를 고려하세요.');
  }
  
  return {
    jsHeapSize: memInfo?.usedJSHeapSize || 0,
    highlightElements,
    domNodes,
    recommendations
  };
};

/**
 * 개발자용 콘솔 명령어들
 */
export const debugCommands = {
  // 시스템 진단
  diagnose: () => {
    const info = diagnoseSystem();
    console.group('🔍 Criti AI 시스템 진단');
    console.table(info);
    console.groupEnd();
    return info;
  },
  
  // 하이라이트 시스템 체크
  checkHighlights: () => {
    const result = checkHighlightSystem();
    console.group('🎨 하이라이트 시스템 상태');
    console.log('상태:', result.status);
    if (result.issues.length > 0) {
      console.warn('문제점:', result.issues);
    }
    if (result.suggestions.length > 0) {
      console.info('제안사항:', result.suggestions);
    }
    console.groupEnd();
    return result;
  },
  
  // 메모리 사용량 체크
  checkMemory: () => {
    const memory = monitorMemoryUsage();
    console.group('💾 메모리 사용량');
    console.table(memory);
    console.groupEnd();
    return memory;
  },
  
  // 모든 하이라이트 제거 (테스트용)
  clearHighlights: () => {
    if (window.critiAI?.clearAllHighlights) {
      window.critiAI.clearAllHighlights();
      console.log('✅ 모든 하이라이트 제거 완료');
    } else {
      console.error('❌ clearAllHighlights 함수를 찾을 수 없음');
    }
  },
  
  // 리소스 정리 (테스트용)
  cleanup: () => {
    if (window.critiAI?.cleanupResources) {
      window.critiAI.cleanupResources();
      console.log('✅ 리소스 정리 완료');
    } else {
      console.error('❌ cleanupResources 함수를 찾을 수 없음');
    }
  },
  
  // 버전 정보
  version: () => {
    console.log('Criti AI Version:', window.critiAI?.version || 'unknown');
    return window.critiAI?.version;
  }
};

// 개발 모드에서 전역으로 노출
if (process.env.NODE_ENV === 'development') {
  (window as Window & { critiAIDebug?: typeof debugCommands }).critiAIDebug = debugCommands;
  console.log('🛠️ 개발자 도구가 활성화되었습니다. window.critiAIDebug 사용 가능');
}

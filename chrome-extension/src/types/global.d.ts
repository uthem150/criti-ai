// 전역 Window 인터페이스 확장
declare global {
  interface Window {
    critiAI?: {
      // 기본 기능
      toggleSidebar: () => void;
      isReady: boolean;
      version: string;
      
      // 하이라이트 관리
      highlightElements: Map<string, HTMLElement>;
      scrollToHighlight: (highlightId: string) => void;
      clearAllHighlights: () => void;
      
      // 하이라이트 텍스트로 스크롤
      scrollToHighlightByText: (text: string, type?: string) => boolean;
      
      // 리소스 관리
      cleanupResources: () => void;
    };
  }
}

// 빈 export로 모듈로 만들기
export {};
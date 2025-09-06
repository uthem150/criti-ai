import React, { useEffect, useRef, useCallback } from 'react';
import type { HighlightedText } from '@shared/types';

interface TextHighlighterProps {
  highlights: HighlightedText[];
  onHighlightClick: (highlight: HighlightedText) => void;
}

interface ExtendedHighlightedText extends HighlightedText {
  id: string;
}

export const TextHighlighter: React.FC<TextHighlighterProps> = ({
  highlights,
  onHighlightClick,
}) => {
  const appliedHighlights = useRef<Set<string>>(new Set());
  const highlightElements = useRef<Map<string, HTMLElement>>(new Map());

  // 방어적 코딩: highlights 유효성 검사
  const safeHighlights = React.useMemo(() => {
    if (!highlights || !Array.isArray(highlights)) {
      return [];
    }
    return highlights
      .filter(h => h && h.text && h.explanation && h.text.trim().length >= 3)
      .map((h, index): ExtendedHighlightedText => ({ 
        ...h, 
        id: `highlight-${index}-${h.type}-${h.text.substring(0, 10)}` 
      }));
  }, [highlights]);

  console.log('🎨 TextHighlighter:', safeHighlights.length, '개 하이라이트');

  

  // 본문 영역 선택자들
  const getContentSelectors = () => [
    'article',
    '.article-content', '.news-content', '.post-content', '.entry-content',
    '.content', '.main-content', '[role="main"]', 'main',
    '.article-body', '.story-body', '.post-body', '.content-body',
    '.article-text', '.news-body', '.detail-content', '.view-content',
    '.read-content', '.txt_content', '.se-main-container',
    // 네이버 블로그 등 추가 선택자
    '.se-component-content', '.se-text-paragraph', '#postViewArea',
    '.post-view', '.post_ct', '#post-view-content', '.se-viewer'
  ];

  // 하이라이트 요소 생성
  const createHighlightElement = useCallback(
    (highlight: ExtendedHighlightedText): HTMLElement => {
      const span = document.createElement('span');
      span.className = `criti-ai-highlight criti-ai-highlight-${highlight.type}`;
      span.textContent = highlight.text;
      span.dataset.highlightId = highlight.id;
      span.dataset.explanation = highlight.explanation;
      span.dataset.type = highlight.type;
      span.dataset.category = highlight.category || '';
      span.title = `${highlight.type}: ${highlight.explanation}`;

      // 클릭 이벤트
      span.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('🎯 하이라이트 클릭:', highlight.text);
        onHighlightClick(highlight);
      });

      // 툴팁 이벤트
      let tooltip: HTMLElement | null = null;
      
      span.addEventListener('mouseenter', () => {
        // 기존 툴팁 제거
        document.querySelectorAll('.criti-ai-tooltip').forEach(t => t.remove());

        // 새 툴팁 생성
        tooltip = document.createElement('div');
        tooltip.className = 'criti-ai-tooltip';
        tooltip.innerHTML = `
          <div style="font-weight: 600; margin-bottom: 4px;">
            ${highlight.type === 'bias' ? '🎭 편향성' :
              highlight.type === 'fallacy' ? '🧠 논리적 오류' :
              highlight.type === 'manipulation' ? '💥 감정 조작' :
              highlight.type === 'advertisement' ? '🎯 광고성' :
              highlight.type === 'claim' ? '📋 주장' : '⚠️ 분석'}
          </div>
          <div>${highlight.explanation}</div>
          <div style="margin-top: 6px; font-size: 11px; opacity: 0.8;">💡 클릭하여 상세보기</div>
        `;

        document.body.appendChild(tooltip);

        // 툴팁 위치 계산
        const rect = span.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 12;
        
        // 화면 경계 조정
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
          left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
          top = rect.bottom + 12;
        }
        
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;

        // 페이드인 애니메이션
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(5px)';
        tooltip.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        
        requestAnimationFrame(() => {
          if (tooltip) {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
          }
        });
      });

      span.addEventListener('mouseleave', () => {
        if (tooltip && tooltip.parentNode) {
          tooltip.style.opacity = '0';
          tooltip.style.transform = 'translateY(-5px)';
          setTimeout(() => {
            if (tooltip && tooltip.parentNode) {
              tooltip.remove();
            }
          }, 200);
          tooltip = null;
        }
      });

      return span;
    },
    [onHighlightClick]
  );

  // 텍스트 노드에서 하이라이트 적용
  const applyHighlightToTextNode = useCallback(
    (textNode: Text, searchText: string, highlightElement: HTMLElement): boolean => {
      const nodeText = textNode.textContent || '';
      const searchIndex = nodeText.indexOf(searchText);

      if (searchIndex === -1) return false;

      try {
        const beforeText = nodeText.substring(0, searchIndex);
        const afterText = nodeText.substring(searchIndex + searchText.length);

        const parent = textNode.parentNode;
        if (!parent) return false;

        // DOM 교체
        if (beforeText) {
          parent.insertBefore(document.createTextNode(beforeText), textNode);
        }
        parent.insertBefore(highlightElement, textNode);
        if (afterText) {
          parent.insertBefore(document.createTextNode(afterText), textNode);
        }
        parent.removeChild(textNode);

        return true;
      } catch (error) {
        console.error('❌ 하이라이트 적용 오류:', error);
        return false;
      }
    },
    []
  );

  // 네이버 블로그 iframe 감지 및 접근
  const getNaverBlogFrame = useCallback((): Document | null => {
    if (!window.location.href.includes('blog.naver.com')) return null;
    
    const mainFrame = document.querySelector('#mainFrame') as HTMLIFrameElement;
    if (!mainFrame) return null;
    
    try {
      return mainFrame.contentDocument || mainFrame.contentWindow?.document || null;
    } catch (error) {
      console.log('⚠️ iframe 접근 실패 (보안 제한):', error);
      return null;
    }
  }, []);
  
  // iframe에 하이라이트 CSS 주입
  const injectIframeCSS = useCallback((frameDocument: Document) => {
    if (frameDocument.getElementById('criti-ai-highlight-styles')) return;
    
    const cssText = `
      .criti-ai-highlight {
        position: relative !important;
        cursor: pointer !important;
        padding: 1px 3px !important;
        border-radius: 3px !important;
        transition: all 0.2s ease !important;
        z-index: 999990 !important;
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

      .criti-ai-highlight-advertisement {
        background-color: rgba(16, 185, 129, 0.3) !important;
        border-bottom: 2px solid #10b981 !important;
        color: #065f46 !important;
        font-weight: 600 !important;
      }
      
      .criti-ai-highlight-focused {
        animation: highlightPulse 2s ease-in-out !important;
        transform: scale(1.05) !important;
        z-index: 999999 !important;
        position: relative !important;
      }
      
      @keyframes highlightPulse {
        0% {
          box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.8);
          background-color: rgba(59, 130, 246, 0.5);
        }
        50% {
          box-shadow: 0 0 0 10px rgba(59, 130, 246, 0.3);
          background-color: rgba(59, 130, 246, 0.7);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
        }
      }
    `;
    
    const style = frameDocument.createElement('style');
    style.id = 'criti-ai-highlight-styles';
    style.textContent = cssText;
    frameDocument.head.appendChild(style);
    console.log('✅ iframe CSS 주입 성공');
  }, []);
  
  // iframe용 하이라이트 요소 생성 (먼저 선언)
  const createIframeHighlightElement = useCallback(
    (highlight: ExtendedHighlightedText, frameDocument: Document): HTMLElement => {
      const span = frameDocument.createElement('span');
      span.className = `criti-ai-highlight criti-ai-highlight-${highlight.type}`;
      span.textContent = highlight.text;
      span.dataset.highlightId = highlight.id;
      span.dataset.explanation = highlight.explanation;
      span.dataset.type = highlight.type;
      span.dataset.category = highlight.category || '';
      span.title = `${highlight.type}: ${highlight.explanation}`;

      // 클릭 이벤트 (iframe용)
      span.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('🎯 iframe 하이라이트 클릭:', highlight.text);
        onHighlightClick(highlight);
      });

      return span;
    },
    [onHighlightClick]
  );

  
  // 개선된 removeExistingHighlights - getNaverBlogFrame 사용 가능
  const removeExistingHighlightsWithFrame = useCallback(() => {
    // 메인 문서에서 하이라이트 제거
    const existingHighlights = document.querySelectorAll('.criti-ai-highlight');
    existingHighlights.forEach((el) => {
      const parent = el.parentNode;
      if (parent && el.textContent) {
        const textNode = document.createTextNode(el.textContent);
        parent.replaceChild(textNode, el);
        parent.normalize();
      }
    });
    
    // 네이버 블로그 iframe에서 하이라이트 제거
    const frameDocument = getNaverBlogFrame();
    if (frameDocument) {
      const frameHighlights = frameDocument.querySelectorAll('.criti-ai-highlight');
      frameHighlights.forEach((el) => {
        const parent = el.parentNode;
        if (parent && el.textContent) {
          const textNode = frameDocument.createTextNode(el.textContent);
          parent.replaceChild(textNode, el);
          parent.normalize();
        }
      });
      console.log('✅ iframe 하이라이트 제거 완료');
    }
    
    // 툴팁 제거
    document.querySelectorAll('.criti-ai-tooltip').forEach(tooltip => tooltip.remove());
    
    appliedHighlights.current.clear();
    highlightElements.current.clear();
    console.log('✅ 모든 하이라이트 제거 완료');
  }, [getNaverBlogFrame]);

  // 컨테이너에서 텍스트 검색 및 하이라이트
  const highlightTextInContainer = useCallback(
    (container: Element, highlight: ExtendedHighlightedText, documentContext: Document = document): boolean => {
      const walker = documentContext.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const text = node.textContent?.trim() || '';
            const parent = node.parentElement;
            
            if (!parent || 
                parent.classList.contains('criti-ai-highlight') ||
                parent.tagName.match(/SCRIPT|STYLE|NOSCRIPT/i) ||
                text.length < 10) {
              return NodeFilter.FILTER_REJECT;
            }
            
            return text.includes(highlight.text) 
              ? NodeFilter.FILTER_ACCEPT 
              : NodeFilter.FILTER_REJECT;
          }
        }
      );

      const textNode = walker.nextNode() as Text;
      if (!textNode) return false;

      // iframe 환경에서는 특별한 하이라이트 요소 생성
      const highlightElement = documentContext === document 
        ? createHighlightElement(highlight)
        : createIframeHighlightElement(highlight, documentContext);
        
      const success = applyHighlightToTextNode(textNode, highlight.text, highlightElement);
      
      if (success) {
        highlightElements.current.set(highlight.id, highlightElement);
        appliedHighlights.current.add(highlight.id);
        console.log('✅ 하이라이트 적용:', highlight.text, documentContext === document ? '(메인)' : '(iframe)');
      }
      
      return success;
    },
    [createHighlightElement, applyHighlightToTextNode, createIframeHighlightElement]
  );

  // 모든 하이라이트 적용 (개선된 버전)
  const applyAllHighlights = useCallback(() => {
    const contentSelectors = getContentSelectors();
    
    safeHighlights.forEach((highlight) => {
      if (appliedHighlights.current.has(highlight.id)) return;

      let found = false;
      
      // 일반 페이지에서 하이라이트 적용
      for (const selector of contentSelectors) {
        const containers = document.querySelectorAll(selector);
        
        for (const container of containers) {
          if (highlightTextInContainer(container, highlight, document)) {
            found = true;
            break;
          }
        }
        
        if (found) break;
      }

      // 네이버 블로그 iframe 처리
      if (!found) {
        const frameDocument = getNaverBlogFrame();
        if (frameDocument) {
          // iframe에 CSS 주입
          injectIframeCSS(frameDocument);
          
          // iframe 컨테이너들에서 하이라이트 시도
          for (const selector of contentSelectors) {
            const containers = frameDocument.querySelectorAll(selector);
            
            for (const container of containers) {
              if (highlightTextInContainer(container, highlight, frameDocument)) {
                found = true;
                break;
              }
            }
            
            if (found) break;
          }
          
          // 네이버 블로그 전용 선택자들도 시도
          if (!found) {
            const naverSpecificSelectors = [
              '.se-main-container',
              '.se-component-content', 
              '.se-text-paragraph',
              '.se-section-text',
              '#postViewArea',
              '.post_ct',
              '.se-viewer .se-main-container'
            ];
            
            for (const selector of naverSpecificSelectors) {
              const containers = frameDocument.querySelectorAll(selector);
              for (const container of containers) {
                if (highlightTextInContainer(container, highlight, frameDocument)) {
                  found = true;
                  break;
                }
              }
              if (found) break;
            }
          }
        }
      }

      if (!found) {
        console.log('❌ 하이라이트 텍스트를 찾을 수 없음:', highlight.text);
      }
    });
  }, [safeHighlights, highlightTextInContainer, getNaverBlogFrame, injectIframeCSS]);

  // 특정 하이라이트로 스크롤
  const scrollToHighlight = useCallback((highlightId: string) => {
    const element = highlightElements.current.get(highlightId);
    if (!element) {
      console.log('❌ 하이라이트 요소를 찾을 수 없음:', highlightId);
      return;
    }

    // 부드럽게 스크롤
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center',
      inline: 'center'
    });

    // 포커스 효과
    element.classList.add('criti-ai-highlight-focused');
    setTimeout(() => {
      element.classList.remove('criti-ai-highlight-focused');
    }, 2000);
  }, []);

  // 외부에서 접근 가능하도록 window에 함수 노출
  useEffect(() => {
    if (!window.critiAI) {
      window.critiAI = {
        // 기본 기능
        toggleSidebar: () => console.log('토글 사이드바 기능 없음'),
        isReady: true,
        version: '2.0.0',
        
        // 하이라이트 관리
        highlightElements: highlightElements.current,
        scrollToHighlight,
        clearAllHighlights: () => removeExistingHighlightsWithFrame(),
        scrollToHighlightByText: (text: string, type?: string) => {
          // 텍스트로 하이라이트 찾기
          for (const [id, element] of highlightElements.current) {
            const elementText = element.textContent?.trim() || '';
            const isTextMatch = elementText.includes(text) || text.includes(elementText);
            const isTypeMatch = !type || id.includes(type);
            
            if (isTextMatch && isTypeMatch) {
              scrollToHighlight(id);
              return true;
            }
          }
          return false;
        },
        
        // 리소스 관리
        cleanupResources: () => removeExistingHighlightsWithFrame()
      };
    } else {
      // 기존 critiAI 객체 업데이트
      window.critiAI.scrollToHighlight = scrollToHighlight;
      window.critiAI.highlightElements = highlightElements.current;
      window.critiAI.clearAllHighlights = () => removeExistingHighlightsWithFrame();
      window.critiAI.cleanupResources = () => removeExistingHighlightsWithFrame();
      window.critiAI.version = '2.0.0';
      window.critiAI.scrollToHighlightByText = (text: string, type?: string) => {
        for (const [id, element] of highlightElements.current) {
          const elementText = element.textContent?.trim() || '';
          const isTextMatch = elementText.includes(text) || text.includes(elementText);
          const isTypeMatch = !type || id.includes(type);
          
          if (isTextMatch && isTypeMatch) {
            scrollToHighlight(id);
            return true;
          }
        }
        return false;
      };
    }
  }, [scrollToHighlight, removeExistingHighlightsWithFrame]);

  // 메인 효과
  useEffect(() => {
    if (safeHighlights.length === 0) {
      removeExistingHighlightsWithFrame();
      return;
    }

    console.log('🎨 하이라이트 적용 시작:', safeHighlights.length, '개');
    
    removeExistingHighlightsWithFrame();
    
    // 약간의 지연 후 적용 (DOM 안정화)
    const timer = setTimeout(() => {
      applyAllHighlights();
      
      // 네이버 블로그 전용 동적 로딩 처리
      if (window.location.href.includes('blog.naver.com')) {
        let retryCount = 0;
        const maxRetries = 5;
        
        const retryHighlighting = () => {
          if (retryCount >= maxRetries) {
            console.log('⚠️ 네이버 블로그 하이라이트 재시도 한계 도달');
            return;
          }
          
          retryCount++;
          console.log(`🔄 네이버 블로그 하이라이트 재시도 ${retryCount}/${maxRetries}`);
          
          const frameDocument = getNaverBlogFrame();
          if (frameDocument) {
            injectIframeCSS(frameDocument);
            
            const unappliedHighlights = safeHighlights.filter(h => !appliedHighlights.current.has(h.id));
            if (unappliedHighlights.length > 0) {
              applyAllHighlights();
              setTimeout(retryHighlighting, 1500);
            }
          } else {
            setTimeout(retryHighlighting, 1000);
          }
        };
        
        setTimeout(retryHighlighting, 1000);
        
      } else if (window.location.href.includes('tistory.com')) {
        const retryTimer = setTimeout(() => {
          console.log('🔄 티스토리 하이라이트 재시도');
          applyAllHighlights();
        }, 2000);
        
        return () => clearTimeout(retryTimer);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      removeExistingHighlightsWithFrame();
    };
  }, [safeHighlights, removeExistingHighlightsWithFrame, applyAllHighlights, getNaverBlogFrame, injectIframeCSS]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      document.querySelectorAll('.criti-ai-tooltip').forEach(tooltip => tooltip.remove());
      removeExistingHighlightsWithFrame();
    };
  }, [removeExistingHighlightsWithFrame]);

  return null;
};

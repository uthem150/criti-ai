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

  // 기존 하이라이트 제거
  const removeExistingHighlights = useCallback(() => {
    const existingHighlights = document.querySelectorAll('.criti-ai-highlight');
    existingHighlights.forEach((el) => {
      const parent = el.parentNode;
      if (parent && el.textContent) {
        const textNode = document.createTextNode(el.textContent);
        parent.replaceChild(textNode, el);
        parent.normalize();
      }
    });
    
    
    
    appliedHighlights.current.clear();
    highlightElements.current.clear();
  }, []);

  

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

  // 컨테이너에서 텍스트 검색 및 하이라이트
  const highlightTextInContainer = useCallback(
    (container: Element, highlight: ExtendedHighlightedText): boolean => {
      const walker = document.createTreeWalker(
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

      const highlightElement = createHighlightElement(highlight);
      const success = applyHighlightToTextNode(textNode, highlight.text, highlightElement);
      
      if (success) {
        highlightElements.current.set(highlight.id, highlightElement);
        appliedHighlights.current.add(highlight.id);
        console.log('✅ 하이라이트 적용:', highlight.text);
      }
      
      return success;
    },
    [createHighlightElement, applyHighlightToTextNode]
  );

  // 모든 하이라이트 적용
  const applyAllHighlights = useCallback(() => {
    const contentSelectors = getContentSelectors();
    
    safeHighlights.forEach((highlight) => {
      if (appliedHighlights.current.has(highlight.id)) return;

      let found = false;
      
      // 일반 페이지에서 하이라이트 적용
      for (const selector of contentSelectors) {
        const containers = document.querySelectorAll(selector);
        
        for (const container of containers) {
          if (highlightTextInContainer(container, highlight)) {
            found = true;
            break;
          }
        }
        
        if (found) break;
      }

      // 네이버 블로그 iframe 처리
      if (!found && window.location.href.includes('blog.naver.com')) {
        const mainFrame = document.querySelector('#mainFrame') as HTMLIFrameElement;
        if (mainFrame && mainFrame.contentDocument) {
          try {
            const frameDocument = mainFrame.contentDocument;
            for (const selector of contentSelectors) {
              const containers = frameDocument.querySelectorAll(selector);
              
              for (const container of containers) {
                if (highlightTextInContainer(container, highlight)) {
                  found = true;
                  break;
                }
              }
              
              if (found) break;
            }
          } catch (error) {
            console.log('⚠️ iframe 하이라이트 실패 (보안 제한):', error);
          }
        }
      }

      if (!found) {
        console.log('❌ 하이라이트 텍스트를 찾을 수 없음:', highlight.text);
      }
    });
  }, [safeHighlights, highlightTextInContainer]);

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
        
        // 하이라이트 관리
        highlightElements: highlightElements.current,
        scrollToHighlight,
        clearAllHighlights: () => removeExistingHighlights(),
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
        }
      };
    } else {
      // 기존 critiAI 객체 업데이트
      window.critiAI.scrollToHighlight = scrollToHighlight;
      window.critiAI.highlightElements = highlightElements.current;
      window.critiAI.clearAllHighlights = () => removeExistingHighlights();
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
  }, [scrollToHighlight, removeExistingHighlights]);

  // 메인 효과
  useEffect(() => {
    if (safeHighlights.length === 0) {
      removeExistingHighlights();
      return;
    }

    console.log('🎨 하이라이트 적용 시작:', safeHighlights.length, '개');
    
    removeExistingHighlights();
    
    // 약간의 지연 후 적용 (DOM 안정화)
    const timer = setTimeout(() => {
      applyAllHighlights();
      
      // 네이버 블로그 등 동적 로딩 재시도
      if (window.location.href.includes('blog.naver.com') || 
          window.location.href.includes('tistory.com')) {
        const retryTimer = setTimeout(() => {
          console.log('🔄 동적 콘텐츠 하이라이트 재시도');
          applyAllHighlights();
        }, 2000);
        
        return () => clearTimeout(retryTimer);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      removeExistingHighlights();
    };
  }, [safeHighlights, removeExistingHighlights, applyAllHighlights]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      document.querySelectorAll('.criti-ai-tooltip').forEach(tooltip => tooltip.remove());
      removeExistingHighlights();
    };
  }, [removeExistingHighlights]);

  return null;
};

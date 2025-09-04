import React, { useEffect, useRef } from 'react';
import type { HighlightedText } from '@shared/types';

interface TextHighlighterProps {
  highlights: HighlightedText[];
  onHighlightClick: (highlight: { text: string; explanation: string }) => void;
}

export const TextHighlighter: React.FC<TextHighlighterProps> = ({
  highlights,
  onHighlightClick,
}) => {
  const appliedHighlights = useRef<Set<string>>(new Set());

  useEffect(() => {
    console.log('🎨 하이라이팅 시작:', highlights.length, '개 항목');
    
    if (!highlights || highlights.length === 0) {
      console.log('⚠️ 하이라이트할 항목이 없습니다');
      return;
    }

    // 기존 하이라이트 제거
    const existingHighlights = document.querySelectorAll('.criti-ai-highlight');
    existingHighlights.forEach(element => {
      const parent = element.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(element.textContent || ''), element);
        parent.normalize(); // 텍스트 노드 정리
      }
    });
    appliedHighlights.current.clear();

    // 새로운 하이라이트 적용
    const applyHighlights = () => {
      highlights.forEach((highlight, index) => {
        const targetText = highlight.text.trim();
        if (!targetText || targetText.length < 3) {
          console.log('❌ 하이라이트 텍스트가 너무 짧음:', targetText);
          return;
        }

        const uniqueKey = `${targetText}-${highlight.type}-${index}`;
        if (appliedHighlights.current.has(uniqueKey)) {
          return; // 이미 적용된 하이라이트
        }

        console.log('🔍 하이라이트 검색:', targetText);

        // 본문 영역 선택자들 (네이버 블로그 포함)
        const contentSelectors = [
          'article',
          '.article-content', '.news-content', '.post-content', '.entry-content',
          '.content', '.main-content', '[role="main"]', 'main',
          '.article-body', '.story-body', '.post-body', '.content-body',
          '.article-text', '.news-body', '.detail-content', '.view-content',
          '.read-content', '.txt_content', '.se-main-container',
          
          // 네이버 블로그 iframe 내부 (접근 가능한 경우)
          '.se-component-content', '.se-text-paragraph', '#postViewArea',
          '.post-view', '.post_ct', '#post-view-content', '.se-viewer'
        ];

        let found = false;
        
        // 일반 페이지에서 하이라이트
        for (const selector of contentSelectors) {
          const containers = document.querySelectorAll(selector);
          
          for (const container of containers) {
            if (highlightTextInContainer(container, targetText, highlight, uniqueKey)) {
              found = true;
              break;
            }
          }
          
          if (found) break;
        }

        // 네이버 블로그 iframe 내부 처리
        if (!found && window.location.href.includes('blog.naver.com')) {
          const mainFrame = document.querySelector('#mainFrame') as HTMLIFrameElement;
          if (mainFrame && mainFrame.contentDocument) {
            try {
              const frameDocument = mainFrame.contentDocument;
              
              for (const selector of contentSelectors) {
                const containers = frameDocument.querySelectorAll(selector);
                
                for (const container of containers) {
                  if (highlightTextInContainer(container, targetText, highlight, uniqueKey)) {
                    found = true;
                    break;
                  }
                }
                
                if (found) break;
              }
            } catch (error) {
              console.log('⚠️ iframe 하이라이트 적용 실패 (보안 제한)');
            }
          }
        }

        if (!found) {
          console.log('❌ 하이라이트 텍스트를 찾을 수 없음:', targetText);
        }
      });
    };

    // 하이라이트 적용 실행
    applyHighlights();

    // 동적 콘텐츠 로딩을 위한 재시도 (네이버 블로그 등)
    if (window.location.href.includes('blog.naver.com')) {
      const retryTimer = setTimeout(() => {
        console.log('🔄 네이버 블로그 하이라이트 재시도');
        applyHighlights();
      }, 2000);
      
      return () => clearTimeout(retryTimer);
    }

  }, [highlights, onHighlightClick]);

  // 컨테이너 내에서 텍스트를 찾아 하이라이트하는 함수
  const highlightTextInContainer = (
    container: Element, 
    targetText: string, 
    highlight: HighlightedText, 
    uniqueKey: string
  ): boolean => {
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const text = node.textContent?.trim() || '';
          const parent = node.parentElement;
          
          // 이미 하이라이트된 요소나 스크립트/스타일 태그 제외
          if (!parent || 
              parent.classList.contains('criti-ai-highlight') ||
              parent.tagName.match(/SCRIPT|STYLE|NOSCRIPT/i) ||
              text.length < 10) {
            return NodeFilter.FILTER_REJECT;
          }
          
          return text.includes(targetText) 
            ? NodeFilter.FILTER_ACCEPT 
            : NodeFilter.FILTER_REJECT;
        }
      }
    );

    const textNode = walker.nextNode() as Text;
    if (!textNode) return false;

    const nodeText = textNode.textContent || '';
    const startIndex = nodeText.indexOf(targetText);
    
    if (startIndex === -1) return false;

    try {
      // 텍스트 노드를 분할하여 하이라이트 적용
      const beforeText = nodeText.substring(0, startIndex);
      const highlightText = nodeText.substring(startIndex, startIndex + targetText.length);
      const afterText = nodeText.substring(startIndex + targetText.length);

      const parent = textNode.parentNode;
      if (!parent) return false;

      // 하이라이트 요소 생성
      const highlightElement = document.createElement('span');
      highlightElement.className = `criti-ai-highlight criti-ai-highlight-${highlight.type}`;
      highlightElement.textContent = highlightText;
      highlightElement.title = highlight.explanation;
      
      // 클릭 이벤트 추가
      highlightElement.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🎯 하이라이트 클릭:', highlight.text);
        onHighlightClick({
          text: highlight.text,
          explanation: highlight.explanation
        });
      });

      // 호버 효과를 위한 툴팁 (선택사항)
      let tooltip: HTMLElement | null = null;
      
      highlightElement.addEventListener('mouseenter', (e) => {
        // 기존 툴팁 제거
        const existingTooltip = document.querySelector('.criti-ai-tooltip');
        if (existingTooltip) {
          existingTooltip.remove();
        }

        // 새 툴팁 생성
        tooltip = document.createElement('div');
        tooltip.className = 'criti-ai-tooltip';
        tooltip.textContent = highlight.explanation;
        
        // 툴팁 위치 설정
        const rect = highlightElement.getBoundingClientRect();
        tooltip.style.top = `${rect.top - 10 + window.scrollY}px`;
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
        
        document.body.appendChild(tooltip);
      });

      highlightElement.addEventListener('mouseleave', () => {
        if (tooltip && tooltip.parentNode) {
          tooltip.remove();
          tooltip = null;
        }
      });

      // DOM 교체
      parent.removeChild(textNode);
      
      if (beforeText) {
        parent.appendChild(document.createTextNode(beforeText));
      }
      
      parent.appendChild(highlightElement);
      
      if (afterText) {
        parent.appendChild(document.createTextNode(afterText));
      }

      appliedHighlights.current.add(uniqueKey);
      console.log('✅ 하이라이트 적용 성공:', targetText);
      return true;

    } catch (error) {
      console.error('❌ 하이라이트 적용 중 오류:', error);
      return false;
    }
  };

  // 컴포넌트 언마운트시 정리
  useEffect(() => {
    return () => {
      // 생성된 툴팁 제거
      const tooltips = document.querySelectorAll('.criti-ai-tooltip');
      tooltips.forEach(tooltip => tooltip.remove());
    };
  }, []);

  // 이 컴포넌트는 실제 렌더링은 하지 않고, DOM 조작만 수행
  return null;
};

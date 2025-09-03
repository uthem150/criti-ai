import React, { useEffect, useCallback } from "react";
import type { HighlightedText } from "@shared/types";

interface TextHighlighterProps {
  highlights: HighlightedText[];
  onHighlightClick: (highlight: HighlightedText) => void;
}

export const TextHighlighter: React.FC<TextHighlighterProps> = ({
  highlights,
  onHighlightClick,
}) => {
  // 방어적 코딩: highlights가 비어있거나 잘못된 경우 처리
  const safeHighlights = React.useMemo(() => {
    if (!highlights || !Array.isArray(highlights)) {
      return [];
    }
    return highlights.filter(h => h && h.text && h.explanation);
  }, [highlights]);
  
  console.log('🎨 TextHighlighter 렌더링:', safeHighlights.length, '개 하이라이트');

  const removeExistingHighlights = useCallback(() => {
    // 안전하게 기존 하이라이트 제거
    const existingHighlights = document.querySelectorAll(".criti-ai-highlight");
    existingHighlights.forEach((el) => {
      const parent = el.parentNode;
      if (parent && el.textContent) {
        const textNode = document.createTextNode(el.textContent);
        parent.replaceChild(textNode, el);
        // 인접한 텍스트 노드들을 병합
        parent.normalize();
      }
    });
  }, []);

  const getTextNodesContaining = (text: string): Text[] => {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          return node.textContent?.includes(text)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        },
      }
    );

    const textNodes: Text[] = [];
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text);
    }
    return textNodes;
  };

  const getHighlightStyles = (type: string) => {
    const baseStyles = {
      cursor: "pointer",
      padding: "1px 2px",
      borderRadius: "2px",
      transition: "all 0.2s ease",
    };

    switch (type) {
      case "bias":
        return {
          ...baseStyles,
          backgroundColor: "rgba(245, 158, 11, 0.25)",
          borderBottom: "2px solid #f59e0b",
          color: "#92400e",
          fontWeight: "500",
        };
      case "fallacy":
        return {
          ...baseStyles,
          backgroundColor: "rgba(239, 68, 68, 0.25)",
          borderBottom: "2px solid #ef4444",
          color: "#991b1b",
          fontWeight: "500",
        };
      case "manipulation":
        return {
          ...baseStyles,
          backgroundColor: "rgba(168, 85, 247, 0.25)",
          borderBottom: "2px solid #a855f7",
          color: "#7c2d12",
          fontWeight: "500",
        };
      default:
        return {
          ...baseStyles,
          backgroundColor: "rgba(107, 114, 128, 0.2)",
          borderBottom: "2px solid #6b7280",
          color: "#374151",
        };
    }
  };

  const showTooltip = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const explanation = target.dataset.explanation;

    if (explanation) {
      const tooltip = document.createElement("div");
      tooltip.className = "criti-ai-tooltip";
      tooltip.textContent = explanation;
      tooltip.style.cssText = `
        position: fixed;
        background: #1f2937;
        color: white;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 400;
        line-height: 1.4;
        max-width: 280px;
        z-index: 1000000;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        animation: fadeIn 0.2s ease-out;
      `;
      
      // CSS 애니메이션 추가
      if (!document.querySelector('#criti-tooltip-styles')) {
        const style = document.createElement('style');
        style.id = 'criti-tooltip-styles';
        style.textContent = `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `;
        document.head.appendChild(style);
      }

      document.body.appendChild(tooltip);

      const rect = target.getBoundingClientRect();
      const tooltipRect = { width: 280, height: 60 }; // 예상 크기
      
      // 화면 경계를 고려한 위치 조정
      let left = rect.left;
      let top = rect.bottom + 8;
      
      // 오른쪽 끝에서 넣어지는 경우
      if (left + tooltipRect.width > window.innerWidth) {
        left = window.innerWidth - tooltipRect.width - 10;
      }
      
      // 아래쪽 끝에서 넓어지는 경우 위에 표시
      if (top + tooltipRect.height > window.innerHeight) {
        top = rect.top - tooltipRect.height - 8;
      }
      
      tooltip.style.left = `${Math.max(10, left)}px`;
      tooltip.style.top = `${Math.max(10, top)}px`;
    }
  };

  const hideTooltip = () => {
    const tooltip = document.querySelector(".criti-ai-tooltip");
    if (tooltip) tooltip.remove();
  };

  const createHighlightElement = useCallback(
    (highlight: HighlightedText, index: number): HTMLElement => {
      const span = document.createElement("span");
      span.className = `criti-ai-highlight criti-ai-highlight-${highlight.type}`;
      span.textContent = highlight.text;
      span.dataset.index = index.toString();
      span.dataset.explanation = highlight.explanation;

      const styles = getHighlightStyles(highlight.type);
      Object.assign(span.style, styles);

      span.addEventListener("click", () => onHighlightClick(highlight));
      span.addEventListener("mouseenter", showTooltip);
      span.addEventListener("mouseleave", hideTooltip);

      return span;
    },
    [onHighlightClick]
  );

  const replaceTextWithHighlight = useCallback(
    (node: Text, searchText: string, highlightElement: HTMLElement) => {
      const nodeText = node.textContent || "";
      const searchIndex = nodeText.indexOf(searchText);

      if (searchIndex !== -1) {
        const beforeText = nodeText.substring(0, searchIndex);
        const afterText = nodeText.substring(searchIndex + searchText.length);

        const parent = node.parentNode;
        if (parent) {
          // 텍스트 노드를 세 부분으로 나누기
          if (beforeText) {
            parent.insertBefore(document.createTextNode(beforeText), node);
          }
          parent.insertBefore(highlightElement, node);
          if (afterText) {
            parent.insertBefore(document.createTextNode(afterText), node);
          }
          parent.removeChild(node);
        }
      }
    },
    []
  );

  const applyHighlights = useCallback(
    (highlights: HighlightedText[]) => {
      highlights.forEach((highlight, index) => {
        const textNodes = getTextNodesContaining(highlight.text);

        textNodes.forEach((node) => {
          if (node.textContent?.includes(highlight.text)) {
            const highlightedNode = createHighlightElement(highlight, index);
            replaceTextWithHighlight(node, highlight.text, highlightedNode);
          }
        });
      });
    },
    [replaceTextWithHighlight, createHighlightElement]
  );

  useEffect(() => {
    if (safeHighlights.length > 0) {
      console.log('🎨 하이라이트 적용 시작:', safeHighlights.length, '개');
      removeExistingHighlights();
      // 약간의 지연 후 적용 (도메인 로딩 완료 대기)
      setTimeout(() => {
        applyHighlights(safeHighlights);
      }, 100);
    } else {
      removeExistingHighlights();
    }

    return () => removeExistingHighlights();
  }, [safeHighlights, removeExistingHighlights, applyHighlights]);

  return null;
};

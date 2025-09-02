import React, { useEffect, useCallback } from "react";
import type { HighlightedText } from "@criti-ai/shared";

interface TextHighlighterProps {
  highlights: HighlightedText[];
  onHighlightClick: (highlight: HighlightedText) => void;
}

export const TextHighlighter: React.FC<TextHighlighterProps> = ({
  highlights,
  onHighlightClick,
}) => {
  const removeExistingHighlights = useCallback(() => {
    const existingHighlights = document.querySelectorAll(".criti-ai-highlight");
    existingHighlights.forEach((el) => {
      const parent = el.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent || ""), el);
        parent.normalize();
      }
    });
  }, []);

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
    [replaceTextWithHighlight]
  );

  useEffect(() => {
    removeExistingHighlights();
    applyHighlights(highlights);

    return () => removeExistingHighlights();
  }, [highlights, removeExistingHighlights, applyHighlights]);

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

  const createHighlightElement = (
    highlight: HighlightedText,
    index: number
  ): HTMLElement => {
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
          backgroundColor: "rgba(245, 158, 11, 0.2)",
          borderBottom: "2px solid #f59e0b",
        };
      case "fallacy":
        return {
          ...baseStyles,
          backgroundColor: "rgba(239, 68, 68, 0.2)",
          borderBottom: "2px solid #ef4444",
        };
      case "manipulation":
        return {
          ...baseStyles,
          backgroundColor: "rgba(168, 85, 247, 0.2)",
          borderBottom: "2px solid #a855f7",
        };
      default:
        return baseStyles;
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
        position: absolute;
        background: #1f2937;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        max-width: 300px;
        z-index: 1000000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      `;

      document.body.appendChild(tooltip);

      const rect = target.getBoundingClientRect();
      tooltip.style.left = `${rect.left}px`;
      tooltip.style.top = `${rect.bottom + 5}px`;
    }
  };

  const hideTooltip = () => {
    const tooltip = document.querySelector(".criti-ai-tooltip");
    if (tooltip) tooltip.remove();
  };

  return null;
};

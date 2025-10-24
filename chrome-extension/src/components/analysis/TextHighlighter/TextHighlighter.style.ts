import { css } from '@emotion/react';

export const highlightStyles = css`
  /* 기본 하이라이트 스타일 */
  .criti-ai-highlight {
    position: relative;
    cursor: pointer;
    padding: 1px 3px;
    margin: 0 1px;
    border-radius: 3px;
    font-weight: 500;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    
    /* 형광펜 효과 */
    background: linear-gradient(to bottom, transparent 0%, transparent 30%, var(--highlight-color) 30%, var(--highlight-color) 70%, transparent 70%);
    border-bottom: 2px solid var(--highlight-border-color);
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      filter: brightness(1.1);
      background: linear-gradient(to bottom, transparent 0%, transparent 25%, var(--highlight-hover-color) 25%, var(--highlight-hover-color) 75%, transparent 75%);
      border-bottom-width: 3px;
    }
    
    &:active {
      transform: translateY(0px);
      transition: transform 0.1s ease-in-out;
    }
  }
  
  /* 편향성 하이라이트 (주황색 형광펜) */
  .criti-ai-highlight-bias {
    --highlight-color: rgba(245, 158, 11, 0.3);
    --highlight-hover-color: rgba(245, 158, 11, 0.45);
    --highlight-border-color: #f59e0b;
    color: #92400e;
  }
  
  /* 논리적 오류 하이라이트 (빨간색 형광펜) */
  .criti-ai-highlight-fallacy {
    --highlight-color: rgba(239, 68, 68, 0.3);
    --highlight-hover-color: rgba(239, 68, 68, 0.45);
    --highlight-border-color: #ef4444;
    color: #991b1b;
  }
  
  /* 감정 조작 하이라이트 (보라색 형광펜) */
  .criti-ai-highlight-manipulation {
    --highlight-color: rgba(168, 85, 247, 0.3);
    --highlight-hover-color: rgba(168, 85, 247, 0.45);
    --highlight-border-color: #a855f7;
    color: #7c2d12;
  }
  
  /* 광고성 하이라이트 (청록색 형광펜) */
  .criti-ai-highlight-advertisement {
    --highlight-color: rgba(6, 182, 212, 0.3);
    --highlight-hover-color: rgba(6, 182, 212, 0.45);
    --highlight-border-color: #06b6d4;
    color: #0f766e;
  }
  
  /* 주장/클레임 하이라이트 (초록색 형광펜) */
  .criti-ai-highlight-claim {
    --highlight-color: rgba(16, 185, 129, 0.3);
    --highlight-hover-color: rgba(16, 185, 129, 0.45);
    --highlight-border-color: #10b981;
    color: #065f46;
  }
  
  /* 기본 하이라이트 (회색) */
  .criti-ai-highlight-default {
    --highlight-color: rgba(107, 114, 128, 0.3);
    --highlight-hover-color: rgba(107, 114, 128, 0.45);
    --highlight-border-color: #6b7280;
    color: #374151;
  }
  
  /* 툴팁 스타일 */
  .criti-ai-tooltip {
    position: fixed;
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    color: white;
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.5;
    max-width: 320px;
    z-index: 1000000;
    box-shadow: 
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(16px);
    pointer-events: none;
    
    &::before {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 8px solid transparent;
      border-top-color: #1f2937;
    }
  }
  
  /* 애니메이션 키프레임 */
  @keyframes highlightPulse {
    0% { 
      box-shadow: 0 0 0 0 var(--highlight-border-color);
    }
    70% { 
      box-shadow: 0 0 0 10px rgba(var(--highlight-border-color), 0);
    }
    100% { 
      box-shadow: 0 0 0 0 rgba(var(--highlight-border-color), 0);
    }
  }
  
  /* 스크롤 대상 강조 효과 */
  .criti-ai-highlight-focused {
    animation: highlightPulse 1.5s cubic-bezier(0.4, 0, 0.6, 1);
    background: linear-gradient(to bottom, transparent 0%, transparent 20%, var(--highlight-hover-color) 20%, var(--highlight-hover-color) 80%, transparent 80%) !important;
    border-bottom-width: 4px !important;
    transform: scale(1.02);
  }

  /* 반응형 디자인 */
  @media (max-width: 768px) {
    .criti-ai-tooltip {
      max-width: 280px;
      font-size: 12px;
      padding: 10px 14px;
    }
    
    .criti-ai-highlight {
      padding: 1px 2px;
      margin: 0 0.5px;
    }
  }
`;

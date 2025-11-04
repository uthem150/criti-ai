import { css } from "@emotion/react";
import { colors, typography } from "@/styles/design";

export const highlightStyles = css`
  /* 기본 하이라이트 스타일 */
  .criti-ai-highlight {
    position: relative;
    cursor: pointer;
    padding: 1px 3px;
    margin: 0 1px;
    border-radius: 3px;
    font-weight: ${typography.fontWeight.regular};
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

    /* 형광펜 효과 */
    background: linear-gradient(
      to bottom,
      transparent 0%,
      transparent 30%,
      var(--highlight-color) 30%,
      var(--highlight-color) 70%,
      transparent 70%
    );
    border-bottom: 2px solid var(--highlight-border-color);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      filter: brightness(1.1);
      background: linear-gradient(
        to bottom,
        transparent 0%,
        transparent 25%,
        var(--highlight-hover-color) 25%,
        var(--highlight-hover-color) 75%,
        transparent 75%
      );
      border-bottom-width: 3px;
    }

    &:active {
      transform: translateY(0px);
      transition: transform 0.1s ease-in-out;
    }
  }

  /* 편향성 하이라이트 (노란색) */
  .criti-ai-highlight-bias {
    --highlight-color: ${colors.light.etc.yellowLight};
    --highlight-hover-color: ${colors.light.etc.yellowLight};
    --highlight-border-color: ${colors.light.etc.yellow};
    color: ${colors.light.etc.orange};
  }

  /* 논리적 오류 하이라이트 (빨간색) */
  .criti-ai-highlight-fallacy {
    --highlight-color: ${colors.light.etc.redLight};
    --highlight-hover-color: ${colors.light.etc.redLight};
    --highlight-border-color: ${colors.light.state.error};
    color: ${colors.light.state.error};
  }

  /* 감정 조작 하이라이트 (보라색) */
  .criti-ai-highlight-manipulation {
    --highlight-color: ${colors.light.etc.purpleLight};
    --highlight-hover-color: ${colors.light.etc.purpleLight};
    --highlight-border-color: ${colors.light.etc.purple};
    color: ${colors.light.etc.purple};
  }

  /* 광고성 하이라이트 (민트색) */
  .criti-ai-highlight-advertisement {
    --highlight-color: ${colors.light.etc.mintLight};
    --highlight-hover-color: ${colors.light.etc.mintLight};
    --highlight-border-color: ${colors.light.etc.mint};
    color: ${colors.light.etc.mint};
  }

  /* 주장/클레임 하이라이트 (민트색) */
  .criti-ai-highlight-claim {
    --highlight-color: ${colors.light.etc.mintLight};
    --highlight-hover-color: ${colors.light.etc.mintLight};
    --highlight-border-color: ${colors.light.etc.mint};
    color: ${colors.light.etc.mint};
  }

  /* 기본 하이라이트 (회색) */
  .criti-ai-highlight-default {
    --highlight-color: ${colors.light.etc.grayLight};
    --highlight-hover-color: ${colors.light.etc.grayLight};
    --highlight-border-color: ${colors.light.grayscale[60]};
    color: ${colors.light.grayscale[80]};
  }

  /* 툴팁 스타일 */
  .criti-ai-tooltip {
    position: fixed;
    background: linear-gradient(
      135deg,
      ${colors.light.grayscale[90]} 0%,
      ${colors.light.grayscale[100]} 100%
    );
    color: ${colors.light.grayscale[0]};
    padding: 12px 16px;
    border-radius: 12px;
    font-size: ${typography.styles.caption4.fontSize};
    font-weight: ${typography.fontWeight.regular};
    line-height: 1.5;
    max-width: 320px;
    z-index: 1000000;
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border: 1px solid ${colors.light.transparency.white[10]};
    backdrop-filter: blur(16px);
    pointer-events: none;

    &::before {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 8px solid transparent;
      border-top-color: ${colors.light.grayscale[90]};
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
    background: linear-gradient(
      to bottom,
      transparent 0%,
      transparent 20%,
      var(--highlight-hover-color) 20%,
      var(--highlight-hover-color) 80%,
      transparent 80%
    ) !important;
    border-bottom-width: 4px !important;
    transform: scale(1.02);
  }

  /* 반응형 디자인 */
  @media (max-width: 768px) {
    .criti-ai-tooltip {
      max-width: 280px;
      font-size: ${typography.styles.caption4.fontSize};
      padding: 10px 14px;
    }

    .criti-ai-highlight {
      padding: 1px 2px;
      margin: 0 0.5px;
    }
  }
`;

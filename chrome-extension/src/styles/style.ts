// ============================================================================
// 색상 팔레트 (첨부 이미지 디자인 기반)
// ============================================================================
export const colors = {
  // Primary Colors (브랜드 컬러)
  primary: {
    main: "#6B8AFF", // 메인 브랜드 컬러
    light: "#9FB4FF",
    dark: "#4A5FCC",
    hover: "#5A7AFF",
  },

  // Grayscale (한국형 UI에 최적화된 그레이 스케일)
  grayscale: {
    90: "#191F2B", // 제목, 중요 텍스트
    80: "#333D4B", // 본문 텍스트
    70: "#4E5968", // 보조 텍스트
    60: "#6B7684", // 비활성 텍스트
    50: "#8B95A1", // 플레이스홀더
    40: "#B0B8C1", // 아이콘
    30: "#D0D8DE", // 구분선
    20: "#E2E7EB", // 배경 경계
    10: "#EEF0F2", // 밝은 배경
    5: "#F9FAFB", // 매우 밝은 배경
    0: "#FFFFFF", // 순백
  },

  // 컬러 팔레트 (액센트 및 상태 표시용)
  palette: {
    red: "#FF5E5E", // 위험, 에러
    orange: "#FF7700", // 경고
    yellow: "#FAB007", // 주의, 정보
    mint: "#00B29A", // 성공 (대체)
    blue: "#6B8AFF", // 정보, primary
    purple: "#505CFF", // 특별 강조
    pink: "#FF3064", // 하이라이트
    gray: "#576578", // 중립
  },

  // 신뢰도 레벨별 색상 (이미지 참고)
  trust: {
    high: "#00B29A", // 신뢰 (100-80점)
    medium: "#FAB007", // 보통 (79-50점)
    low: "#FF7700", // 주의 (49-30점)
    veryLow: "#FF5E5E", // 위험 (29-0점)
  },

  // 상태 컬러
  status: {
    success: "#00B26C",
    error: "#FF5E5E",
    warning: "#FF7700",
    info: "#6B8AFF",
  },

  // 분석 타입별 색상 (하이라이트 및 시각화용)
  analysis: {
    source: "#6B8AFF", // 출처
    bias: "#FAB007", // 편향성
    logic: "#FF7700", // 논리성
    advertisement: "#00B29A", // 광고성
    evidence: "#FF5E5E", // 근거
  },

  // 텍스트 컬러 (grayscale 기반)
  text: {
    primary: "#191F2B", // 주요 텍스트
    secondary: "#4E5968", // 보조 텍스트
    tertiary: "#6B7684", // 3차 텍스트
    disabled: "#B0B8C1", // 비활성
    inverse: "#FFFFFF", // 역색상 (어두운 배경에)
    accent: "#6B8AFF", // 강조 텍스트
  },

  // 배경 컬러
  background: {
    primary: "#FFFFFF", // 메인 배경
    secondary: "#F9FAFB", // 보조 배경
    tertiary: "#EEF0F2", // 3차 배경
    hover: "#F5F7FA", // 호버 상태
    pressed: "#E8EBF0", // 클릭 상태
    gradient: "linear-gradient(135deg, #F9FAFB 0%, #EEF0F2 100%)", // 그라데이션
  },

  // 테두리 컬러
  border: {
    primary: "#E2E7EB", // 기본 테두리
    secondary: "#D0D8DE", // 보조 테두리
    tertiary: "#B0B8C1", // 강조 테두리
    focus: "#6B8AFF", // 포커스 테두리
    error: "#FF5E5E", // 에러 테두리
    success: "#00B29A", // 성공 테두리
  },

  // 그림자 색상
  shadow: {
    light: "rgba(0, 0, 0, 0.05)",
    medium: "rgba(0, 0, 0, 0.1)",
    dark: "rgba(0, 0, 0, 0.2)",
    primary: "rgba(107, 138, 255, 0.2)", // primary 색상 그림자
  },
} as const;

// 타이포그래피 (첨부 이미지 및 'Pretendard' 폰트 기준)
export const typography = {
  fontFamily: {
    primary:
      "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans KR', sans-serif",
    code: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
  },

  // 폰트 굵기
  fontWeight: {
    light: 300,
    regular: 400,
    semibold: 600,
    bold: 700,
  },

  // 타이포그래피 스타일 (Shadow DOM에서 rem 영향 받지 않도록 px 단위 사용)
  styles: {
    headline1: {
      fontSize: "48px", // 3rem
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: "-1.2px", // -0.075rem
    },
    headline2: {
      fontSize: "32px", // 2rem
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: "-0.8px", // -0.05rem
    },
    title1: {
      fontSize: "24px", // 1.5rem
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: "-0.48px", // -0.03rem
    },
    title2: {
      fontSize: "20px", // 1.25rem
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: "-0.4px", // -0.025rem
    },
    title3: {
      fontSize: "18px", // 1.125rem
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: "-0.36px", // -0.0225rem
    },
    title4: {
      fontSize: "16px", // 1rem
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: "-0.32px", // -0.02rem
    },
    title5: {
      fontSize: "14px", // 0.875rem
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: "-0.28px", // -0.0175rem
    },
    body1: {
      fontSize: "18px", // 1.125rem
      fontWeight: 300,
      lineHeight: 1.6,
      letterSpacing: "-0.36px", // -0.0225rem
    },
    body2: {
      fontSize: "16px", // 1rem
      fontWeight: 300,
      lineHeight: 1.6,
      letterSpacing: "-0.32px", // -0.02rem
    },
    body3: {
      fontSize: "14px", // 0.875rem
      fontWeight: 300,
      lineHeight: 1.6,
      letterSpacing: "-0.42px", // -0.02625rem
    },
    body4: {
      fontSize: "12px", // 0.75rem
      fontWeight: 300,
      lineHeight: 1.6,
      letterSpacing: "-0.36px", // -0.0225rem
    },
    caption1: {
      fontSize: "18px", // 1.125rem
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: "-0.36px", // -0.0225rem
    },
    caption2: {
      fontSize: "16px", // 1rem
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: "-0.32px", // -0.02rem
    },
    caption3: {
      fontSize: "14px", // 0.875rem
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: "-0.28px", // -0.0175rem
    },
    caption4: {
      fontSize: "12px", // 0.75rem
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: "-0.24px", // -0.015rem
    },
  },
} as const;

// 간격 (Spacing) - ✅ Shadow DOM에서 rem 영향 받지 않도록 px 단위 사용
export const spacing = {
  0: "0",
  1: "4px", // 0.25rem
  2: "8px", // 0.5rem
  3: "12px", // 0.75rem
  4: "16px", // 1rem
  5: "20px", // 1.25rem
  6: "24px", // 1.5rem
  8: "32px", // 2rem
  10: "40px", // 2.5rem
  12: "48px", // 3rem
  16: "64px", // 4rem
  20: "80px", // 5rem
  24: "96px", // 6rem
} as const;

// 그림자
export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
} as const;

// 테두리 반경 - Shadow DOM에서 rem 영향 받지 않도록 px 단위 사용
export const borderRadius = {
  none: "0",
  sm: "2px", // 0.125rem
  base: "4px", // 0.25rem
  md: "6px", // 0.375rem
  lg: "8px", // 0.5rem
  xl: "12px", // 0.75rem
  "2xl": "16px", // 1rem
  full: "9999px",
} as const;

// 애니메이션
export const animations = {
  transition: {
    fast: "150ms ease-in-out",
    normal: "250ms ease-in-out",
    slow: "350ms ease-in-out",
  },

  keyframes: {
    fadeIn: `
      from { opacity: 0; }
      to { opacity: 1; }
    `,
    slideUp: `
      from { transform: translateY(10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    `,
    pulse: `
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    `,
  },
} as const;

// Z-인덱스
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  toast: 1070,
} as const;

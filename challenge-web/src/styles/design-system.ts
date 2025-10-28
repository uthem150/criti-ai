// 색상 팔레트
export const colors = {
  // Primary Colors (브랜드 컬러)
  primary: "#6B8AFF",

  // Grayscale
  grayscale: {
    90: "#191F2B",
    80: "#333D4B",
    70: "#4E5968",
    60: "#6B7684",
    50: "#8B95A1",
    40: "#B0B8C1",
    30: "#D0D8DE",
    20: "#E2E7EB",
    10: "#EEF0F2",
    5: "#F9FAFB",
    0: "#FFFFFF",
  },

  // 전체 색상 팔레트 (image_4bd869.png)
  palette: {
    red: "#FF5E5E",
    orange: "#FF7700",
    yellow: "#FAB007",
    mint: "#00B29A",
    blue: "#6B8AFF", // primary와 동일
    purple: "#505CFF",
    pink: "#FF3064",
    gray: "#576578", // grayscale과 별도
  },

  // 상태 컬러
  status: {
    success: "#00B26C",
    error: "#FF5E5E",
    warning: "#FF7700", // palette.orange에서 매핑
    info: "#6B8AFF", // primary에서 매핑
  },

  // 텍스트 컬러 (grayscale 기반 정의)
  text: {
    primary: "#191F2B", // grayscale[90]
    secondary: "#4E5968", // grayscale[70]
    disabled: "#B0B8C1", // grayscale[40]
    inverse: "#FFFFFF", // grayscale[0]
  },

  // 배경 컬러 (grayscale 기반 정의)
  background: {
    primary: "#FFFFFF", // grayscale[0]
    secondary: "#F9FAFB", // grayscale[5]
    tertiary: "#EEF0F2", // grayscale[10]
  },

  // 테두리 컬러 (grayscale 기반 정의)
  border: {
    primary: "#E2E7EB", // grayscale[20]
    secondary: "#D0D8DE", // grayscale[30]
    focus: "#6B8AFF", // primary
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

  // 타이포그래피 스타일
  styles: {
    headline1: {
      fontSize: "3rem", // 48px
      fontWeight: 700,
      lineHeight: 1.4, // 140%
      letterSpacing: "-0.075rem",
    },
    headline2: {
      fontSize: "2rem", // 32px
      fontWeight: 700,
      lineHeight: 1.4, // 140%
      letterSpacing: "-0.05rem",
    },
    title1: {
      fontSize: "1.5rem", // 24px
      fontWeight: 600,
      lineHeight: 1.4, // 140%
      letterSpacing: "-0.03rem",
    },
    title2: {
      fontSize: "1.25rem", // 20px
      fontWeight: 600,
      lineHeight: 1.4, // 140%
      letterSpacing: "-0.025rem",
    },
    title3: {
      fontSize: "1.125rem", // 18px
      fontWeight: 600,
      lineHeight: 1.4, // 140%
      letterSpacing: "-0.0225rem",
    },
    title4: {
      fontSize: "1rem", // 16px
      fontWeight: 600,
      lineHeight: 1.4, // 140%
      letterSpacing: "-0.02rem",
    },
    title5: {
      fontSize: "0.875rem", // 14px
      fontWeight: 600,
      lineHeight: 1.4, // 140%
      letterSpacing: "-0.0175rem",
    },
    body1: {
      fontSize: "1.125rem", // 18px
      fontWeight: 300,
      lineHeight: 1.6, // 160%
      letterSpacing: "-0.0225rem",
    },
    body2: {
      fontSize: "1rem", // 16px
      fontWeight: 300,
      lineHeight: 1.6, // 160%
      letterSpacing: "-0.02rem",
    },
    body3: {
      fontSize: "0.875rem", // 14px
      fontWeight: 300,
      lineHeight: 1.6, // 160%
      letterSpacing: "-0.02625rem",
    },
    body4: {
      fontSize: "0.75rem", // 12px
      fontWeight: 300,
      lineHeight: 1.6, // 160%
      letterSpacing: "-0.0225rem",
    },
    caption1: {
      fontSize: "1.125rem", // 18px
      fontWeight: 400,
      lineHeight: 1.6, // 160%
      letterSpacing: "-0.0225rem",
    },
    caption2: {
      fontSize: "1rem", // 16px
      fontWeight: 400,
      lineHeight: 1.6, // 160%
      letterSpacing: "-0.02rem",
    },
    caption3: {
      fontSize: "0.875rem", // 14px
      fontWeight: 400,
      lineHeight: 1.6, // 160%
      letterSpacing: "-0.0175rem",
    },
    caption4: {
      fontSize: "0.75rem", // 12px
      fontWeight: 400,
      lineHeight: 1.6, // 160%
      letterSpacing: "-0.015rem",
    },
  },
} as const;

// 간격 (Spacing)
export const spacing = {
  0: "0",
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
} as const;

// 그림자
export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
} as const;

// 테두리 반경
export const borderRadius = {
  none: "0",
  sm: "0.125rem", // 2px
  base: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
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

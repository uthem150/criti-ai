/**
 * 디자인 시스템 토큰
 *
 * - colors: light/dark 테마별 색상 팔레트
 * - typography: 폰트, 굵기, 타이포그래피 스타일
 */

// -----------------------------------------------------------------------------
// 🎨 Colors
// -----------------------------------------------------------------------------

export const colors = {
  /**
   * 라이트 테마
   */
  light: {
    grayscale: {
      100: "#10141A",
      90: "#191F28",
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
    static: {
      white: "#FFFFFF",
      black: "#000000",
    },
    transparency: {
      black: {
        90: "rgba(0, 0, 0, 0.9)",
        80: "rgba(0, 0, 0, 0.8)",
        70: "rgba(0, 0, 0, 0.7)",
        60: "rgba(0, 0, 0, 0.6)",
        50: "rgba(0, 0, 0, 0.5)",
        40: "rgba(0, 0, 0, 0.4)",
        30: "rgba(0, 0, 0, 0.3)",
        20: "rgba(0, 0, 0, 0.2)",
        10: "rgba(0, 0, 0, 0.1)",
        5: "rgba(0, 0, 0, 0.05)",
      },
      white: {
        90: "rgba(255, 255, 255, 0.9)",
        80: "rgba(255, 255, 255, 0.8)",
        70: "rgba(255, 255, 255, 0.7)",
        60: "rgba(255, 255, 255, 0.6)",
        50: "rgba(255, 255, 255, 0.5)",
        40: "rgba(255, 255, 255, 0.4)",
        30: "rgba(255, 255, 255, 0.3)",
        20: "rgba(255, 255, 255, 0.2)",
        10: "rgba(255, 255, 255, 0.1)",
        5: "rgba(255, 255, 255, 0.05)",
      },
    },
    brand: {
      primary100: "#1AA7FF",
      primary80: "rgba(22, 138, 255, 0.8)", // JSON 원본 값 "80%"
      primary60: "rgba(22, 138, 255, 0.8)", // JSON 원본 값 "80%"
      primary40: "rgba(22, 138, 255, 0.4)",
      primary20: "rgba(22, 138, 255, 0.2)",
      primary10: "rgba(22, 138, 255, 0.1)",
    },
    state: {
      success: "#168AFF",
      successLight: "rgba(22, 138, 255, 0.1)",
      error: "#FF5E5E",
      errorLight: "rgba(255, 94, 94, 0.1)",
    },
    etc: {
      red: "#FF5E5E",
      redLight: "rgba(255, 94, 94, 0.15)",
      orange: "#FF7700",
      orangeLight: "rgba(255, 119, 0, 0.15)",
      yellow: "#FAB107",
      yellowLight: "rgba(250, 177, 7, 0.15)",
      mint: "#00B29A",
      mintLight: "rgba(0, 178, 154, 0.15)",
      blue: "#168AFF",
      blueLight: "rgba(22, 138, 255, 0.15)",
      purple: "#595CFF",
      purpleLight: "rgba(89, 92, 255, 0.15)",
      pink: "#FF3064",
      pinkLight: "rgba(255, 48, 100, 0.15)",
      gray: "#576578",
      grayLight: "rgba(87, 101, 120, 0.15)",
    },
  },
  /**
   * 다크 테마
   */
  dark: {
    grayscale: {
      black: "#10141A",
      90: "#191F28",
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
    static: {
      white: "#FFFFFF",
      black: "#000000",
    },
    transparency: {
      black: {
        90: "rgba(0, 0, 0, 0.9)",
        80: "rgba(0, 0, 0, 0.8)",
        70: "rgba(0, 0, 0, 0.7)",
        60: "rgba(0, 0, 0, 0.6)",
        50: "rgba(0, 0, 0, 0.5)",
        40: "rgba(0, 0, 0, 0.4)",
        30: "rgba(0, 0, 0, 0.3)",
        20: "rgba(0, 0, 0, 0.2)",
        10: "rgba(0, 0, 0, 0.1)",
        5: "rgba(0, 0, 0, 0.05)",
      },
      white: {
        90: "rgba(255, 255, 255, 0.9)",
        80: "rgba(255, 255, 255, 0.8)",
        70: "rgba(255, 255, 255, 0.7)",
        60: "rgba(255, 255, 255, 0.6)",
        50: "rgba(255, 255, 255, 0.5)",
        40: "rgba(255, 255, 255, 0.4)",
        30: "rgba(255, 255, 255, 0.3)",
        20: "rgba(255, 255, 255, 0.2)",
        10: "rgba(255, 255, 255, 0.1)",
        5: "rgba(255, 255, 255, 0.05)",
      },
    },
    brand: {
      primary100: "#168AFF",
      primary80: "rgba(22, 138, 255, 0.8)",
      primary60: "rgba(22, 138, 255, 0.6)", // JSON 원본 값 "60%"
      primary40: "rgba(22, 138, 255, 0.4)",
      primary20: "rgba(22, 138, 255, 0.2)",
      primary10: "rgba(22, 138, 255, 0.1)",
    },
    state: {
      success: "#168AFF",
      successLight: "rgba(22, 138, 255, 0.1)",
      error: "#FF5E5E",
      errorLight: "rgba(255, 94, 94, 0.1)",
    },
    etc: {
      red: "#FF5E5E",
      redLight: "rgba(255, 94, 94, 0.15)",
      orange: "#FF7700",
      secondaryLight: "rgba(255, 119, 0, 0.15)",
      yellow: "#FAB107",
      yellowLight: "rgba(250, 177, 7, 0.15)",
      mint: "#00B29A",
      mintLight: "rgba(0, 178, 154, 0.15)",
      blue: "#168AFF",
      blueLight: "rgba(22, 138, 255, 0.15)",
      purple: "#595CFF",
      purpleLight: "rgba(89, 92, 255, 0.15)",
      pink: "#FF3064",
      pinkLight: "rgba(255, 48, 100, 0.15)",
      gray: "#576578",
      grayLight: "rgba(87, 101, 120, 0.15)",
    },
  },
} as const;

// -----------------------------------------------------------------------------
// 🖋️ Typography
// -----------------------------------------------------------------------------

export const typography = {
  /**
   * 폰트 계열
   */
  fontFamily: {
    primary:
      "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans KR', sans-serif",
    code: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
  },

  /**
   * 폰트 굵기
   */
  fontWeight: {
    light: 300,
    regular: 400,
    semibold: 600,
    bold: 700,
  },

  /**
   * 타이포그래피 스타일
   * (lineHeight는 % 값을 숫자로 변환: 140% -> 1.4)
   */
  styles: {
    headline1: {
      fontSize: "3rem", // 48px
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: "-0.075rem",
    },
    headline2: {
      fontSize: "2rem", // 32px
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: "-0.05rem",
    },
    title1: {
      fontSize: "1.5rem", // 24px
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: "-0.03rem",
    },
    title2: {
      fontSize: "1.25rem", // 20px
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: "-0.025rem",
    },
    title3: {
      fontSize: "1.125rem", // 18px
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: "-0.0225rem",
    },
    title4: {
      fontSize: "1rem", // 16px
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: "-0.02rem",
    },
    title5: {
      fontSize: "0.875rem", // 14px
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: "-0.0175rem",
    },
    body1: {
      fontSize: "1.125rem", // 18px
      fontWeight: 300,
      lineHeight: 1.6,
      letterSpacing: "-0.0225rem",
    },
    body2: {
      fontSize: "1rem", // 16px
      fontWeight: 300,
      lineHeight: 1.6,
      letterSpacing: "-0.02rem",
    },
    body3: {
      fontSize: "0.875rem", // 14px (JSON 원본 rem: "1rem"이었으나 px: "14px" 기준으로 수정)
      fontWeight: 300,
      lineHeight: 1.6,
      letterSpacing: "-0.02625rem", // JSON 원본 값
    },
    body4: {
      fontSize: "0.75rem", // 12px (JSON 원본 rem: "0.875rem"이었으나 px: "12px" 기준으로 수정)
      fontWeight: 300,
      lineHeight: 1.6,
      letterSpacing: "-0.0225rem", // JSON 원본 값
    },
    caption1: {
      fontSize: "1.125rem", // 18px
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: "-0.0225rem",
    },
    caption2: {
      fontSize: "1rem", // 16px
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: "-0.02rem",
    },
    caption3: {
      fontSize: "0.875rem", // 14px
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: "-0.0175rem",
    },
    caption4: {
      fontSize: "0.75rem", // 12px
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: "-0.015rem",
    },
  },
} as const;

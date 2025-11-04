/**
 * 환경별 로깅 유틸리티
 * Production 환경에서는 로그를 최소화
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  /**
   * 일반 로그 (개발 환경에서만 출력)
   */
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * 정보 로그 (개발 환경에서만 출력)
   */
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  /**
   * 경고 로그 (항상 출력)
   */
  warn: (...args: unknown[]) => {
    console.warn(...args);
  },

  /**
   * 에러 로그 (항상 출력)
   */
  error: (...args: unknown[]) => {
    console.error(...args);
  },

  /**
   * 성공 로그 (개발 환경에서만 출력)
   */
  success: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.log(`✅ ${message}`, ...args);
    }
  },

  /**
   * 시작 로그 (개발 환경에서만 출력)
   */
  start: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.log(`🚀 ${message}`, ...args);
    }
  },
};

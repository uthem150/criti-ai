/**
 * 공통 포맷팅 유틸리티
 */

/**
 * 초를 분:초 형식으로 변환
 * @example formatTime(125) => "2:05"
 */
export const formatTime = (seconds: number): string => {
  if (!seconds || seconds < 0) return "0:00";
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

/**
 * 숫자를 천 단위 구분 형식으로 변환
 * @example formatNumber(1234567) => "1,234,567"
 */
export const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return "0";
  return num.toLocaleString("ko-KR");
};

/**
 * 점수에 따른 색상 반환
 * @param score - 0-100 사이의 점수
 * @returns 점수에 맞는 색상 코드
 */
export const getScoreColor = (score: number): string => {
  if (score >= 70) return "#10b981"; // 녹색 - 신뢰도 높음
  if (score >= 50) return "#f59e0b"; // 주황색 - 보통
  return "#ef4444"; // 빨강색 - 신뢰도 낮음
};

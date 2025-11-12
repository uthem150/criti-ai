/**
 * 날짜를 포맷팅 (예: "2024-01-15" -> "2024.01.15")
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}.${month}.${day}`;
  } catch {
    return dateString;
  }
}

/**
 * 점수에 따른 색상 반환
 */
export function getScoreColor(score: number): string {
  if (score >= 70) return "#10b981"; // 녹색
  if (score >= 50) return "#f59e0b"; // 주황색
  return "#ef4444"; // 빨간색
}

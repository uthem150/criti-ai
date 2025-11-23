// src/utils/colorUtils.ts
import { colors } from "@/styles/design";

/**
 * 점수(0~100)에 따른 색상 코드를 반환.
 * 구간: 81~100(파랑), 61~80(초록), 41~60(노랑), 21~40(주황), 0~20(빨강)
 */
export const getScoreColor = (score: number): string => {
  if (score > 80) return colors.light.etc.blue; // 파랑 (Blue)
  if (score > 60) return colors.light.etc.mint; // 초록 (Green)
  if (score > 40) return colors.light.etc.yellow; // 노랑 (Yellow)
  if (score > 20) return colors.light.etc.orange; // 주황 (Orange)
  return colors.light.etc.red; // 빨강 (Red)
};

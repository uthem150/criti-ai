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

export type IntensityLevel = "none" | "low" | "medium" | "high";
/**
 * 강도(intensity)에 따른 색상 코드를 반환
 * - none, low: 민트 (안전/낮음)
 * - medium: 노랑 (중간)
 * - high: 빨강 (높음/위험)
 */
export const getIntensityColor = (
  intensity: IntensityLevel | string
): string => {
  if (intensity === "high") return colors.light.etc.red;
  if (intensity === "medium") return colors.light.etc.yellow;

  // "none", "low" 또는 그 외의 경우
  return colors.light.etc.mint;
};

export type TrustLevel = "trusted" | "neutral" | "caution" | "unreliable";
/**
 * 신뢰도 레벨에 따른 색상 코드를 반환
 * - trusted: 민트
 * - neutral: 회색
 * - caution: 노랑
 * - unreliable: 빨강
 */
export const getTrustColor = (level: TrustLevel | string): string => {
  switch (level) {
    case "trusted":
      return colors.light.etc.mint;
    case "caution":
      return colors.light.etc.yellow;
    case "unreliable":
      return colors.light.state.error;
    case "neutral":
    default:
      return colors.light.grayscale[60];
  }
};

export type VerdictType = "true" | "false" | "mixed" | "unverified";

/**
 * 팩트체크 판별 결과(verdict)에 따른 색상 코드를 반환
 * - true: 민트 (진실)
 * - false: 빨강 (거짓)
 * - mixed: 노랑 (복합/애매함)
 * - unverified: 회색 (확인 불가)
 */
export const getVerdictColor = (verdict: VerdictType | string): string => {
  switch (verdict) {
    case "true":
      return colors.light.etc.mint;
    case "false":
      return colors.light.state.error;
    case "mixed":
      return colors.light.etc.yellow;
    case "unverified":
    default:
      return colors.light.grayscale[60];
  }
};

export type ConsensusType = "agree" | "disagree" | "mixed" | "insufficient";

/**
 * 여론 합의(consensus) 상태에 따른 색상 코드를 반환
 * - agree: 민트 (일치)
 * - disagree: 빨강 (불일치/반대)
 * - mixed: 노랑 (복합적)
 * - insufficient: 회색 (정보 부족)
 */
export const getConsensusColor = (
  consensus: ConsensusType | string
): string => {
  switch (consensus) {
    case "agree":
      return colors.light.etc.mint;
    case "disagree":
      return colors.light.state.error;
    case "mixed":
      return colors.light.etc.yellow;
    case "insufficient":
    default:
      return colors.light.grayscale[60];
  }
};

export type TextType =
  | "bias"
  | "fallacy"
  | "manipulation"
  | "advertisement"
  | "claim";

/**
 * 텍스트 유형(ClickableText)에 따른 색상 코드를 반환
 * - bias: 노랑
 * - fallacy: 주황
 * - manipulation: 보라
 * - advertisement: 민트
 * - claim: 파랑
 */
export const getTextTypeColor = (type: TextType | string): string => {
  switch (type) {
    case "bias":
      return colors.light.etc.yellow;
    case "fallacy":
      return colors.light.etc.orange;
    case "manipulation":
      return colors.light.etc.purple;
    case "advertisement":
      return colors.light.etc.mint;
    case "claim":
      return colors.light.etc.blue;
    default:
      return colors.light.grayscale[90];
  }
};

/**
 * 광고성 여부에 따른 뱃지 정보 반환
 */
export const getAdBadgeInfo = (isAdvertorial: boolean) => {
  if (isAdvertorial) {
    return {
      text: "광고성",
      color: colors.light.state.error, // 또는 getVerdictColor("false")
    };
  }
  return {
    text: "비광고성",
    color: colors.light.brand.primary100, // 또는 getVerdictColor("true")
  };
};

/**
 * 교차 검증(Consensus) 상태에 따른 뱃지 정보 반환
 */
export const getConsensusBadgeInfo = (consensus: ConsensusType | string) => {
  switch (consensus) {
    case "agree":
      return { text: "일치", color: colors.light.state.success };
    case "disagree":
      return { text: "불일치", color: colors.light.state.error };
    case "mixed":
      return { text: "혼재", color: colors.light.etc.yellow };
    case "insufficient":
    default:
      return { text: "불충분", color: colors.light.grayscale[60] };
  }
};

/**
 * 논리적 오류 개수에 따른 뱃지 색상 반환
 * - 1개 이상: Error (Red)
 * - 0개: Mint (Safe)
 */
export const getFallacyColor = (count: number): string => {
  return count > 0 ? colors.light.state.error : colors.light.etc.mint;
};

/**
 * 정치적 성향 색상 (Left: Blue, Right: Red, Center: Gray)
 */
export const getPoliticalColor = (direction: string): string => {
  switch (direction) {
    case "left":
      return colors.light.etc.blue;
    case "right":
      return colors.light.etc.red;
    default:
      return colors.light.grayscale[60];
  }
};

/**
 * 광고성 여부 색상 (Advertorial: Red, Normal: Blue)
 */
export const getAdColor = (isAdvertorial: boolean): string => {
  return isAdvertorial
    ? colors.light.state.error
    : colors.light.brand.primary100;
};

/**
 * 여론 합의(Consensus) 상태에 따른 배경 색상 반환
 * (텍스트보다 연한 파스텔 톤)
 */
export const getConsensusBackgroundColor = (consensus: string): string => {
  switch (consensus) {
    case "agree":
      return colors.light.etc.mintLight;
    case "disagree":
      return colors.light.state.errorLight;
    case "mixed":
      return colors.light.etc.yellowLight;
    case "insufficient":
    default:
      return colors.light.grayscale[10]; // 연한 회색
  }
};

/**
 * 점수(0~100)에 따른 색상 코드를 반환.
 */
export const getAdScoreColor = (score: number): string => {
  if (score > 80) return colors.light.etc.red;
  if (score > 60) return colors.light.etc.orange;
  if (score > 40) return colors.light.etc.yellow;
  if (score > 20) return colors.light.etc.mint;
  return colors.light.etc.blue;
};

// 광고성 여부 배경색
export const getAdBackgroundColor = (isAdvertorial?: boolean): string => {
  return isAdvertorial ? colors.light.etc.redLight : colors.light.etc.blueLight;
};

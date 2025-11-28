// src/utils/textUtils.ts

/**
 * 신뢰도 레벨 텍스트
 */
export const getTrustLevelText = (level: string) => {
  switch (level) {
    case "trusted":
      return "신뢰할 만함";
    case "neutral":
      return "중립적";
    case "caution":
      return "주의 필요";
    case "unreliable":
      return "신뢰하기 어려움";
    default:
      return "미확인";
  }
};

/**
 * 강도(Intensity) 텍스트
 */
export const getIntensityText = (intensity: string) => {
  switch (intensity) {
    case "high":
      return "🔴 매우 높음";
    case "medium":
      return "🟡 보통";
    case "low":
      return "🟢 낮음";
    default:
      return "✅ 거의 없음";
  }
};

/**
 * 조작적 표현 카테고리 텍스트
 */
export const getManipulativeCategoryText = (category: string) => {
  switch (category) {
    case "emotional":
      return "😭 감정적";
    case "exaggeration":
      return "📈 과장";
    case "urgency":
      return "⏰ 긴급";
    case "authority":
      return "👑 권위";
    case "fear":
      return "😰 공포";
    default:
      return "⚠️ 기타";
  }
};

/**
 * 클릭베이트 유형 텍스트
 */
export const getClickbaitTypeText = (type: string) => {
  switch (type) {
    case "curiosity_gap":
      return "🔍 호기심 갭";
    case "emotional_trigger":
      return "💥 감정 트리거";
    case "urgency":
      return "⚡ 긴급성";
    default:
      return "⭐ 최상급";
  }
};

/**
 * 정치적 성향 방향 텍스트
 */
export const getPoliticalDirectionText = (direction: string) => {
  switch (direction) {
    case "left":
      return "⬅️ 진보적";
    case "right":
      return "➡️ 보수적";
    case "center":
      return "🎯 중도";
    default:
      return "⚖️ 중립적";
  }
};

/**
 * 광고성 지표 유형 텍스트
 */
export const getAdIndicatorText = (type: string) => {
  switch (type) {
    case "product_mention":
      return "🛍️ 제품 언급";
    case "promotional_language":
      return "📢 홍보 언어";
    case "call_to_action":
      return "👆 행동 유도";
    case "brand_focus":
      return "🏷️ 브랜드 중심";
    case "affiliate_link":
      return "🔗 제휴 링크";
    default:
      return "📝 후원 콘텐츠";
  }
};

/**
 * 팩트체크 판정 텍스트
 */
export const getVerdictText = (verdict: string) => {
  switch (verdict) {
    case "true":
      return "✅ 사실";
    case "false":
      return "❌ 거짓";
    case "mixed":
      return "🔄 부분적";
    default:
      return "❓ 미확인";
  }
};

/**
 * 여론 합의(Consensus) 뱃지용 짧은 텍스트
 */
export const getConsensusBadgeText = (consensus: string) => {
  switch (consensus) {
    case "agree":
      return "일치";
    case "disagree":
      return "불일치";
    case "mixed":
      return "혼재";
    default:
      return "불충분";
  }
};

/**
 * 여론 합의(Consensus) 상세 설명 텍스트
 */
export const getConsensusStatusText = (consensus: string) => {
  switch (consensus) {
    case "agree":
      return "의견이 일치함";
    case "disagree":
      return "의견이 불일치함";
    case "mixed":
      return "의견이 혼재됨";
    default:
      return "검증 정보 부족";
  }
};

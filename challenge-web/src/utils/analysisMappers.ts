import { TimestampedAdvertisementIndicator } from "@criti-ai/shared/types";
import { colors } from "../styles/design-system";

// category를 한글 제목으로 매핑하는 함수
export const getCategoryTitle = (category: string) => {
  switch (category) {
    case "emotional":
      return "감정적 언어 사용";
    case "exaggeration":
      return "과장된 표현";
    case "urgency":
      return "긴급성 강조";
    case "authority":
      return "권위/전문성 남용";
    case "fear":
      return "공포/불안 조성";
    default:
      return "기타 편향 표현";
  }
};

export const getClickbaitTypeTitle = (type: string) => {
  switch (type) {
    case "curiosity_gap":
      return "호기심 유발";
    case "emotional_trigger":
      return "감정 자극";
    case "urgency":
      return "긴급성 강조";
    case "superlative":
      return "과장된 수식어";
    default:
      return "기타";
  }
};

export const getPoliticalBiasLabel = (direction: string) => {
  switch (direction) {
    case "left":
      return "진보 성향";
    case "center":
      return "중도";
    case "right":
      return "보수 성향";
    case "neutral":
      return "정치적 중립";
    default:
      return "알 수 없음";
  }
};

export const getPoliticalBiasColor = (direction: string) => {
  switch (direction) {
    case "left":
      return colors.light.etc.blue;
    case "center":
      return colors.light.grayscale[60];
    case "right":
      return colors.light.etc.red;
    case "neutral":
      return colors.light.state.success;
    default:
      return colors.light.grayscale[40];
  }
};

// indicator.type 한글로 변환
export const getAdvertisementIndicatorTypeLabel = (
  type: TimestampedAdvertisementIndicator["type"]
) => {
  switch (type) {
    case "product_mention":
      return "제품 언급";
    case "affiliate_link":
      return "제휴 링크";
    case "sponsored_content":
      return "스폰서 콘텐츠";
    case "promotional_language":
      return "홍보성 발언";
    case "call_to_action":
      return "행동 유도";
    case "brand_focus":
      return "브랜드 집중";
    default:
      return type;
  }
};

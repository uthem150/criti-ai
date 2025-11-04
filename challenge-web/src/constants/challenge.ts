/**
 * 챌린지 관련 상수 정의
 */

export const CHALLENGE_CONSTANTS = {
  /** 스토리지 키 */
  STORAGE_KEYS: {
    USER_ID: "criti-ai-user-id",
  },

  /** 기본 점수 */
  DEFAULT_POINTS: {
    BEGINNER: 80,
    INTERMEDIATE: 120,
    ADVANCED: 150,
  },

  /** 챌린지 난이도별 설명 */
  DIFFICULTY_LABELS: {
    beginner: "초급",
    intermediate: "중급",
    advanced: "고급",
  },
} as const;

/**
 * 논리적 오류 및 편향 옵션
 */
export const ANSWER_OPTIONS = [
  {
    id: "성급한 일반화",
    title: "성급한 일반화",
    description: "적은 사례로 모든 경우에 적용하는 오류",
    example: "예: 학생 한 명이 처벌받았으니 모든 학생이 문제이다",
    emoji: "📈",
  },
  {
    id: "허위 이분법",
    title: "허위 이분법",
    description: "복잡한 문제를 단순히 둘 중 하나로만 나누는 오류",
    example: "예: 찬성 또는 반대, 둘 중 하나만 선택하라",
    emoji: "⚖️",
  },
  {
    id: "인신공격",
    title: "인신공격",
    description: "논리대신 사람을 비난하는 오류",
    example: "예: 그 언론인은 예전에 거짓말했으니 말을 믿을 수 없다",
    emoji: "💭",
  },
  {
    id: "권위에 호소",
    title: "권위에 호소",
    description: "근거 없이 권위를 내세우는 오류",
    example: "예: 전문가가 말했으니 무조건 맞다",
    emoji: "👑",
  },
  {
    id: "감정적 편향",
    title: "감정적 편향",
    description: "이성적 판단보다 감정에 호소하는 표현",
    example: "예: 충격적이다, 분노한다, 끝날 뜻하다",
    emoji: "😡",
  },
  {
    id: "과장된 표현",
    title: "과장된 표현",
    description: "사실보다 과도하게 부풀리거나 축소되는 표현",
    example: "예: 모든 사람, 절대로, 전혀, 반드시",
    emoji: "📈",
  },
  {
    id: "허수아비 공격",
    title: "허수아비 공격",
    description: "상대방 주장을 왜곡해서 공격하는 오류",
    example: "예: 그들은 완전히 방두하자고 한다 (왜곡된 해석)",
    emoji: "🧙",
  },
  {
    id: "순환논리",
    title: "순환논리",
    description: "증명할 것을 근거로 사용하는 오류",
    example: "예: A가 옮다. 왜냐? A기 때문이다",
    emoji: "🔄",
  },
  {
    id: "광고성 콘텐츠",
    title: "광고성 콘텐츠",
    description: "상품이나 서비스를 홍보하려는 의도가 숨어있음",
    example: "예: 상품명 언급, 할인 정보, 연예인 추천",
    emoji: "📺",
  },
  {
    id: "긴급성 유도",
    title: "긴급성 유도",
    description: "시간 압박을 가해 성급한 판단을 유도하는 표현",
    example: "예: 지금 당장, 마지막 기회, 더 이상 망설이지 마라",
    emoji: "⏰",
  },
  {
    id: "과장된 수치",
    title: "과장된 수치",
    description: "근거 없거나 의심스러운 통계나 수치",
    example: "예: 98% 만족, 10명 중 9명 추천 (출처 불분명)",
    emoji: "📉",
  },
  {
    id: "선동적 언어",
    title: "선동적 언어",
    description: "감정을 자극해 특정 의견을 유도하는 언어",
    example: "예: 배신, 학살, 대참사, 유전의 진실",
    emoji: "🗣️",
  },
] as const;

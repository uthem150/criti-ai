// 기본 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// 신뢰도 분석 결과
export interface TrustAnalysis {
  overallScore: number; // 0-100
  analysisSummary: string; // 분석 결과 한줄 요약
  sourceCredibility: SourceCredibility;
  biasAnalysis: BiasAnalysis;
  logicalFallacies: LogicalFallacy[];
  advertisementAnalysis: AdvertisementAnalysis; // 새로운 광고 분석
  crossReference: CrossReference;
  detailedScores: DetailedScores; // 세부 점수 분석
}

// 세부 점수 분석 (막대 차트용)
export interface DetailedScores {
  sourceScore: number;
  objectivityScore: number;
  logicScore: number;
  advertisementScore: number; // 광고성 점수 (높을수록 덜 광고적)
  evidenceScore: number; // 근거 충실도
}

// 출처 신뢰도
export interface SourceCredibility {
  score: number; // 0-100
  level: "trusted" | "neutral" | "caution" | "unreliable";
  domain: string;
  reputation: {
    description: string;
    factors: string[];
    historicalReliability?: number; // 과거 신뢰도
    expertiseArea?: string[]; // 전문 분야
  };
}

// 편향성 분석
export interface BiasAnalysis {
  emotionalBias: EmotionalBias;
  politicalBias: PoliticalBias;
  highlightedTexts: HighlightedText[];
  clickbaitElements: ClickbaitElement[]; // 클릭베이트 요소
}

export interface EmotionalBias {
  score: number; // 0-100 (높을수록 중립적)
  manipulativeWords: ManipulativeWord[]; // 단순 배열에서 상세 객체로 변경
  intensity: "none" | "low" | "medium" | "high";
}

export interface ManipulativeWord {
  word: string;
  category: "emotional" | "exaggeration" | "urgency" | "authority" | "fear";
  impact: "low" | "medium" | "high";
  explanation: string;
}

export interface PoliticalBias {
  direction: "left" | "center" | "right" | "neutral";
  confidence: number; // 0-100
  indicators: string[]; // 정치적 편향을 나타내는 지표들
}

export interface ClickbaitElement {
  type: "curiosity_gap" | "emotional_trigger" | "urgency" | "superlative";
  text: string;
  explanation: string;
  severity: "low" | "medium" | "high";
}

// 광고 분석 (새로운)
export interface AdvertisementAnalysis {
  isAdvertorial: boolean;
  confidence: number; // 0-100
  indicators: AdvertisementIndicator[];
  nativeAdScore: number; // 네이티브 광고 점수
  commercialIntentScore: number; // 상업적 의도 점수
}

export interface AdvertisementIndicator {
  type:
    | "product_mention"
    | "affiliate_link"
    | "sponsored_content"
    | "promotional_language"
    | "call_to_action"
    | "brand_focus";
  evidence: string; // 근거가 된 텍스트
  explanation: string;
  weight: number; // 가중치
}

// 논리적 오류
export interface LogicalFallacy {
  type: string;
  description: string;
  affectedText: string;
  position: TextPosition;
  severity: "low" | "medium" | "high";
  explanation: string; // 초등학생도 이해할 수 있는 설명
  examples?: string[]; // 유사한 사례들
}

// 교차 검증
export interface CrossReference {
  keyClaims: string[]; // 핵심 주장들
  relatedArticleKeywords: string; // 교차 검증용 키워드
  relatedArticles: RelatedArticle[];
  consensus: "agree" | "disagree" | "mixed" | "insufficient";
  factCheckSources?: FactCheckSource[]; // 팩트체크 소스들
}

export interface RelatedArticle {
  title: string;
  source: string;
  url: string;
  stance: "supporting" | "opposing" | "neutral";
  credibilityScore?: number;
}

export interface FactCheckSource {
  organization: string;
  url: string;
  verdict: "true" | "false" | "mixed" | "unverified";
  summary: string;
}

// UI 관련 타입
export interface HighlightedText {
  text: string;
  type: "bias" | "fallacy" | "manipulation" | "advertisement" | "claim";
  position: TextPosition;
  explanation: string;
  severity?: "low" | "medium" | "high";
  category?: string; // 세부 카테고리
}

export interface TextPosition {
  start: number;
  end: number;
  selector: string;
}

// 챌린지 게임 타입
export interface Challenge {
  id: string;
  type:
    | "article-analysis"
    | "image-detection"
    | "data-visualization"
    | "ad-detection";
  title: string;
  content: string;
  correctAnswers: string[];
  explanation: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  points: number;
}

export interface UserProgress {
  userId: string;
  totalPoints: number;
  level: number;
  badges: Badge[];
  completedChallenges: string[];
  analyticsUsed: number;
  weeklyStats?: WeeklyStats;
}

export interface WeeklyStats {
  articlesAnalyzed: number;
  fallaciesFound: number;
  biasDetected: number;
  adsIdentified: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: "analysis" | "training" | "milestone" | "special";
}

// API 요청 타입
export interface AnalysisRequest {
  url: string;
  content: string;
  title?: string;
  contentType?: "news" | "blog" | "social" | "academic" | "commercial"; // 수정: unknown 제거
  analysisLevel?: "basic" | "detailed" | "comprehensive"; // 분석 수준
}

export interface ChallengeResponse {
  challengeId: string;
  userAnswers: string[];
  timeSpent: number;
  hintsUsed: number;
}

// 캐싱 관련 타입
export interface AnalysisCache {
  url: string;
  urlHash: string;
  analysis: TrustAnalysis;
  cachedAt: string;
  expiresAt: string;
  hitCount: number;
}

// 사용자 피드백 타입
export interface UserFeedback {
  analysisId: string;
  rating: number; // 1-5
  helpful: boolean;
  comment?: string;
  improvementSuggestions?: string[];
  timestamp: string;
}

// 분석 통계 타입
export interface AnalysisStats {
  totalAnalyses: number;
  averageScore: number;
  mostCommonFallacies: Array<{ type: string; count: number }>;
  domainStats: Array<{ domain: string; avgScore: number; count: number }>;
  trendingIssues: string[];
}

// 알림/경고 타입
export interface AnalysisWarning {
  type:
    | "high_bias"
    | "multiple_fallacies"
    | "unreliable_source"
    | "heavy_advertising"
    | "misleading_data";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  actionRecommendation?: string;
}

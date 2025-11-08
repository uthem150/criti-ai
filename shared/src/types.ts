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

/**
 * 챌린지 선택지 (4지 선다형)
 */
export interface ChallengeOption {
  id: string; // 예: "1", "2", "3", "4"
  text: string; // 선택지 문장
}

/**
 * 챌린지 기본 구조
 */
export interface Challenge {
  id: string;
  type:
    | "article-analysis"
    | "image-detection"
    | "data-visualization"
    | "ad-detection"
    | "fact-check"
    | "bias-detection";
  title: string; // 챌린지 질문 (예: "다음 중 '감정적 편향'이 있는 문장을 고르세요.")
  options: ChallengeOption[]; // 4개의 문장 선택지
  category?: string; // 챌린지 카테고리 (예: "감정적 편향")
  categoryDescription?: string; // 챌린지 카테고리 설명
  correctAnswers: string[]; // 정답 선택지의 id 배열 (예: ["2"])
  explanation: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  points: number;
  hints?: string[]; // 힌트 배열
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
  category: "analysis" | "training" | "milestone" | "special" | "streak";
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
  userId?: string;
}

// 캐싱 관련 타입
export interface AnalysisCache {
  url: string;
  urlHash: string;
  analysis: AnalysisResult; // TrustAnalysis | YoutubeTrustAnalysis 모두 지원
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

// ===== 유튜브 분석 관련 타입 =====

// 유튜브 비디오 정보
export interface YoutubeVideoInfo {
  videoId: string;
  title: string;
  channelName: string;
  channelId: string;
  duration: number; // 초 단위
  viewCount: number;
  likeCount?: number;
  publishedAt: string;
  description: string;
  thumbnailUrl: string;
  isShorts: boolean; // 쇼츠 여부
}

// 자막 세그먼트 (타임스탬프 포함)
export interface TranscriptSegment {
  text: string;
  start: number; // 시작 시간 (초)
  duration: number; // 지속 시간 (초)
}

// 전체 자막
export interface VideoTranscript {
  segments: TranscriptSegment[];
  fullText: string; // 전체 자막을 합친 텍스트
  language: string;
}

// 타임스탬프가 포함된 분석 항목
export interface TimestampedAnalysisItem {
  timestamp: number; // 발생 시간 (초)
  endTime?: number; // 종료 시간 (선택적)
  text: string; // 해당 시간의 자막 텍스트
  type: string; // 분석 항목 타입
  description: string; // 설명
  severity?: "low" | "medium" | "high";
}

// 유튜브 편향성 분석 (타임스탬프 포함)
export interface YoutubeEmotionalBias {
  score: number; // 0-100 (높을수록 중립적)
  manipulativeWords: TimestampedManipulativeWord[];
  intensity: "none" | "low" | "medium" | "high";
}

export interface TimestampedManipulativeWord {
  word: string;
  timestamp: number; // 발생 시간 (초)
  category: "emotional" | "exaggeration" | "urgency" | "authority" | "fear";
  impact: "low" | "medium" | "high";
  explanation: string;
  contextText: string; // 주변 문맥
}

// 유튜브 클릭베이트 분석 (타임스탬프 포함)
export interface TimestampedClickbaitElement {
  type: "curiosity_gap" | "emotional_trigger" | "urgency" | "superlative";
  text: string;
  timestamp: number; // 발생 시간 (초)
  explanation: string;
  severity: "low" | "medium" | "high";
  isInTitle: boolean; // 제목에 포함된 클릭베이트인지
  isInThumbnail: boolean; // 썸네일 관련 클릭베이트인지
}

// 유튜브 광고 분석 (타임스탬프 포함)
export interface TimestampedAdvertisementIndicator {
  type:
    | "product_mention"
    | "affiliate_link"
    | "sponsored_content"
    | "promotional_language"
    | "call_to_action"
    | "brand_focus";
  evidence: string;
  timestamp: number; // 발생 시간 (초)
  explanation: string;
  severity: "low" | "medium" | "high";
  contextText: string; // 주변 문맥
}

// 유튜브 논리적 오류 (타임스탬프 포함)
export interface TimestampedLogicalFallacy {
  type: string;
  description: string;
  affectedText: string;
  timestamp: number; // 발생 시간 (초)
  endTime?: number; // 종료 시간 (선택적)
  severity: "low" | "medium" | "high";
  explanation: string;
  examples?: string[];
}

/**
 * 논지 분석 내의 개별 핵심 주장 (단순 추출)
 * (기존 keyClaims 배열의 아이템 타입을 대체)
 */
export interface KeyClaim {
  claim: string; // 핵심 주장 텍스트
  timestamp: number; // 발생 시간 (초)
  verificationKeywords: string[]; // (외부) 검증을 위한 키워드 추출
}

/**
 * 논지 분석 (영상 내부의 일관성 및 근거)
 */
export interface ArgumentAnalysis {
  // 1. 종합 분석 (영상 전체를 보고 판단)
  consistency: "high" | "medium" | "low" | "contradictory"; // 주장/논리의 일관성
  evidenceBasis: "strong" | "partial" | "unsubstantiated"; // 영상 '내부' 근거 제시 수준
  summary: string; // 영상의 논지 분석 요약

  // 2. 단순 추출 (영상에서 주장 + 키워드 뽑아냄)
  claims: KeyClaim[];
}

// 유튜브 비디오 신뢰도 분석 결과
export interface YoutubeTrustAnalysis {
  // 기본 비디오 정보
  videoInfo: YoutubeVideoInfo;
  transcript: VideoTranscript;

  // 전체 분석 결과
  overallScore: number; // 0-100
  analysisSummary: string;

  // 세부 점수
  detailedScores: {
    channelScore: number;
    objectivityScore: number;
    logicScore: number;
    advertisementScore: number;
    evidenceScore: number;
    thumbnailAccuracy: number; // 썸네일과 내용의 일치도
  };

  // 채널 신뢰도
  channelCredibility: {
    score: number; // 0-100
    level: "trusted" | "neutral" | "caution" | "unreliable";
    subscriberCount: number;
    verificationStatus: "verified" | "unverified";
    channelImageUrl: string;
    reputation: {
      description: string;
      factors: string[];
      contentQuality?: number; // 콘텐츠 품질 점수
      consistencyScore?: number; // 일관성 점수
    };
  };

  // 타임라인 기반 편향성 분석
  biasAnalysis: {
    emotionalBias: YoutubeEmotionalBias;
    politicalBias: PoliticalBias;
    clickbaitElements: TimestampedClickbaitElement[];
  };

  // 타임라인 기반 광고 분석
  advertisementAnalysis: {
    isAdvertorial: boolean;
    confidence: number;
    indicators: TimestampedAdvertisementIndicator[];
    nativeAdScore: number;
    commercialIntentScore: number;
    sponsoredSegments: Array<{
      start: number;
      end: number;
      type: "sponsored" | "product_placement" | "affiliate";
    }>;
  };

  // 타임라인 기반 논리적 오류
  logicalFallacies: TimestampedLogicalFallacy[];

  /**
   * 논지 분석 (핵심 주장 및 내부 논리)
   */
  argumentAnalysis: ArgumentAnalysis;

  // 경고 사항
  warnings: AnalysisWarning[];
}

// 유튜브 분석 요청
export interface YoutubeAnalysisRequest {
  url: string; // 유튜브 URL
  videoId?: string; // 비디오 ID (URL에서 추출 가능)
  analysisLevel?: "basic" | "detailed" | "comprehensive";
}

// ===== 분석 결과 통합 타입 =====

/**
 * 모든 분석 결과 타입의 유니온
 * 캐시 시스템에서 다양한 분석 타입을 처리하기 위해 사용
 */
export type AnalysisResult = TrustAnalysis | YoutubeTrustAnalysis;

/**
 * 타입 가드: TrustAnalysis 여부 확인
 */
export function isTrustAnalysis(
  analysis: AnalysisResult
): analysis is TrustAnalysis {
  return (
    "sourceCredibility" in analysis &&
    !("videoInfo" in analysis) &&
    !("transcript" in analysis)
  );
}

/**
 * 타입 가드: YoutubeTrustAnalysis 여부 확인
 */
export function isYoutubeTrustAnalysis(
  analysis: AnalysisResult
): analysis is YoutubeTrustAnalysis {
  return (
    "videoInfo" in analysis &&
    "transcript" in analysis &&
    "channelCredibility" in analysis
  );
}

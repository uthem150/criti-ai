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
  sourceCredibility: SourceCredibility;
  biasAnalysis: BiasAnalysis;
  logicalFallacies: LogicalFallacy[];
  crossReference: CrossReference;
}

// 출처 신뢰도
export interface SourceCredibility {
  score: number; // 0-100
  level: "trusted" | "neutral" | "caution" | "dangerous";
  domain: string;
  reputation: {
    description: string;
    factors: string[];
  };
}

// 편향성 분석
export interface BiasAnalysis {
  emotionalBias: EmotionalBias;
  politicalBias: PoliticalBias;
  highlightedTexts: HighlightedText[];
}

export interface EmotionalBias {
  score: number; // 0-100 (높을수록 감정적)
  manipulativeWords: string[];
  intensity: "low" | "medium" | "high";
}

export interface PoliticalBias {
  direction: "left" | "center" | "right" | "neutral";
  confidence: number; // 0-100
}

// 논리적 오류
export interface LogicalFallacy {
  type: string;
  description: string;
  affectedText: string;
  position: TextPosition;
  severity: "low" | "medium" | "high";
}

// 교차 검증
export interface CrossReference {
  relatedArticles: RelatedArticle[];
  consensus: "agree" | "disagree" | "mixed" | "insufficient";
}

export interface RelatedArticle {
  title: string;
  source: string;
  url: string;
  stance: "supporting" | "opposing" | "neutral";
}

// UI 관련 타입
export interface HighlightedText {
  text: string;
  type: "bias" | "fallacy" | "manipulation";
  position: TextPosition;
  explanation: string;
}

export interface TextPosition {
  start: number;
  end: number;
  selector: string;
}

// 챌린지 게임 타입
export interface Challenge {
  id: string;
  type: "article-analysis" | "image-detection" | "data-visualization";
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
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

// API 요청 타입
export interface AnalysisRequest {
  url: string;
  content: string;
  title?: string;
}

export interface ChallengeResponse {
  challengeId: string;
  userAnswers: string[];
  timeSpent: number;
}

import type {
  Challenge,
  ApiResponse,
  UserProgress,
  ChallengeResponse,
  YoutubeTrustAnalysis,
  YoutubeAnalysisRequest,
} from "@criti-ai/shared";
import { FALLBACK_CHALLENGES } from "../constants";
import { logger } from "../utils";

const API_BASE_URL = import.meta.env.PROD
  ? "/api"
  : (import.meta.env?.VITE_API_BASE_URL as string) || "/api";

const USER_ID_KEY = "criti-ai-user-id";

class ChallengeApiService {
  private baseUrl: string;
  private userId: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.userId = this.getOrCreateUserId();
    logger.info("🔗 ChallengeApiService 초기화:", this.baseUrl, "UserID:", this.userId);
  }

  /**
   * 브라우저별 고유 사용자 ID 생성/조회
   */
  private getOrCreateUserId(): string {
    try {
      let userId = localStorage.getItem(USER_ID_KEY);

      if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(USER_ID_KEY, userId);
        logger.info("🆕 새로운 사용자 ID 생성:", userId);
      } else {
        logger.info("👤 기존 사용자 ID 사용:", userId);
      }

      return userId;
    } catch (error) {
      logger.warn("⚠️ localStorage 사용 불가, 임시 ID 사용");
      return `temp_${Date.now()}`;
    }
  }

  /**
   * 현재 사용자 ID 반환
   */
  getCurrentUserId(): string {
    return this.userId;
  }

  /**
   * 오늘의 일일 챌린지들을 가져옵니다
   */
  async getTodaysChallenges(): Promise<Challenge[]> {
    try {
      logger.start("오늘의 챌린지 요청");

      const response = await fetch(`${this.baseUrl}/challenge/daily`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `API 요청 실패: ${response.status} ${response.statusText}`
        );
      }

      const data: ApiResponse<Challenge[]> = await response.json();

      if (!data.success) {
        throw new Error(data.error || "알 수 없는 오류가 발생했습니다");
      }

      logger.success("오늘의 챌린지 로드 성공:", data.data?.length || 0, "개");
      return data.data || [];
    } catch (error) {
      logger.error("오늘의 챌린지 로드 실패:", error);
      return FALLBACK_CHALLENGES;
    }
  }

  /**
   * 특정 챌린지 조회
   */
  async getChallenge(id: string): Promise<Challenge | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/challenge/challenges/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`API 요청 실패: ${response.status}`);
      }

      const data: ApiResponse<Challenge> = await response.json();
      return data.success ? data.data || null : null;
    } catch (error) {
      logger.error("챌린지 조회 실패:", error);
      return null;
    }
  }

  /**
   * 챌린지 답안 제출
   */
  async submitChallenge(
    challengeId: string,
    userAnswers: string[],
    timeSpent: number,
    hintsUsed: number = 0
  ): Promise<{
    isCorrect: boolean;
    correctAnswers: string[];
    explanation: string;
    score: number;
    bonusPoints?: number;
  } | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/challenge/challenges/${challengeId}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            challengeId,
            userAnswers,
            timeSpent,
            hintsUsed,
            userId: this.userId,
          } as ChallengeResponse),
        }
      );

      if (!response.ok) {
        throw new Error(`답안 제출 실패: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "답안 제출 실패");
      }

      logger.success("답안 제출 성공");
      return data.data;
    } catch (error) {
      logger.error("답안 제출 실패:", error);
      return null;
    }
  }

  /**
   * 사용자 진행도 조회
   */
  async getUserProgress(): Promise<UserProgress | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/challenge/progress/${this.userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`진행도 조회 실패: ${response.status}`);
      }

      const data: ApiResponse<UserProgress> = await response.json();
      return data.success ? data.data || null : null;
    } catch (error) {
      logger.error("사용자 진행도 조회 실패:", error);

      // 기본 진행도 반환
      return {
        userId: this.userId,
        totalPoints: 0,
        level: 1,
        badges: [],
        completedChallenges: [],
        analyticsUsed: 0,
      };
    }
  }

  /**
   * 헬스 체크
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.ok;
    } catch (error) {
      logger.error("백엔드 헬스 체크 실패:", error);
      return false;
    }
  }

  /**
   * 유튜브 영상 분석 (빠른 방식)
   */
  async analyzeYoutube(
    url: string
  ): Promise<ApiResponse<YoutubeTrustAnalysis>> {
    try {
      logger.start("유튜브 영상 분석:", url);

      const response = await fetch(`${this.baseUrl}/youtube/analyze-fast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
        } as YoutubeAnalysisRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `API 요청 실패: ${response.status}`
        );
      }

      const data: ApiResponse<YoutubeTrustAnalysis> = await response.json();

      if (!data.success) {
        throw new Error(data.error || "유튜브 영상 분석 실패");
      }

      logger.success("유튜브 영상 분석 성공");
      return data;
    } catch (error) {
      logger.error("유튜브 영상 분석 실패:", error);
      throw error;
    }
  }

  /**
   * 유튜브 URL 유효성 검사
   */
  async validateYoutubeUrl(url: string): Promise<{
    valid: boolean;
    normalizedUrl?: string;
    message?: string;
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/youtube/validate?url=${encodeURIComponent(url)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        return {
          valid: false,
          message: "URL 검증 중 오류가 발생했습니다.",
        };
      }

      const data = await response.json();
      return {
        valid: data.valid || false,
        normalizedUrl: data.normalizedUrl,
        message: data.message,
      };
    } catch (error) {
      logger.error("URL 검증 실패:", error);
      return {
        valid: false,
        message: "URL 검증 중 오류가 발생했습니다.",
      };
    }
  }
}

// 싱글톤 인스턴스 생성
export const challengeApiService = new ChallengeApiService();
export default challengeApiService;

import type { Challenge, ApiResponse, UserProgress, ChallengeResponse } from "@criti-ai/shared";

const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL as string) || '/api';

class ChallengeApiService {
  private baseUrl: string;
  private userId: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.userId = this.getOrCreateUserId();
    console.log('🔗 ChallengeApiService 초기화:', this.baseUrl, 'UserID:', this.userId);
  }

  /**
   * 브라우저별 고유 사용자 ID 생성/조회
   */
  private getOrCreateUserId(): string {
    try {
      // localStorage에서 기존 ID 확인
      let userId = localStorage.getItem('criti-ai-user-id');
      
      if (!userId) {
        // 새로운 고유 ID 생성
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('criti-ai-user-id', userId);
        console.log('🆕 새로운 사용자 ID 생성:', userId);
      } else {
        console.log('👤 기존 사용자 ID 사용:', userId);
      }
      
      return userId;
    } catch (error) {
      // localStorage 사용 불가 시 fallback
      console.warn('⚠️ localStorage 사용 불가, 임시 ID 사용');
      return 'temp_' + Date.now();
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
      console.log('🎯 오늘의 챌린지 요청 시작');
      
      const response = await fetch(`${this.baseUrl}/api/challenge/daily`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
      }

      const data: ApiResponse<Challenge[]> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || '알 수 없는 오류가 발생했습니다');
      }

      console.log('✅ 오늘의 챌린지 로드 성공:', data.data?.length || 0, '개');
      return data.data || [];
    } catch (error) {
      console.error('❌ 오늘의 챌린지 로드 실패:', error);
      
      // 에러 시 기본 챌린지 반환
      return this.getFallbackChallenges();
    }
  }

  /**
   * 특정 챌린지 조회
   */
  async getChallenge(id: string): Promise<Challenge | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/challenge/challenges/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`API 요청 실패: ${response.status}`);
      }

      const data: ApiResponse<Challenge> = await response.json();
      return data.success ? data.data || null : null;
    } catch (error) {
      console.error('챌린지 조회 실패:', error);
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
      const response = await fetch(`${this.baseUrl}/api/challenge/challenges/${challengeId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          challengeId,
          userAnswers,
          timeSpent,
          hintsUsed,
          userId: this.userId // 동적 사용자 ID 사용
        } as ChallengeResponse),
      });

      if (!response.ok) {
        throw new Error(`답안 제출 실패: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || '답안 제출 실패');
      }

      console.log('✅ 답안 제출 성공');
      return data.data;
    } catch (error) {
      console.error('❌ 답안 제출 실패:', error);
      return null;
    }
  }

  /**
   * 사용자 진행도 조회
   */
  async getUserProgress(): Promise<UserProgress | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/challenge/progress/${this.userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`진행도 조회 실패: ${response.status}`);
      }

      const data: ApiResponse<UserProgress> = await response.json();
      return data.success ? data.data || null : null;
    } catch (error) {
      console.error('사용자 진행도 조회 실패:', error);
      
      // 기본 진행도 반환
      return {
        userId: this.userId,
        totalPoints: 0,
        level: 1,
        badges: [],
        completedChallenges: [],
        analyticsUsed: 0
      };
    }
  }

  /**
   * 헬스 체크
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('백엔드 헬스 체크 실패:', error);
      return false;
    }
  }

  /**
   * 에러 시 기본 챌린지 반환
   */
  private getFallbackChallenges(): Challenge[] {
    console.log('🔄 기본 챌린지 사용');
    
    return [
      {
        id: "fallback-1",
        type: "article-analysis",
        title: "이 기사에서 논리적 오류를 찾아보세요",
        content: `
          "최근 한 연구에 따르면 스마트폰을 많이 사용하는 청소년들의 성적이 떨어진다고 합니다. 
          실제로 우리 학교 1등 학생인 김OO도 스마트폰을 거의 사용하지 않습니다. 
          따라서 모든 청소년들은 반드시 스마트폰 사용을 중단해야 합니다.
          이것은 과학적으로 증명된 사실이므로 의심의 여지가 없습니다."
        `,
        correctAnswers: ["성급한 일반화", "허위 이분법"],
        explanation: `
          이 글에는 여러 논리적 오류가 있습니다:
          1. **성급한 일반화**: 한 연구와 한 명의 사례만으로 모든 청소년에게 적용
          2. **허위 이분법**: 스마트폰을 "완전히 사용하지 않거나" 또는 "많이 사용하거나" 둘 중 하나로만 제시
          3. **권위에 호소**: "과학적으로 증명된 사실"이라며 의심을 차단하려는 시도
        `,
        difficulty: "beginner",
        points: 100,
      },
      {
        id: "fallback-2",
        type: "article-analysis",
        title: "편향된 표현을 찾아보세요",
        content: `
          "충격적인 발표! 정부의 새로운 정책이 국민들을 분노하게 만들고 있습니다. 
          이 말도 안 되는 정책으로 인해 모든 국민이 피해를 보고 있으며, 
          반드시 즉시 철회되어야 합니다. 전문가들은 이구동성으로 비판하고 있습니다."
        `,
        correctAnswers: ["감정적 편향", "과장된 표현"],
        explanation: `
          이 글의 편향된 표현들:
          1. **감정적 편향**: "충격적인", "분노하게", "말도 안 되는" 등 감정을 자극하는 표현
          2. **과장된 표현**: "모든 국민", "반드시 즉시", "이구동성으로" 등 절대적 표현
          3. **선동적 언어**: 객관적 사실보다는 감정적 반응을 유도하는 언어 사용
        `,
        difficulty: "beginner",
        points: 80,
      },
      {
        id: "fallback-3",
        type: "article-analysis", 
        title: "광고성 콘텐츠를 판별해보세요",
        content: `
          "건강을 지키는 혁신적인 방법! 최근 수많은 연예인들이 선택한 '슈퍼푸드 X'가 화제입니다.
          임상실험 결과 98%의 사용자가 만족했다고 합니다. 지금 주문하시면 50% 할인!
          단 3일만 남았습니다. 더 이상 망설이지 마세요. 건강한 삶을 위한 선택은 오직 하나뿐입니다."
        `,
        correctAnswers: ["광고성 콘텐츠", "긴급성 유도", "과장된 수치"],
        explanation: `
          이 텍스트는 전형적인 광고성 콘텐츠입니다:
          1. **광고성 콘텐츠**: 제품 홍보가 명확한 목적인 콘텐츠
          2. **긴급성 유도**: "단 3일만", "더 이상 망설이지 마세요" 등으로 즉시 구매를 유도
          3. **과장된 수치**: "98% 만족"과 같은 구체적이지만 검증되지 않은 통계
          4. **권위 차용**: "수많은 연예인들이 선택"으로 신뢰도를 높이려는 시도
        `,
        difficulty: "intermediate",
        points: 120,
      }
    ];
  }
}

// 싱글톤 인스턴스 생성
export const challengeApiService = new ChallengeApiService();
export default challengeApiService;

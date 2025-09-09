import { GeminiService } from "./GeminiService.js";
import { databaseService } from "./DatabaseService.js";
import type { Challenge } from "@criti-ai/shared";

export class DailyChallengeService {
  private static instance: DailyChallengeService;
  private geminiService: GeminiService;

  private constructor() {
    this.geminiService = new GeminiService();
  }

  public static getInstance(): DailyChallengeService {
    if (!DailyChallengeService.instance) {
      DailyChallengeService.instance = new DailyChallengeService();
    }
    return DailyChallengeService.instance;
  }

  /**
   * 오늘의 챌린지들을 조회. 없으면 생성.
   */
  async getTodaysChallenges(): Promise<Challenge[]> {
    try {
      console.log("🎯 오늘의 챌린지 조회 시작");
      
      const today = this.getTodayDateString();
      
      // 오늘 생성된 챌린지가 있는지 확인
      const existingChallenges = await databaseService.getDailyChallenges(today);
      
      if (existingChallenges && existingChallenges.length > 0) {
        console.log(`✅ 오늘(${today})의 챌린지 ${existingChallenges.length}개 발견`);
        return existingChallenges;
      }

      // 없으면 새로 생성
      console.log(`🔄 오늘(${today})의 챌린지 생성 시작`);
      const newChallenges = await this.generateDailyChallenges(today);
      
      console.log(`✅ 오늘의 챌린지 ${newChallenges.length}개 생성 완료`);
      return newChallenges;
    } catch (error) {
      console.error("❌ 오늘의 챌린지 조회/생성 실패:", error);
      
      // 에러 시 기본 챌린지 반환
      return this.getFallbackChallenges();
    }
  }

  /**
   * 매일 실행되는 챌린지 생성 작업
   */
  async generateDailyChallenges(dateKey?: string): Promise<Challenge[]> {
    const today = dateKey || this.getTodayDateString();
    console.log(`🤖 ${today} 일일 챌린지 생성 시작`);

    const challengeTemplates = [
      { type: "article-analysis", difficulty: "beginner", topic: "논리적 오류" },
      { type: "article-analysis", difficulty: "beginner", topic: "편향 표현" },
      { type: "article-analysis", difficulty: "intermediate", topic: "광고성 콘텐츠" },
      { type: "article-analysis", difficulty: "intermediate", topic: "정보 출처" },
      { type: "article-analysis", difficulty: "advanced", topic: "복합적 문제" },
    ];

    const generatedChallenges: Challenge[] = [];

    for (const template of challengeTemplates) {
      try {
        console.log(`🔄 챌린지 생성 중: ${template.difficulty} - ${template.topic}`);
        
        const aiChallenge = await this.geminiService.generateChallenge(
          template.type, 
          template.difficulty
        );

        // AI가 생성한 챌린지를 DB에 저장
        const challenge = await databaseService.createChallenge({
          type: template.type,
          title: aiChallenge.title as string,
          content: aiChallenge.content as string,
          difficulty: template.difficulty,
          points: aiChallenge.points as number,
          correctAnswers: JSON.stringify(aiChallenge.correctAnswers),
          explanation: aiChallenge.explanation as string,
          hints: aiChallenge.hints ? JSON.stringify(aiChallenge.hints) : null,
          isGenerated: true,
          isActive: true,
          dailyKey: today, // 일일 키 추가
        });

        generatedChallenges.push(challenge);
        console.log(`✅ 챌린지 생성 완료: ${challenge.title}`);
        
        // API 호출 간격 조절 (비용 절약)
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ 챌린지 생성 실패 (${template.difficulty} - ${template.topic}):`, error);
        
        // 에러 시 기본 챌린지 추가
        const fallbackChallenge = await this.createFallbackChallenge(template, today);
        if (fallbackChallenge) {
          generatedChallenges.push(fallbackChallenge);
        }
      }
    }

    console.log(`✅ ${today} 일일 챌린지 생성 완료: ${generatedChallenges.length}개`);
    return generatedChallenges;
  }

  /**
   * 에러 시 기본 챌린지 생성
   */
  private async createFallbackChallenge(
    template: { type: string; difficulty: string; topic: string }, 
    dailyKey: string
  ): Promise<Challenge | null> {
    try {
      const fallbackContent = this.getFallbackContent(template.difficulty, template.topic);
      
      return await databaseService.createChallenge({
        type: template.type,
        title: fallbackContent.title,
        content: fallbackContent.content,
        difficulty: template.difficulty,
        points: fallbackContent.points,
        correctAnswers: JSON.stringify(fallbackContent.correctAnswers),
        explanation: fallbackContent.explanation,
        hints: JSON.stringify(fallbackContent.hints),
        isGenerated: false,
        isActive: true,
        dailyKey,
      });
    } catch (error) {
      console.error("기본 챌린지 생성 실패:", error);
      return null;
    }
  }

  /**
   * 완전 백업용 챌린지들
   */
  private getFallbackChallenges(): Challenge[] {
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
        hints: ["문장별로 나누어 생각해보세요", "일반화의 범위를 확인해보세요"]
      }
    ];
  }

  /**
   * 템플릿별 기본 콘텐츠
   */
  private getFallbackContent(difficulty: string, topic: string): {
    title: string;
    content: string;
    correctAnswers: string[];
    explanation: string;
    points: number;
    hints: string[];
  } {
    const contents: Record<string, {
      title: string;
      content: string;
      correctAnswers: string[];
      explanation: string;
      points: number;
      hints: string[];
    }> = {
      "beginner-논리적 오류": {
        title: "논리적 오류 찾기 - 초급",
        content: "모든 연예인들이 이 제품을 사용한다고 하니, 우리도 반드시 사용해야 합니다. 이것은 틀림없는 사실입니다.",
        correctAnswers: ["권위에 호소", "논증 없는 주장"],
        explanation: "권위에 호소하는 오류와 근거 없는 단정을 포함하고 있습니다.",
        points: 80,
        hints: ["누구의 말인지 보다는 근거를 확인해보세요"]
      },
      "beginner-편향 표현": {
        title: "편향 표현 찾기 - 초급", 
        content: "충격적인 사실! 이 놀라운 비밀을 모르면 절대로 성공할 수 없습니다.",
        correctAnswers: ["감정적 편향", "과장된 표현"],
        explanation: "감정을 자극하는 표현과 과장된 언어를 사용하고 있습니다.",
        points: 80,
        hints: ["감정을 자극하는 단어들을 찾아보세요"]
      }
    };

    const key = `${difficulty}-${topic}`;
    return contents[key] || contents["beginner-논리적 오류"];
  }

  /**
   * 오늘 날짜 문자열 반환 (YYYY-MM-DD)
   */
  private getTodayDateString(): string {
    const today = new Date();
    const kstOffset = 9 * 60; // 한국시간 오프셋
    const kstTime = new Date(today.getTime() + (kstOffset * 60 * 1000));
    return kstTime.toISOString().split('T')[0];
  }

  /**
   * 스케줄러: 매일 자정에 실행
   */
  startDailyScheduler() {
    console.log("⏰ 일일 챌린지 스케줄러 시작");
    
    // 매일 자정 (KST) 실행
    const scheduleNextGeneration = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0); // 자정으로 설정
      
      const msUntilMidnight = tomorrow.getTime() - now.getTime();
      
      setTimeout(async () => {
        console.log("🌅 자정 도달 - 새로운 일일 챌린지 생성 시작");
        try {
          await this.generateDailyChallenges();
          console.log("✅ 일일 챌린지 생성 완료");
        } catch (error) {
          console.error("❌ 일일 챌린지 생성 실패:", error);
        }
        
        // 다음 자정 스케줄 설정
        scheduleNextGeneration();
      }, msUntilMidnight);
      
      console.log(`⏰ 다음 챌린지 생성 예정: ${tomorrow.toLocaleString('ko-KR')}`);
    };

    scheduleNextGeneration();
  }
}

export const dailyChallengeService = DailyChallengeService.getInstance();

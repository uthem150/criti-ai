import { PrismaClient } from "@prisma/client";
import type {
  AnalysisResult,
  Challenge,
  UserProgress,
  Badge,
  ChallengeResponse,
  ChallengeOption, // ChallengeOption 타입을 임포트해야 할 수 있습니다. (types.ts에 있다면)
} from "@criti-ai/shared";

class DatabaseService {
  private static instance: DatabaseService;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // 데이터베이스 연결 확인
  async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      console.log("✅ 데이터베이스 연결 성공");
    } catch (error) {
      console.error("❌ 데이터베이스 연결 실패:", error);
      throw error;
    }
  }

  // 연결 종료
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
    console.log("✅ 데이터베이스 연결 종료");
  }

  // === 분석 캐시 관련 ===
  // 특정 URL에 대한 분석 결과를 데이터베이스의 AnalysisCache 테이블에 저장하거나, 이미 존재한다면 업데이트
  async saveAnalysisToCache(
    url: string,
    analysis: AnalysisResult,
    title?: string,
    contentType?: string
  ): Promise<void> {
    try {
      // 1. 필요한 메타데이터 준비
      const domain = new URL(url).hostname;
      const urlHash = Buffer.from(url).toString("base64");
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24시간 후

      // 2. Prisma의 upsert 메서드 사용
      await this.prisma.analysisCache.upsert({
        where: { url }, // 이 URL로 데이터를 먼저 찾는다
        update: {
          // 데이터가 있으면 이 내용을 실행
          analysis: JSON.stringify(analysis),
          overallScore: analysis.overallScore,
          title,
          contentType,
          hitCount: { increment: 1 }, // 조회 수를 1 증가시킨다
          lastAccessedAt: new Date(),
          expiresAt, // 만료 시간도 갱신
        },
        create: {
          // 데이터가 없으면 이 내용을 실행
          url,
          urlHash,
          domain,
          title,
          contentType,
          analysis: JSON.stringify(analysis),
          overallScore: analysis.overallScore,
          expiresAt,
        },
      });

      console.log(`✅ 분석 결과 DB 저장: ${url}`);
    } catch (error) {
      console.error("분석 결과 DB 저장 실패:", error);
    }
  }

  // 데이터베이스에 저장된 유효한 분석 결과가 있는지 확인하고 가져옴
  async getAnalysisFromCache(url: string): Promise<AnalysisResult | null> {
    try {
      // 1. URL로 캐시 데이터 조회
      const cached = await this.prisma.analysisCache.findUnique({
        where: { url },
      });

      // 2. Cache Miss: 데이터가 없는 경우
      if (!cached) {
        return null;
      }

      // 3. Cache Miss: 데이터가 만료된 경우
      if (new Date() > cached.expiresAt) {
        await this.prisma.analysisCache.delete({ where: { url } });
        return null;
      }

      // 4. Cache Hit: 유효한 데이터가 있는 경우
      await this.prisma.analysisCache.update({
        where: { url },
        data: {
          hitCount: { increment: 1 }, // 조회 수 1 증가
          lastAccessedAt: new Date(),
        },
      });

      // 5. JSON 문자열을 객체로 변환하여 반환
      return JSON.parse(cached.analysis) as AnalysisResult;
    } catch (error) {
      console.error("분석 결과 DB 조회 실패:", error);
      return null;
    }
  }

  // === 사용자 관련 ===

  async createUser(data: {
    id?: string;
    email?: string;
    username?: string;
    displayName?: string;
  }): Promise<string> {
    const user = await this.prisma.user.create({
      data,
    });
    return user.id;
  }

  async getUserProgress(userId: string): Promise<UserProgress | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          badges: {
            include: {
              badge: true,
            },
          },
          challengeResults: {
            include: {
              challenge: true,
            },
          },
        },
      });

      if (!user) {
        return null;
      }

      const completedChallenges = user.challengeResults.map(
        (r) => r.challengeId
      );
      const badges = user.badges.map((ub) => ({
        id: ub.badge.id,
        name: ub.badge.name,
        description: ub.badge.description,
        icon: ub.badge.icon,
        earnedAt: ub.earnedAt.toISOString(),
        category: ub.badge.category as
          | "analysis"
          | "training"
          | "milestone"
          | "special",
      }));

      return {
        userId: user.id,
        totalPoints: user.totalPoints,
        level: user.level,
        badges,
        completedChallenges,
        analyticsUsed: user.analyticsUsed,
      };
    } catch (error) {
      console.error("사용자 진행도 조회 실패:", error);
      return null;
    }
  }

  // === 챌린지 관련 ===

  async getAllChallenges(difficulty?: string): Promise<Challenge[]> {
    try {
      const challenges = await this.prisma.challenge.findMany({
        where: {
          isActive: true,
          ...(difficulty && { difficulty }),
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return challenges.map((c) => ({
        id: c.id,
        type: c.type as Challenge["type"],
        title: c.title,
        // content: c.content, // 삭제
        options: JSON.parse(c.options || "[]") as ChallengeOption[], // 추가
        category: c.category || undefined, // 추가
        correctAnswers: JSON.parse(c.correctAnswers),
        explanation: c.explanation,
        difficulty: c.difficulty as Challenge["difficulty"],
        points: c.points,
        hints: c.hints ? JSON.parse(c.hints) : undefined, // hints 파싱 추가
      }));
    } catch (error) {
      console.error("챌린지 조회 실패:", error);
      return [];
    }
  }

  async getChallenge(id: string): Promise<Challenge | null> {
    try {
      const challenge = await this.prisma.challenge.findUnique({
        where: { id, isActive: true },
      });

      if (!challenge) {
        return null;
      }

      return {
        id: challenge.id,
        type: challenge.type as Challenge["type"],
        title: challenge.title,
        // content: challenge.content, // 삭제
        options: JSON.parse(challenge.options || "[]") as ChallengeOption[], // 추가
        category: challenge.category || undefined, // 추가
        correctAnswers: JSON.parse(challenge.correctAnswers),
        explanation: challenge.explanation,
        difficulty: challenge.difficulty as Challenge["difficulty"],
        points: challenge.points,
        hints: challenge.hints ? JSON.parse(challenge.hints) : undefined, // hints 파싱 추가
      };
    } catch (error) {
      console.error("챌린지 조회 실패:", error);
      return null;
    }
  }

  async saveChallengeResult(
    userId: string,
    challengeId: string,
    response: ChallengeResponse,
    isCorrect: boolean,
    score: number,
    bonusPoints: number = 0
  ): Promise<void> {
    try {
      await this.prisma.challengeResult.create({
        data: {
          userId,
          challengeId,
          userAnswers: JSON.stringify(response.userAnswers),
          isCorrect,
          score,
          bonusPoints,
          timeSpent: response.timeSpent,
          hintsUsed: response.hintsUsed || 0,
        },
      });

      // 챌린지 통계 업데이트
      await this.prisma.challenge.update({
        where: { id: challengeId },
        data: {
          totalAttempts: { increment: 1 },
        },
      });

      // 사용자 점수 업데이트
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          totalPoints: { increment: score + bonusPoints },
          lastActiveAt: new Date(),
        },
      });

      console.log(`✅ 챌린지 결과 저장: ${userId} -> ${challengeId}`);
    } catch (error) {
      console.error("챌린지 결과 저장 실패:", error);
    }
  }

  // === 일일 챌린지 관련 ===

  async getDailyChallenges(dateKey: string): Promise<Challenge[]> {
    try {
      const challenges = await this.prisma.challenge.findMany({
        where: {
          isActive: true,
          ...(dateKey && { dailyKey: dateKey }),
        },
        orderBy: {
          difficulty: "asc",
        },
      });

      // [수정됨] 새 Challenge 타입에 맞게 반환
      return challenges.map((c) => ({
        id: c.id,
        type: c.type as Challenge["type"],
        title: c.title,
        // content: c.content, // 삭제
        options: JSON.parse(c.options || "[]") as ChallengeOption[], // 추가
        category: c.category || undefined, // 추가
        correctAnswers: JSON.parse(c.correctAnswers),
        explanation: c.explanation,
        difficulty: c.difficulty as Challenge["difficulty"],
        points: c.points,
        hints: c.hints ? JSON.parse(c.hints) : undefined, // hints 파싱 추가
      }));
    } catch (error) {
      console.error("일일 챌린지 조회 실패:", error);
      return [];
    }
  }

  // [수정됨] createChallenge 함수 시그니처 및 구현 변경
  async createChallenge(data: {
    type: string;
    title: string;
    // content: string; // 삭제
    options: string; // 추가 (JSON 문자열)
    category: string; // 추가
    difficulty: string;
    points: number;
    correctAnswers: string; // JSON 문자열 (예: ["1"])
    explanation: string;
    hints?: string | null; // JSON 문자열 (예: ["힌트1"])
    isGenerated: boolean;
    isActive: boolean;
    dailyKey?: string;
  }): Promise<Challenge> {
    try {
      const challenge = await this.prisma.challenge.create({
        data: {
          type: data.type,
          title: data.title,
          // content: data.content, // 삭제
          options: data.options, // 추가
          category: data.category, // 추가
          difficulty: data.difficulty,
          points: data.points,
          correctAnswers: data.correctAnswers,
          explanation: data.explanation,
          hints: data.hints,
          isGenerated: data.isGenerated,
          isActive: data.isActive,
          ...(data.dailyKey && { dailyKey: data.dailyKey }),
        },
      });

      // [수정됨] 새 Challenge 타입에 맞게 반환
      return {
        id: challenge.id,
        type: challenge.type as Challenge["type"],
        title: challenge.title,
        // content: challenge.content, // 삭제
        options: JSON.parse(challenge.options || "[]") as ChallengeOption[], // 추가
        category: challenge.category || undefined, // 추가
        correctAnswers: JSON.parse(challenge.correctAnswers),
        explanation: challenge.explanation,
        difficulty: challenge.difficulty as Challenge["difficulty"],
        points: challenge.points,
        hints: challenge.hints ? JSON.parse(challenge.hints) : undefined, // hints 파싱 추가
      };
    } catch (error) {
      console.error("챌린지 생성 실패:", error);
      throw error;
    }
  }

  // === 배지 관련 ===

  async checkAndAwardBadges(userId: string): Promise<Badge[]> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          badges: { include: { badge: true } },
          challengeResults: true,
        },
      });

      if (!user) {
        return [];
      }

      const earnedBadgeIds = user.badges.map((ub) => ub.badgeId);
      const availableBadges = await this.prisma.badge.findMany({
        where: {
          isActive: true,
          id: { notIn: earnedBadgeIds },
        },
      });

      const newBadges: Badge[] = [];

      for (const badge of availableBadges) {
        let shouldAward = false;

        // 포인트 기반 배지
        if (badge.pointsRequired && user.totalPoints >= badge.pointsRequired) {
          shouldAward = true;
        }

        // 챌린지 완료 기반 배지
        if (
          badge.challengesRequired &&
          user.challengeResults.length >= badge.challengesRequired
        ) {
          shouldAward = true;
        }

        if (shouldAward) {
          await this.prisma.userBadge.create({
            data: {
              userId,
              badgeId: badge.id,
            },
          });

          newBadges.push({
            id: badge.id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            earnedAt: new Date().toISOString(),
            category: badge.category as Badge["category"],
          });
        }
      }

      return newBadges;
    } catch (error) {
      console.error("배지 확인 실패:", error);
      return [];
    }
  }

  // === 통계 관련 ===

  async updateAnalysisStats(date: Date): Promise<void> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const totalAnalyses = await this.prisma.analysisCache.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      const analyses = await this.prisma.analysisCache.findMany({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      const averageScore =
        analyses.length > 0
          ? analyses.reduce((sum, a) => sum + a.overallScore, 0) /
            analyses.length
          : 0;

      await this.prisma.analysisStats.upsert({
        where: { date: startOfDay },
        update: {
          totalAnalyses,
          averageScore,
        },
        create: {
          date: startOfDay,
          totalAnalyses,
          averageScore,
        },
      });
    } catch (error) {
      console.error("분석 통계 업데이트 실패:", error);
    }
  }

  // === 유틸리티 ===
  // 주기적으로 호출되어 데이터베이스에 쌓인 모든 만료된 캐시 데이터를 한 번에 정리
  async cleanExpiredCache(): Promise<void> {
    try {
      const result = await this.prisma.analysisCache.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(), // 만료 시간이 현재 시간보다 이전(less than)인 모든 데이터
          },
        },
      });

      console.log(`🗑️ 만료된 캐시 ${result.count}개 삭제`);
    } catch (error) {
      console.error("만료된 캐시 삭제 실패:", error);
    }
  }

  // Prisma 클라이언트 직접 접근 (고급 쿼리용)
  get client() {
    return this.prisma;
  }
}

// 싱글톤 인스턴스 export
export const databaseService = DatabaseService.getInstance();

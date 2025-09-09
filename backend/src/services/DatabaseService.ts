import { PrismaClient } from '@prisma/client';
import type { 
  TrustAnalysis, 
  Challenge, 
  UserProgress, 
  Badge,
  ChallengeResponse 
} from '@criti-ai/shared';

class DatabaseService {
  private static instance: DatabaseService;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
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
      console.log('✅ 데이터베이스 연결 성공');
    } catch (error) {
      console.error('❌ 데이터베이스 연결 실패:', error);
      throw error;
    }
  }

  // 연결 종료
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
    console.log('✅ 데이터베이스 연결 종료');
  }

  // === 분석 캐시 관련 ===

  async saveAnalysisToCache(
    url: string, 
    analysis: TrustAnalysis, 
    title?: string,
    contentType?: string
  ): Promise<void> {
    try {
      const domain = new URL(url).hostname;
      const urlHash = Buffer.from(url).toString('base64');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24시간 후

      await this.prisma.analysisCache.upsert({
        where: { url },
        update: {
          analysis: JSON.stringify(analysis),
          overallScore: analysis.overallScore,
          title,
          contentType,
          hitCount: { increment: 1 },
          lastAccessedAt: new Date(),
          expiresAt
        },
        create: {
          url,
          urlHash,
          domain,
          title,
          contentType,
          analysis: JSON.stringify(analysis),
          overallScore: analysis.overallScore,
          expiresAt
        }
      });

      console.log(`✅ 분석 결과 DB 저장: ${url}`);
    } catch (error) {
      console.error('분석 결과 DB 저장 실패:', error);
    }
  }

  async getAnalysisFromCache(url: string): Promise<TrustAnalysis | null> {
    try {
      const cached = await this.prisma.analysisCache.findUnique({
        where: { url }
      });

      if (!cached) {
        return null;
      }

      // 만료 확인
      if (new Date() > cached.expiresAt) {
        await this.prisma.analysisCache.delete({ where: { url } });
        return null;
      }

      // 히트 카운트 증가
      await this.prisma.analysisCache.update({
        where: { url },
        data: { 
          hitCount: { increment: 1 },
          lastAccessedAt: new Date()
        }
      });

      return JSON.parse(cached.analysis) as TrustAnalysis;
    } catch (error) {
      console.error('분석 결과 DB 조회 실패:', error);
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
      data
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
              badge: true
            }
          },
          challengeResults: {
            include: {
              challenge: true
            }
          }
        }
      });

      if (!user) {
        return null;
      }

      const completedChallenges = user.challengeResults.map(r => r.challengeId);
      const badges = user.badges.map(ub => ({
        id: ub.badge.id,
        name: ub.badge.name,
        description: ub.badge.description,
        icon: ub.badge.icon,
        earnedAt: ub.earnedAt.toISOString(),
        category: ub.badge.category as "analysis" | "training" | "milestone" | "special"
      }));

      return {
        userId: user.id,
        totalPoints: user.totalPoints,
        level: user.level,
        badges,
        completedChallenges,
        analyticsUsed: user.analyticsUsed
      };
    } catch (error) {
      console.error('사용자 진행도 조회 실패:', error);
      return null;
    }
  }

  // === 챌린지 관련 ===

  async getAllChallenges(difficulty?: string): Promise<Challenge[]> {
    try {
      const challenges = await this.prisma.challenge.findMany({
        where: {
          isActive: true,
          ...(difficulty && { difficulty })
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return challenges.map(c => ({
        id: c.id,
        type: c.type as Challenge['type'],
        title: c.title,
        content: c.content,
        correctAnswers: JSON.parse(c.correctAnswers),
        explanation: c.explanation,
        difficulty: c.difficulty as Challenge['difficulty'],
        points: c.points
      }));
    } catch (error) {
      console.error('챌린지 조회 실패:', error);
      return [];
    }
  }

  async getChallenge(id: string): Promise<Challenge | null> {
    try {
      const challenge = await this.prisma.challenge.findUnique({
        where: { id, isActive: true }
      });

      if (!challenge) {
        return null;
      }

      return {
        id: challenge.id,
        type: challenge.type as Challenge['type'],
        title: challenge.title,
        content: challenge.content,
        correctAnswers: JSON.parse(challenge.correctAnswers),
        explanation: challenge.explanation,
        difficulty: challenge.difficulty as Challenge['difficulty'],
        points: challenge.points
      };
    } catch (error) {
      console.error('챌린지 조회 실패:', error);
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
          hintsUsed: response.hintsUsed || 0
        }
      });

      // 챌린지 통계 업데이트
      await this.prisma.challenge.update({
        where: { id: challengeId },
        data: {
          totalAttempts: { increment: 1 }
        }
      });

      // 사용자 점수 업데이트
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          totalPoints: { increment: score + bonusPoints },
          lastActiveAt: new Date()
        }
      });

      console.log(`✅ 챌린지 결과 저장: ${userId} -> ${challengeId}`);
    } catch (error) {
      console.error('챌린지 결과 저장 실패:', error);
    }
  }

  // === 일일 챌린지 관련 ===

  async getDailyChallenges(dateKey: string): Promise<Challenge[]> {
    try {
      const challenges = await this.prisma.challenge.findMany({
        where: {
          isActive: true,
          ...(dateKey && { dailyKey: dateKey as any })  // 임시 타입 단언
        },
        orderBy: {
          difficulty: 'asc'
        }
      });

      return challenges.map(c => ({
        id: c.id,
        type: c.type as any,
        title: c.title,
        content: c.content,
        correctAnswers: JSON.parse(c.correctAnswers),
        explanation: c.explanation,
        difficulty: c.difficulty as any,
        points: c.points
      }));
    } catch (error) {
      console.error('일일 챌린지 조회 실패:', error);
      return [];
    }
  }

  async createChallenge(data: {
    type: string;
    title: string;
    content: string;
    difficulty: string;
    points: number;
    correctAnswers: string;
    explanation: string;
    hints?: string | null;
    isGenerated: boolean;
    isActive: boolean;
    dailyKey?: string;
  }): Promise<Challenge> {
    try {
      const challenge = await this.prisma.challenge.create({
        data: {
          type: data.type,
          title: data.title,
          content: data.content,
          difficulty: data.difficulty,
          points: data.points,
          correctAnswers: data.correctAnswers,
          explanation: data.explanation,
          hints: data.hints,
          isGenerated: data.isGenerated,
          isActive: data.isActive,
          ...(data.dailyKey && { dailyKey: data.dailyKey as any })  // 임시 타입 단언
        }
      });

      return {
        id: challenge.id,
        type: challenge.type as Challenge['type'],
        title: challenge.title,
        content: challenge.content,
        correctAnswers: JSON.parse(challenge.correctAnswers),
        explanation: challenge.explanation,
        difficulty: challenge.difficulty as Challenge['difficulty'],
        points: challenge.points
      };
    } catch (error) {
      console.error('챌린지 생성 실패:', error);
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
          challengeResults: true
        }
      });

      if (!user) {
        return [];
      }

      const earnedBadgeIds = user.badges.map(ub => ub.badgeId);
      const availableBadges = await this.prisma.badge.findMany({
        where: {
          isActive: true,
          id: { notIn: earnedBadgeIds }
        }
      });

      const newBadges: Badge[] = [];

      for (const badge of availableBadges) {
        let shouldAward = false;

        // 포인트 기반 배지
        if (badge.pointsRequired && user.totalPoints >= badge.pointsRequired) {
          shouldAward = true;
        }

        // 챌린지 완료 기반 배지
        if (badge.challengesRequired && user.challengeResults.length >= badge.challengesRequired) {
          shouldAward = true;
        }

        if (shouldAward) {
          await this.prisma.userBadge.create({
            data: {
              userId,
              badgeId: badge.id
            }
          });

          newBadges.push({
            id: badge.id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            earnedAt: new Date().toISOString(),
            category: badge.category as Badge['category']
          });
        }
      }

      return newBadges;
    } catch (error) {
      console.error('배지 확인 실패:', error);
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
            lte: endOfDay
          }
        }
      });

      const analyses = await this.prisma.analysisCache.findMany({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      });

      const averageScore = analyses.length > 0 
        ? analyses.reduce((sum, a) => sum + a.overallScore, 0) / analyses.length 
        : 0;

      await this.prisma.analysisStats.upsert({
        where: { date: startOfDay },
        update: {
          totalAnalyses,
          averageScore
        },
        create: {
          date: startOfDay,
          totalAnalyses,
          averageScore
        }
      });
    } catch (error) {
      console.error('분석 통계 업데이트 실패:', error);
    }
  }

  // === 유틸리티 ===

  async cleanExpiredCache(): Promise<void> {
    try {
      const result = await this.prisma.analysisCache.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      });

      console.log(`🗑️ 만료된 캐시 ${result.count}개 삭제`);
    } catch (error) {
      console.error('만료된 캐시 삭제 실패:', error);
    }
  }

  // Prisma 클라이언트 직접 접근 (고급 쿼리용)
  get client() {
    return this.prisma;
  }
}

// 싱글톤 인스턴스 export
export const databaseService = DatabaseService.getInstance();

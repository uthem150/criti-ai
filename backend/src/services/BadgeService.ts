import { PrismaClient } from "@prisma/client";
import type { Badge } from "@criti-ai/shared";

/**
 * 뱃지 관련 로직을 담당하는 서비스
 * DatabaseService에서 사용
 */
export class BadgeService {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  /**
   * 특정 뱃지 조건 체크
   */
  async checkBadgeCondition(
    userId: string,
    conditionType: string,
    conditionValue: string,
    user?: any
  ): Promise<boolean> {
    const value = parseInt(conditionValue);

    switch (conditionType) {
      case "first_challenge":
        return user ? user.challengeResults.length >= value : false;

      case "first_visit":
        return true; // 사용자 생성 시 자동으로 부여

      case "analysis_count":
        return user ? user.analyticsUsed >= value : false;

      case "consecutive_days":
        return await this.checkConsecutiveDays(userId, value);

      case "fast_answer":
        return await this.checkFastAnswer(userId, value);

      case "no_hints":
        return await this.checkNoHints(userId);

      case "daily_perfect":
        return await this.checkDailyPerfect(userId);

      case "daily_accuracy":
        // 이건 별도로 처리 (awardDailyChallengeBadge에서)
        return false;

      default:
        return false;
    }
  }

  /**
   * 연속 일수 체크
   */
  async checkConsecutiveDays(
    userId: string,
    requiredDays: number
  ): Promise<boolean> {
    try {
      const results = await this.prisma.challengeResult.findMany({
        where: { userId },
        orderBy: { submittedAt: "desc" },
        take: 500,
        include: { challenge: true },
      });

      if (results.length === 0) return false;

      // 날짜별로 그룹화
      const dateSet = new Set<string>();
      results.forEach((result) => {
        const date = result.submittedAt.toISOString().split("T")[0];
        if (result.challenge.dailyKey) {
          dateSet.add(date);
        }
      });

      const sortedDates = Array.from(dateSet).sort().reverse();

      // 연속 일수 계산
      let consecutiveDays = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      for (let i = 0; i < sortedDates.length; i++) {
        const checkDate = new Date(sortedDates[i]);
        checkDate.setHours(0, 0, 0, 0);

        const diffDays = Math.floor(
          (currentDate.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === consecutiveDays) {
          consecutiveDays++;
        } else {
          break;
        }
      }

      console.log(`📊 ${userId} 연속 일수: ${consecutiveDays}일 (필요: ${requiredDays}일)`);
      return consecutiveDays >= requiredDays;
    } catch (error) {
      console.error("연속 일수 체크 실패:", error);
      return false;
    }
  }

  /**
   * 빠른 답변 체크
   */
  async checkFastAnswer(
    userId: string,
    maxSeconds: number
  ): Promise<boolean> {
    try {
      const recentResult = await this.prisma.challengeResult.findFirst({
        where: { userId },
        orderBy: { submittedAt: "desc" },
      });

      return recentResult ? recentResult.timeSpent <= maxSeconds : false;
    } catch (error) {
      console.error("빠른 답변 체크 실패:", error);
      return false;
    }
  }

  /**
   * 힌트 없이 완료 체크
   */
  async checkNoHints(userId: string): Promise<boolean> {
    try {
      const today = new Date();
      const kstOffset = 9 * 60;
      const kstTime = new Date(today.getTime() + kstOffset * 60 * 1000);
      const todayKST = kstTime.toISOString().split("T")[0];

      const todaysChallenges = await this.prisma.challenge.findMany({
        where: { dailyKey: todayKST, isActive: true },
      });

      if (todaysChallenges.length === 0) return false;

      const todaysChallengeIds = todaysChallenges.map((c) => c.id);

      const results = await this.prisma.challengeResult.findMany({
        where: {
          userId,
          challengeId: { in: todaysChallengeIds },
        },
      });

      return (
        results.length === todaysChallenges.length &&
        results.every((r) => r.hintsUsed === 0)
      );
    } catch (error) {
      console.error("힌트 없이 완료 체크 실패:", error);
      return false;
    }
  }

  /**
   * 오늘의 챌린지 완벽 완료 체크
   */
  async checkDailyPerfect(userId: string): Promise<boolean> {
    try {
      const today = new Date();
      const kstOffset = 9 * 60;
      const kstTime = new Date(today.getTime() + kstOffset * 60 * 1000);
      const todayKST = kstTime.toISOString().split("T")[0];

      const todaysChallenges = await this.prisma.challenge.findMany({
        where: { dailyKey: todayKST, isActive: true },
      });

      if (todaysChallenges.length === 0) return false;

      const todaysChallengeIds = todaysChallenges.map((c) => c.id);

      const results = await this.prisma.challengeResult.findMany({
        where: {
          userId,
          challengeId: { in: todaysChallengeIds },
        },
      });

      return (
        results.length === todaysChallenges.length &&
        results.every((r) => r.isCorrect)
      );
    } catch (error) {
      console.error("완벽 완료 체크 실패:", error);
      return false;
    }
  }

  /**
   * 일일 챌린지 완료 시 뱃지 부여
   */
  async awardDailyChallengeBadge(
    userId: string,
    accuracy: number,
    isPerfect: boolean,
    avgTime: number,
    totalHints: number
  ): Promise<Badge[]> {
    try {
      const newBadges: Badge[] = [];

      // 1. 완벽 점수 뱃지
      if (isPerfect) {
        const badge = await this.findAndAwardBadge(userId, "완벽주의자");
        if (badge) newBadges.push(badge);
      }

      // 2. 정확도 기반 뱃지
      if (accuracy >= 90) {
        const badge = await this.findAndAwardBadge(userId, "감정 마스터");
        if (badge) newBadges.push(badge);
      } else if (accuracy >= 70) {
        const badge = await this.findAndAwardBadge(userId, "논리의 달인");
        if (badge) newBadges.push(badge);
      } else if (accuracy >= 50) {
        const badge = await this.findAndAwardBadge(userId, "도전자");
        if (badge) newBadges.push(badge);
      }

      // 3. 힌트 없이 완료 뱃지
      if (totalHints === 0) {
        const badge = await this.findAndAwardBadge(userId, "독학의 달인");
        if (badge) newBadges.push(badge);
      }

      // 4. 빠른 완료 뱃지
      if (avgTime <= 60) {
        const badge = await this.findAndAwardBadge(userId, "번개같은 사고");
        if (badge) newBadges.push(badge);
      }

      // 5. Streak 뱃지 체크
      const streakBadges = await this.checkStreakBadges(userId);
      newBadges.push(...streakBadges);

      return newBadges;
    } catch (error) {
      console.error("일일 챌린지 뱃지 부여 실패:", error);
      return [];
    }
  }

  /**
   * Streak 뱃지 체크
   */
  async checkStreakBadges(userId: string): Promise<Badge[]> {
    const newBadges: Badge[] = [];
    const streakDays = [3, 7, 30, 100];

    for (const days of streakDays) {
      const hasStreak = await this.checkConsecutiveDays(userId, days);
      if (hasStreak) {
        let badgeName = "";
        switch (days) {
          case 3:
            badgeName = "3일 연속 도전";
            break;
          case 7:
            badgeName = "일주일 마스터";
            break;
          case 30:
            badgeName = "한 달 챔피언";
            break;
          case 100:
            badgeName = "백일장";
            break;
        }

        const badge = await this.findAndAwardBadge(userId, badgeName);
        if (badge) newBadges.push(badge);
      }
    }

    return newBadges;
  }

  /**
   * 특정 이름의 뱃지 찾아서 부여
   */
  async findAndAwardBadge(
    userId: string,
    badgeName: string
  ): Promise<Badge | null> {
    try {
      // 이미 받았는지 확인
      const existing = await this.prisma.userBadge.findFirst({
        where: {
          userId,
          badge: { name: badgeName },
        },
      });

      if (existing) return null;

      // 뱃지 찾기
      const badge = await this.prisma.badge.findFirst({
        where: { name: badgeName, isActive: true },
      });

      if (!badge) return null;

      // 뱃지 부여
      await this.prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
        },
      });

      console.log(`🎖️ 뱃지 부여: ${badge.icon} ${badge.name} -> ${userId}`);

      return {
        id: badge.id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        earnedAt: new Date().toISOString(),
        category: badge.category as Badge["category"],
      };
    } catch (error) {
      console.error("뱃지 찾기 및 부여 실패:", error);
      return null;
    }
  }
}

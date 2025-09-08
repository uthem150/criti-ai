import { Router } from "express";
import type { Request, Response } from "express";
import { GeminiService } from "../services/GeminiService.js";
import { redisCacheService } from "../services/RedisCacheService.js";
import { databaseService } from "../services/DatabaseService.js";
import type {
  Challenge,
  ApiResponse,
  ChallengeResponse,
  UserProgress,
} from "@criti-ai/shared";

const router = Router();
const geminiService = new GeminiService();

// 모든 챌린지 조회
router.get("/challenges", async (req: Request, res: Response): Promise<void> => {
  try {
    const { difficulty } = req.query;
    
    const challenges = await databaseService.getAllChallenges(
      difficulty ? String(difficulty) : undefined
    );

    res.json({
      success: true,
      data: challenges,
      timestamp: new Date().toISOString(),
    } as ApiResponse<Challenge[]>);
  } catch (error) {
    console.error("Challenges fetch error:", error);
    res.status(500).json({
      success: false,
      error: "챌린지를 불러오는 중 오류가 발생했습니다.",
      timestamp: new Date().toISOString(),
    });
  }
});

// 특정 챌린지 조회
router.get("/challenges/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const challenge = await databaseService.getChallenge(id);

    if (!challenge) {
      res.status(404).json({
        success: false,
        error: "챌린지를 찾을 수 없습니다.",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.json({
      success: true,
      data: challenge,
      timestamp: new Date().toISOString(),
    } as ApiResponse<Challenge>);
  } catch (error) {
    console.error("Challenge fetch error:", error);
    res.status(500).json({
      success: false,
      error: "챌린지를 불러오는 중 오류가 발생했습니다.",
      timestamp: new Date().toISOString(),
    });
  }
});

// 챌린지 답안 제출 및 채점
router.post("/challenges/:id/submit", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userAnswers, timeSpent, hintsUsed = 0 }: ChallengeResponse = req.body;
    const userId = req.body.userId || 'guest'; // 임시 사용자 ID

    const challenge = await databaseService.getChallenge(id);
    
    if (!challenge) {
      res.status(404).json({
        success: false,
        error: "챌린지를 찾을 수 없습니다.",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // 답안 채점
    const correctAnswers = challenge.correctAnswers;
    const isCorrect = correctAnswers.every(answer => userAnswers.includes(answer)) &&
                      userAnswers.every(answer => correctAnswers.includes(answer));

    const score = isCorrect ? challenge.points : Math.floor(challenge.points * 0.3); // 남련점 30%
    const bonusPoints = timeSpent < 60 ? Math.floor(challenge.points * 0.1) : 0; // 빠른 답변 보너스

    // 결과 저장
    await databaseService.saveChallengeResult(
      userId,
      id,
      { challengeId: id, userAnswers, timeSpent, hintsUsed },
      isCorrect,
      score,
      bonusPoints
    );

    // 배지 확인 및 지급
    const newBadges = await databaseService.checkAndAwardBadges(userId);

    res.json({
      success: true,
      data: {
        isCorrect,
        correctAnswers,
        userAnswers,
        score: score + bonusPoints,
        explanation: challenge.explanation,
        bonusPoints,
        timeSpent,
        newBadges
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Challenge submission error:", error);
    res.status(500).json({
      success: false,
      error: "답안 제출 중 오류가 발생했습니다.",
      timestamp: new Date().toISOString(),
    });
  }
});

// 사용자 진행도 조회
router.get("/progress/:userId", async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    let progress = await databaseService.getUserProgress(userId);
    
    // 사용자가 없으면 기본 사용자 생성
    if (!progress) {
      await databaseService.createUser({
        displayName: `사용자_${userId.slice(-4)}`
      });
      
      progress = await databaseService.getUserProgress(userId);
    }
    
    // 여전히 null이면 기본 값 반환
    if (!progress) {
      progress = {
        userId,
        totalPoints: 0,
        level: 1,
        badges: [],
        completedChallenges: [],
        analyticsUsed: 0
      };
    }

    res.json({
      success: true,
      data: progress,
      timestamp: new Date().toISOString(),
    } as ApiResponse<UserProgress>);
  } catch (error) {
    console.error("Progress fetch error:", error);
    res.status(500).json({
      success: false,
      error: "진행도를 불러오는 중 오류가 발생했습니다.",
      timestamp: new Date().toISOString(),
    });
  }
});

// AI가 새로운 챌린지 생성 (고급 기능)
router.post("/generate", async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, difficulty, topic } = req.body;

    // Redis 캐시 확인
    const cacheKey = `${type}:${difficulty}:${topic || 'default'}`;
    const cachedChallenge = await redisCacheService.getChallengeCache(cacheKey);

    if (cachedChallenge) {
      res.json({
        success: true,
        data: cachedChallenge,
        timestamp: new Date().toISOString(),
        cached: true
      });
      return;
    }

    // AI로 새 챌린지 생성
    const generatedChallenge = await geminiService.generateChallenge(type, difficulty);

    // Redis에 결과 캐싱 (1시간)
    await redisCacheService.setChallengeCache(cacheKey, generatedChallenge, 60 * 60);

    res.json({
      success: true,
      data: generatedChallenge,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Challenge generation error:", error);
    res.status(500).json({
      success: false,
      error: "챌린지 생성 중 오류가 발생했습니다.",
      timestamp: new Date().toISOString(),
    });
  }
});

// 통계 조회
router.get("/stats", async (req: Request, res: Response): Promise<void> => {
  try {
    // 데이터베이스에서 실제 통계 조회
    const totalChallenges = await databaseService.client.challenge.count({
      where: { isActive: true }
    });
    
    const totalUsers = await databaseService.client.user.count();
    
    const recentResults = await databaseService.client.challengeResult.findMany({
      take: 100,
      orderBy: { submittedAt: 'desc' },
      include: { challenge: true }
    });
    
    const averageScore = recentResults.length > 0 
      ? recentResults.reduce((sum, r) => sum + r.score, 0) / recentResults.length
      : 0;
    
    const completionRate = recentResults.length > 0
      ? (recentResults.filter(r => r.isCorrect).length / recentResults.length) * 100
      : 0;
    
    // 난이도별 인기도 계산
    const difficultyStats = await databaseService.client.challenge.groupBy({
      by: ['difficulty'],
      where: { isActive: true },
      _count: { id: true }
    });
    
    const popularDifficulty = difficultyStats.reduce((prev, current) => 
      (prev._count.id > current._count.id) ? prev : current
    )?.difficulty || 'beginner';
    
    // 인기 챌린지 TOP 3
    const topChallenges = await databaseService.client.challenge.findMany({
      take: 3,
      where: { isActive: true },
      include: {
        _count: {
          select: { results: true }
        }
      },
      orderBy: {
        results: {
          _count: 'desc'
        }
      }
    });

    const stats = {
      totalChallenges,
      totalUsers,
      averageScore: Math.round(averageScore * 10) / 10,
      completionRate: Math.round(completionRate * 10) / 10,
      popularDifficulty,
      topChallenges: topChallenges.map(c => ({
        id: c.id,
        title: c.title,
        completions: c._count.results
      }))
    };

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    
    // 오류 시 기본값 반환
    const fallbackStats = {
      totalChallenges: 0,
      totalUsers: 0,
      averageScore: 0,
      completionRate: 0,
      popularDifficulty: 'beginner',
      topChallenges: []
    };
    
    res.json({
      success: true,
      data: fallbackStats,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;

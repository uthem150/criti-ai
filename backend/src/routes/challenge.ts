import { Router } from "express";
import type { Request, Response } from "express";
import { GeminiService } from "../services/GeminiService.js";
import { CacheService } from "../services/CacheService.js";
import type {
  Challenge,
  ApiResponse,
  ChallengeResponse,
  UserProgress,
} from "@criti-ai/shared";

const router = Router();
const geminiService = new GeminiService();
const cacheService = new CacheService();

// 더미 챌린지 데이터 (나중에 DB로 교체)
const DUMMY_CHALLENGES: Challenge[] = [
  {
    id: '1',
    type: 'article-analysis',
    title: '이 기사에서 논리적 오류를 찾아보세요',
    content: `최근 한 연구에 따르면 스마트폰을 많이 사용하는 청소년들의 성적이 떨어진다고 합니다. 
실제로 우리 학교 1등 학생인 김OO도 스마트폰을 거의 사용하지 않습니다. 
따라서 모든 청소년들은 반드시 스마트폰 사용을 중단해야 합니다.
이것은 과학적으로 증명된 사실이므로 의심의 여지가 없습니다.`,
    correctAnswers: ['성급한 일반화', '허위 이분법', '권위에 호소'],
    explanation: '이 글에는 성급한 일반화(하나의 연구와 사례로 전체를 판단), 허위 이분법(완전히 안 쓰거나 많이 쓰거나만 제시), 권위에 호소(과학적 사실이라며 의심을 차단) 오류가 있습니다.',
    difficulty: 'beginner',
    points: 100
  },
  {
    id: '2',
    type: 'article-analysis',
    title: '편향된 표현을 찾아보세요',
    content: `충격적인 발표! 정부의 새로운 정책이 국민들을 분노하게 만들고 있습니다. 
이 말도 안 되는 정책으로 인해 모든 국민이 피해를 보고 있으며, 
반드시 즉시 철회되어야 합니다. 전문가들은 이구동성으로 비판하고 있습니다.`,
    correctAnswers: ['감정적 편향', '과장된 표현'],
    explanation: '이 글은 "충격적인", "분노하게", "말도 안 되는" 등 감정적 편향과 "모든 국민", "반드시", "이구동성" 등 과장된 표현을 사용하고 있습니다.',
    difficulty: 'beginner',
    points: 80
  },
  {
    id: '3',
    type: 'article-analysis',
    title: '고급 논리 오류 탐지',
    content: `A 후보를 지지하는 사람들은 모두 부정부패에 연루되어 있습니다. 
B 후보의 정책은 완벽하지는 않지만, A 후보보다는 훨씬 낫습니다.
만약 A 후보가 당선된다면 우리나라는 망할 것입니다. 
따라서 상식이 있는 국민이라면 당연히 B 후보를 선택할 것입니다.`,
    correctAnswers: ['인신공격', '허수아비 공격', '흑백논리'],
    explanation: '인신공격(A 후보 지지자들을 부정부패와 연결), 허수아비 공격(상대방 주장을 왜곡), 흑백논리(A 아니면 B만 있는 것으로 단순화) 등의 오류가 포함되어 있습니다.',
    difficulty: 'advanced',
    points: 150
  }
];

// 더미 사용자 진행도
const DUMMY_USER_PROGRESS: UserProgress = {
  userId: 'guest',
  totalPoints: 280,
  level: 2,
  badges: [
    { id: '1', name: '첫 걸음', description: '첫 번째 챌린지 완료', icon: '🎯', earnedAt: '2024-03-01', category: 'milestone' },
    { id: '2', name: '탐정', description: '편향 표현 5개 찾기', icon: '🔍', earnedAt: '2024-03-02', category: 'analysis' }
  ],
  completedChallenges: ['1', '2'],
  analyticsUsed: 15
};

// 모든 챌린지 조회
router.get("/challenges", async (req: Request, res: Response): Promise<void> => {
  try {
    const { difficulty } = req.query;
    
    let challenges = DUMMY_CHALLENGES;
    
    if (difficulty && typeof difficulty === 'string') {
      challenges = DUMMY_CHALLENGES.filter(c => c.difficulty === difficulty);
    }

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
    const challenge = DUMMY_CHALLENGES.find(c => c.id === id);

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
    const { userAnswers, timeSpent }: ChallengeResponse = req.body;

    const challenge = DUMMY_CHALLENGES.find(c => c.id === id);
    
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

    const score = isCorrect ? challenge.points : 0;
    const bonusPoints = timeSpent < 60 ? Math.floor(challenge.points * 0.1) : 0; // 빠른 답변 보너스

    res.json({
      success: true,
      data: {
        isCorrect,
        correctAnswers,
        userAnswers,
        score: score + bonusPoints,
        explanation: challenge.explanation,
        bonusPoints,
        timeSpent
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
    
    // 실제로는 DB에서 사용자 진행도를 조회
    const progress = { ...DUMMY_USER_PROGRESS, userId };

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

    // 캐시 확인
    const cacheKey = `challenge:${type}:${difficulty}:${topic || 'default'}`;
    const cachedChallenge = await cacheService.get(cacheKey);

    if (cachedChallenge) {
      res.json({
        success: true,
        data: cachedChallenge,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // AI로 새 챌린지 생성
    const generatedChallenge = await geminiService.generateChallenge(type, difficulty);

    // 결과 캐싱 (1시간)
    await cacheService.set(cacheKey, generatedChallenge, 60 * 60);

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
    const stats = {
      totalChallenges: DUMMY_CHALLENGES.length,
      totalUsers: 1250,
      averageScore: 75.5,
      completionRate: 68.2,
      popularDifficulty: 'beginner',
      topChallenges: DUMMY_CHALLENGES.slice(0, 3).map(c => ({
        id: c.id,
        title: c.title,
        completions: Math.floor(Math.random() * 1000) + 100
      }))
    };

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    res.status(500).json({
      success: false,
      error: "통계를 불러오는 중 오류가 발생했습니다.",
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;

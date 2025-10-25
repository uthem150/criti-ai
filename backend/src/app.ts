// dotenv/config: 환경 변수 최우선 로드
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import type { Request, Response, NextFunction } from "express";
import analysisRoutes from "./routes/analysis.js";
import challengeRoutes from "./routes/challenge.js";
import youtubeRoutes from "./routes/youtube.js";
import { GeminiService } from "./services/GeminiService.js";
import { redisCacheService } from "./services/RedisCacheService.js";
import { databaseService } from "./services/DatabaseService.js";
import { dailyChallengeService } from "./services/DailyChallengeService.js";

// Express 애플리케이션 인스턴스 생성
const app = express();
// 서버 포트 설정: 환경 변수 `PORT` 또는 3001
const PORT = process.env.PORT || 3001;
// 프론트엔드 URL 설정: 환경 변수 `FRONTEND_URL` or localhost:5173
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

/**
 * CORS(Cross-Origin Resource Sharing) 설정
 * 다른 출처의 요청 허용 정책 정의
 */
const allowedOrigins = [
  // 주요 프로덕션 및 개발 프론트엔드 URL
  FRONTEND_URL,

  // Vercel 배포 환경 URL 패턴
  "https://criti-ai.vercel.app",
  "https://criti-ai-web.vercel.app",
  "https://criti-ai-challenge.vercel.app", // 특정 Vercel 배포 주소
  /^https:\/\/.*\.vercel\.app$/, // 모든 Vercel 프리뷰 배포 주소 허용

  // TODO: 실제 프로덕션 크롬 확장 프로그램 ID 추가 필요
  // 예: 'chrome-extension://abcdefghijklmnopqrstuvwxyz123456'

  // 모든 Chrome 및 Firefox 확장 프로그램 허용 (개발 편의용)
  /^chrome-extension:\/\/.*/,
  /^moz-extension:\/\/.*/,

  // 로컬 개발 환경 URL
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
];

// 개발 환경에서 localhost 주소 추가로 허용
if (process.env.NODE_ENV === "development") {
  allowedOrigins.push("http://localhost:5173", "http://localhost:3000");
}

/**
 * 미들웨어(Middleware) 설정
 * 모든 요청에 공통으로 적용될 기능 설정
 */
// helmet: 보안 HTTP 헤더 설정 (XSS, 클릭재킹 방어)
app.use(helmet());

// cors: CORS 정책 활성화
app.use(
  cors({
    // origin: 요청 출처가 허용 목록에 있는지 확인
    origin: (origin, callback) => {
      // origin이 없거나(서버 간 요청 등) 허용 목록에 있을 경우
      if (
        !origin ||
        allowedOrigins.some((allowed) => new RegExp(allowed).test(origin))
      ) {
        callback(null, true); // 요청 허용
      } else {
        callback(new Error("Not allowed by CORS")); // 요청 거부
      }
    },
    credentials: true, // credentials: 자격 증명(쿠키 등) 포함 요청 허용
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // methods: 허용할 HTTP 메소드 정의
    allowedHeaders: ["Content-Type", "Authorization"], // allowedHeaders: 허용할 요청 헤더 정의
  })
);

// compression: 응답 본문 압축 (gzip)
app.use(compression() as unknown as express.RequestHandler);
// morgan: HTTP 요청 로그 출력 ('combined' 포맷)
app.use(morgan("combined"));
// express.json: JSON 요청 본문 파싱 (10mb 제한)
app.use(express.json({ limit: "10mb" }));
// express.urlencoded: URL-encoded 요청 본문 파싱 (10mb 제한)
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/**
 * 라우트(Routes) 설정
 * 특정 경로 요청을 처리할 로직 연결
 */

// '/health': 서버 상태 확인용 헬스 체크 엔드포인트
app.get("/health", async (req: Request, res: Response) => {
  // Redis 캐시 통계 정보 조회
  const cacheStats = await redisCacheService.getCacheStats();

  // 데이터베이스 연결 상태 확인
  let dbStatus = "disconnected";
  try {
    // 간단한 쿼리로 DB 연결 유효성 테스트
    await databaseService.client.$queryRaw`SELECT 1`;
    dbStatus = "connected";
  } catch (_error) {
    dbStatus = "error";
  }

  // 종합적인 서버 상태 정보를 JSON으로 응답
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Criti.AI Backend",
    geminiApiKey: process.env.GEMINI_API_KEY ? "Configured" : "Missing",
    database: {
      status: dbStatus,
      url: process.env.DATABASE_URL ? "설정됨" : "미설정",
    },
    redis: {
      connected: redisCacheService.isRedisAvailable(),
      ...cacheStats,
    },
  });
});

// '/api/health': 서버리스 환경(Vercel 등)용 API 헬스체크. '/health'와 기능 동일.
app.get("/api/health", async (req: Request, res: Response) => {
  const cacheStats = await redisCacheService.getCacheStats();
  let dbStatus = "disconnected";
  try {
    await databaseService.client.$queryRaw`SELECT 1`;
    dbStatus = "connected";
  } catch (_error) {
    dbStatus = "error";
  }
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Criti.AI Backend",
    geminiApiKey: process.env.GEMINI_API_KEY ? "Configured" : "Missing",
    database: {
      status: dbStatus,
      url: process.env.DATABASE_URL ? "설정됨" : "미설정",
    },
    redis: {
      connected: redisCacheService.isRedisAvailable(),
      ...cacheStats,
    },
  });
});

// '/test-gemini': Gemini API 연결 테스트 엔드포인트
app.get("/test-gemini", async (req: Request, res: Response) => {
  try {
    const geminiService = new GeminiService();
    // 테스트 데이터로 콘텐츠 분석 기능 호출
    const testResult = await geminiService.analyzeContent({
      url: "https://example.com",
      title: "테스트 기사",
      content: "이것은 테스트 기사입니다. 충격적인 내용이 들어있습니다.",
    });

    // 성공 시, 성공 메시지와 결과 일부 응답
    res.json({
      success: true,
      message: "Gemini API 연결 성공",
      testResult: testResult.overallScore,
    });
  } catch (_error) {
    // 실패 시, 실패 메시지와 에러 정보 응답
    res.json({
      success: false,
      message: "Gemini API 연결 실패",
      error: _error instanceof Error ? _error.message : "알 수 없는 오류",
    });
  }
});

// '/challenge': 챌린지 웹 페이지로 리다이렉트
app.get("/challenge", (req: Request, res: Response) => {
  res.redirect(`${FRONTEND_URL}/challenge.html`);
});

// '/api/analysis' 요청은 analysisRoutes에서 처리
app.use("/api/analysis", analysisRoutes);
// '/api/challenge' 요청은 challengeRoutes에서 처리
app.use("/api/challenge", challengeRoutes);
// '/api/youtube' 요청은 youtubeRoutes에서 처리
app.use("/api/youtube", youtubeRoutes);

/**
 * 에러 핸들링 미들웨어
 * 라우트 처리 중 발생 에러 중앙 관리
 */
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  // 에러 스택 콘솔 출력
  console.error(err.stack);

  // CORS 에러의 경우, 명확한 메시지 전달
  if (err.message === "Not allowed by CORS") {
    res.status(403).json({
      success: false,
      error: "CORS policy does not allow access from this origin.",
    });
  } else {
    // 그 외 서버 내부 에러는 500 상태 코드로 응답
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      timestamp: new Date().toISOString(),
    });
  }
});

// 404 Not Found 핸들링 미들웨어
// 정의된 라우트 외의 모든 요청 처리
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    timestamp: new Date().toISOString(),
  });
});

/**
 * 서버 실행 및 초기화 로직
 */
app.listen(PORT, async () => {
  console.log(`🚀 Criti.AI Backend Server running on port ${PORT}`);

  // 데이터베이스 연결 시도
  try {
    await databaseService.connect();
  } catch (_error) {
    // 연결 실패 시 경고만 출력 (개발 모드에서 서버 중단 방지)
    console.warn("⚠️ 데이터베이스 연결 실패 (개발 모드에서는 계속 진행)");
  }

  // 개발 환경에서 서버 시작 시 만료된 캐시 정리
  if (process.env.NODE_ENV === "development") {
    await databaseService.cleanExpiredCache();
  }

  // 일일 챌린지 생성/관리 스케줄러 시작
  dailyChallengeService.startDailyScheduler();
  console.log("⏰ 일일 챌린지 시스템 시작");
});

/**
 * 프로세스 종료 처리 (Graceful Shutdown)
 * SIGINT 신호(Ctrl+C) 수신 시, 연결을 안전하게 종료 후 프로세스 끝냄
 */
process.on("SIGINT", async () => {
  console.log("\n🛑 서버 종료 신호 수신...");

  try {
    // 데이터베이스와 Redis 연결 동시 종료
    await Promise.all([
      databaseService.disconnect(),
      redisCacheService.disconnect(),
    ]);
    console.log("✅ 모든 연결 정리 완료");
  } catch (error) {
    console.error("❌ 연결 정리 실패:", error);
  }

  // 모든 작업 완료 후 프로세스 종료
  process.exit(0);
});

// Express 앱 인스턴스를 외부(테스트 코드 등)에서 사용하도록 export
export default app;

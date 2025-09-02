import 'dotenv/config'; // 최우선으로 환경변수 로드
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import type { Request, Response, NextFunction } from "express";
import analysisRoutes from "./routes/analysis";
import challengeRoutes from "./routes/challenge";

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어 설정
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Frontend 개발 서버
      "http://localhost:3000", // 추가 개발 포트
      "chrome-extension://*",    // 크롬 확장 프로그램
      /^chrome-extension:\/\/.*/, // 크롬 확장 정규식
      "moz-extension://*",       // 파이어펭스 확장
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(compression());
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 기본 라우트
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Criti.AI Backend",
    geminiApiKey: !!process.env.GEMINI_API_KEY ? "Configured" : "Missing"
  });
});

// Gemini API 테스트 엔드포인트
app.get("/test-gemini", async (req: Request, res: Response) => {
  try {
    const geminiService = new (await import('./services/GeminiService.js')).GeminiService();
    const testResult = await geminiService.analyzeContent({
      url: 'https://example.com',
      title: '테스트 기사',
      content: '이것은 테스트 기사입니다. 충격적인 내용이 들어있습니다.'
    });
    
    res.json({
      success: true,
      message: 'Gemini API 연결 성공',
      testResult: testResult.overallScore
    });
  } catch (error) {
    res.json({
      success: false,
      message: 'Gemini API 연결 실패',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
});

// 챌린지 웹 페이지 라우팅 (프론트엔드로 리다이렉트)
app.get("/challenge", (req: Request, res: Response) => {
  res.redirect("http://localhost:5173/challenge.html");
});

// API 라우터 연결
app.use("/api/analysis", analysisRoutes);
app.use("/api/challenge", challengeRoutes);

// 에러 핸들링
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    timestamp: new Date().toISOString(),
  });
});

// 404 핸들링
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Criti.AI Backend Server running on port ${PORT}`);
});

export default app;

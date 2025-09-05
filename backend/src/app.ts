import 'dotenv/config'; // 최우선으로 환경변수 로드
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import type { Request, Response, NextFunction } from "express";
import analysisRoutes from "./routes/analysis";
import challengeRoutes from "./routes/challenge";
import { GeminiService } from './services/GeminiService'; // 정적 import로 변경

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// CORS 설정
const allowedOrigins = [
  // 주요 프로덕션/개발 프론트엔드 URL
  FRONTEND_URL,
  // TODO: 여기에 실제 프로덕션 빌드된 크롬 확장 프로그램 ID 추가필요
  // 예: 'chrome-extension://abcdefghijklmnopqrstuvwxyz123456'
  `chrome-extension://${process.env.CHROME_EXTENSION_ID || 'your-extension-id-here'}`,
  /^moz-extension:\/\/.*/, // Firefox 확장 (정규식)
];

if (process.env.NODE_ENV === 'development') {
  // 개발 환경에서는 localhost를 추가로 허용
  allowedOrigins.push('http://localhost:5173', 'http://localhost:3000');
}

// 미들웨어 설정
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // origin이 없거나 (서버 간 요청 등) 허용 목록에 있는 경우 허용
      if (!origin || allowedOrigins.some(allowed => new RegExp(allowed).test(origin))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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
    const geminiService = new GeminiService(); // 직접 인스턴스화
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
  res.redirect(`${FRONTEND_URL}/challenge.html`); // 환경 변수 사용
});

// API 라우터 연결
app.use("/api/analysis", analysisRoutes);
app.use("/api/challenge", challengeRoutes);

// 에러 핸들링
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  // CORS 에러인 경우 더 친절한 메시지 제공
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({
      success: false,
      error: 'CORS policy does not allow access from this origin.',
    });
  } else {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      timestamp: new Date().toISOString(),
    });
  }
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

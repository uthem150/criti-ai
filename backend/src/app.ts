import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import type { Request, Response, NextFunction } from "express";
import analysisRoutes from "./routes/analysis.js";

// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어 설정
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "chrome-extension://*",
    credentials: true,
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
  });
});

// API 라우터 연결
app.use("/api/analysis", analysisRoutes);

app.use("/api/challenge", (req: Request, res: Response) => {
  res.json({ message: "Challenge API - Coming soon" });
});

// 에러 핸들링
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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

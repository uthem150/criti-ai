import { Router } from "express";
import type { Request, Response } from "express";
import { GeminiService } from "../services/GeminiService.js";
import { cacheService } from "../services/CacheService.js";
import { redisCacheService } from "../services/RedisCacheService.js";
import { databaseService } from "../services/DatabaseService.js";
import type {
  AnalysisRequest,
  ApiResponse,
  TrustAnalysis,
} from "@criti-ai/shared";

// 새로운 Router 인스턴스 생성
// 이 'router'가 이제부터 분석 API의 엔드포인트 관리
const router = Router();
const geminiService = new GeminiService();

// 뉴스 기사 분석 엔드포인트
// 나중에 app.ts에서 '/api/analysis' 뒤에 연결되므로, 최종 경로는 "POST /api/analysis/analyze"
router.post("/analyze", async (req: Request, res: Response): Promise<void> => {
  try {
    // 요청 본문(body)에서 필요한 데이터를 추출
    const { url, content, title }: AnalysisRequest = req.body;

    // 입력 검증
    if (!url || !content) {
      res.status(400).json({
        success: false,
        error: "URL과 content는 필수입니다.",
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
      return;
    }

    // ===== Redis → Memory → DB 순서 =====

    // 1단계: Redis 캐시 확인
    let cachedResult = await redisCacheService.getAnalysisCache(url);

    if (cachedResult) {
      console.log("🎯 Redis cache hit for URL:", url);
      res.json({
        success: true,
        data: cachedResult,
        timestamp: new Date().toISOString(),
        cached: true,
        cacheSource: "redis",
      } as ApiResponse<TrustAnalysis>);
      return;
    }

    // 2단계: 메모리 캐시 확인 (Redis 다음)
    const memoryCacheKey = `analysis:${Buffer.from(url).toString("base64")}`;
    cachedResult = await cacheService.get(memoryCacheKey);

    if (cachedResult) {
      console.log("Memory cache hit for URL:", url);

      // Redis에도 저장 (다음 요청 시 속도 향상)
      await redisCacheService.setAnalysisCache(url, cachedResult, 24 * 60 * 60);

      res.json({
        success: true,
        data: cachedResult,
        timestamp: new Date().toISOString(),
        cached: true,
        cacheSource: "memory",
      } as ApiResponse<TrustAnalysis>);
      return;
    }

    // 3단계: 데이터베이스 캐시 확인 (마지막)
    cachedResult = await databaseService.getAnalysisFromCache(url);

    if (cachedResult) {
      console.log("💾 DB cache hit for URL:", url);

      // Redis와 메모리에도 저장 (다단계 캐시 워밍업)
      const ttl = 24 * 60 * 60;
      await Promise.all([
        redisCacheService.setAnalysisCache(url, cachedResult, ttl),
        cacheService.set(memoryCacheKey, cachedResult, ttl),
      ]);

      res.json({
        success: true,
        data: cachedResult,
        timestamp: new Date().toISOString(),
        cached: true,
        cacheSource: "database",
      } as ApiResponse<TrustAnalysis>);
      return;
    }

    // ===== AI 분석 실행 (캐시 미스) =====
    console.log("Analyzing new content for URL:", url);
    const analysis = await geminiService.analyzeContent({
      url,
      content,
      title,
    });

    // 3단계 캐시에 모두 저장 (병렬 처리)
    const ttl = 24 * 60 * 60; // 24시간
    const memoryKey = `analysis:${Buffer.from(url).toString("base64")}`;

    await Promise.all([
      // 1순위: Redis 저장
      redisCacheService.setAnalysisCache(url, analysis, ttl),

      // 2순위: 메모리 캐시 저장
      cacheService.set(memoryKey, analysis, ttl),

      // 3순위: 데이터베이스 저장 (영구 보관)
      databaseService.saveAnalysisToCache(url, analysis, title, "news"),
    ]);

    res.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString(),
    } as ApiResponse<TrustAnalysis>);
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
      timestamp: new Date().toISOString(),
    } as ApiResponse<null>);
  }
});

// 빠른 신뢰도 체크 (기본 규칙 기반)
router.post(
  "/quick-check",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { url } = req.body;

      if (!url) {
        res.status(400).json({
          success: false,
          error: "URL이 필요합니다.",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // 도메인 기반 빠른 평가 (간단한 로직)
      const domain = new URL(url).hostname;
      const trustedDomains = ["bbc.com", "reuters.com", "ap.org"];
      const quickScore = trustedDomains.includes(domain) ? 85 : 50;

      res.json({
        success: true,
        data: { quickScore, domain },
        timestamp: new Date().toISOString(),
      });
    } catch (_error) {
      res.status(500).json({
        success: false,
        error: "빠른 분석 중 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      });
    }
  }
);

export default router;

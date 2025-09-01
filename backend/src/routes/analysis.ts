import { Router } from "express";
import type { Request, Response } from "express";
import { GeminiService } from "../services/GeminiService.js";
import { CacheService } from "../services/CacheService.js";
import type {
  AnalysisRequest,
  ApiResponse,
  TrustAnalysis,
} from "@criti-ai/shared";

const router = Router();
const geminiService = new GeminiService();
const cacheService = new CacheService();

// 뉴스 기사 분석 엔드포인트
router.post("/analyze", async (req: Request, res: Response): Promise<void> => {
  try {
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

    // 캐시 확인
    const cacheKey = `analysis:${Buffer.from(url).toString("base64")}`;
    const cachedResult = await cacheService.get(cacheKey);

    if (cachedResult) {
      console.log("Cache hit for URL:", url);
      res.json({
        success: true,
        data: cachedResult,
        timestamp: new Date().toISOString(),
      } as ApiResponse<TrustAnalysis>);
      return;
    }

    // AI 분석 실행
    console.log("Analyzing new content for URL:", url);
    const analysis = await geminiService.analyzeContent({
      url,
      content,
      title,
    });

    // 결과 캐싱 (24시간)
    await cacheService.set(cacheKey, analysis, 24 * 60 * 60);

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
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "빠른 분석 중 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      });
    }
  }
);

export default router;

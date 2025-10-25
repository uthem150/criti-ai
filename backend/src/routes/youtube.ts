import { Router } from "express";
import type { Request, Response } from "express";
import { GeminiService } from "../services/GeminiService.js";
import { redisCacheService } from "../services/RedisCacheService.js";
import { databaseService } from "../services/DatabaseService.js";
import type {
  YoutubeAnalysisRequest,
  ApiResponse,
  YoutubeTrustAnalysis,
} from "@criti-ai/shared";

/**
 * 유튜브 영상 분석 라우터
 * 
 * 주요 기능:
 * 1. 유튜브 URL을 받아 영상 내용을 AI로 분석
 * 2. 편향, 가짜뉴스, 광고성 등을 타임스탬프 기반으로 상세 분석
 * 3. 3단계 캐싱 시스템 적용 (Redis -> DB -> 메모리)
 * 4. 확장 가능한 구조 설계
 */
const router = Router();
const geminiService = new GeminiService();

/**
 * 유튜브 URL 검증 및 정규화
 * @param url - 검증할 URL
 * @returns 정규화된 URL 또는 null
 */
function validateAndNormalizeYoutubeUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // YouTube 도메인 검증
    const validHosts = [
      "youtube.com",
      "www.youtube.com",
      "m.youtube.com",
      "youtu.be",
    ];

    if (!validHosts.some((host) => hostname.includes(host))) {
      return null;
    }

    // URL 정규화
    let videoId: string | null = null;

    // youtube.com/watch?v=VIDEO_ID
    if (hostname.includes("youtube.com") && urlObj.pathname === "/watch") {
      videoId = urlObj.searchParams.get("v");
    }
    // youtu.be/VIDEO_ID
    else if (hostname === "youtu.be") {
      videoId = urlObj.pathname.slice(1);
    }
    // youtube.com/shorts/VIDEO_ID
    else if (
      hostname.includes("youtube.com") &&
      urlObj.pathname.startsWith("/shorts/")
    ) {
      const parts = urlObj.pathname.split("/");
      videoId = parts[2] || null;
    }

    if (!videoId) {
      return null;
    }

    // 정규화된 URL 반환 (표준 형식)
    return `https://www.youtube.com/watch?v=${videoId}`;
  } catch (error) {
    console.error("URL 검증 오류:", error);
    return null;
  }
}

/**
 * POST /api/youtube/analyze
 * 유튜브 영상 분석 엔드포인트
 * 
 * Request Body:
 * {
 *   "url": "https://www.youtube.com/watch?v=...",
 *   "analysisLevel": "basic" | "detailed" | "comprehensive" (선택)
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": YoutubeTrustAnalysis,
 *   "timestamp": "ISO 날짜",
 *   "cached": true/false,
 *   "cacheSource": "redis" | "database" | "memory" (캐시된 경우)
 * }
 */
router.post("/analyze", async (req: Request, res: Response): Promise<void> => {
  try {
    const { url }: YoutubeAnalysisRequest = req.body;

    // 1. 입력 검증
    if (!url) {
      res.status(400).json({
        success: false,
        error: "유튜브 URL이 필요합니다.",
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
      return;
    }

    // 2. URL 검증 및 정규화
    const normalizedUrl = validateAndNormalizeYoutubeUrl(url);
    if (!normalizedUrl) {
      res.status(400).json({
        success: false,
        error: "유효하지 않은 유튜브 URL입니다. YouTube 또는 Shorts URL을 입력해주세요.",
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
      return;
    }

    console.log(`🎬 유튜브 영상 분석 요청: ${normalizedUrl}`);

    // 3. 캐시 확인 (3단계: Redis -> DB -> 메모리)
    
    // 3-1. Redis 캐시 확인
    let cachedResult = await redisCacheService.getAnalysisCache(normalizedUrl);

    if (cachedResult) {
      console.log("🎯 Redis 캐시 적중:", normalizedUrl);
      // 캐시된 데이터를 YoutubeTrustAnalysis 타입으로 안전하게 변환
      res.json({
        success: true,
        data: cachedResult as unknown as YoutubeTrustAnalysis,
        timestamp: new Date().toISOString(),
        cached: true,
        cacheSource: "redis",
      } as ApiResponse<YoutubeTrustAnalysis>);
      return;
    }

    // 3-2. 데이터베이스 캐시 확인
    cachedResult = await databaseService.getAnalysisFromCache(normalizedUrl);

    if (cachedResult) {
      console.log("💾 DB 캐시 적중:", normalizedUrl);

      // Redis에도 저장하여 다음 요청 시 더 빠르게 응답
      await redisCacheService.setAnalysisCache(
        normalizedUrl,
        cachedResult,
        24 * 60 * 60 // 24시간
      );

      // 캐시된 데이터를 YoutubeTrustAnalysis 타입으로 안전하게 변환
      res.json({
        success: true,
        data: cachedResult as unknown as YoutubeTrustAnalysis,
        timestamp: new Date().toISOString(),
        cached: true,
        cacheSource: "database",
      } as ApiResponse<YoutubeTrustAnalysis>);
      return;
    }

    // 4. 새로운 분석 실행
    console.log("🤖 새로운 유튜브 영상 분석 시작...");
    const startTime = Date.now();

    const analysis = await geminiService.analyzeYoutubeVideo(normalizedUrl);

    const analysisTime = Date.now() - startTime;
    console.log(`✅ 분석 완료 (소요 시간: ${analysisTime}ms)`);

    // 5. 캐시에 저장 (3단계)
    const ttl = 24 * 60 * 60; // 24시간

    // 5-1. Redis 캐시 저장 (최우선)
    try {
      await redisCacheService.setAnalysisCache(normalizedUrl, analysis, ttl);
      console.log("✅ Redis 캐시 저장 완료");
    } catch (error) {
      console.error("⚠️ Redis 캐시 저장 실패:", error);
    }

    // 5-2. 데이터베이스 영구 저장
    try {
      await databaseService.saveAnalysisToCache(
        normalizedUrl,
        analysis,
        analysis.videoInfo?.title || "제목 없음",
        "youtube" // contentType
      );
      console.log("✅ DB 캐시 저장 완료");
    } catch (error) {
      console.error("⚠️ DB 캐시 저장 실패:", error);
    }

    // 6. 성공 응답
    res.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString(),
      cached: false,
      analysisTime: `${analysisTime}ms`,
    } as ApiResponse<YoutubeTrustAnalysis>);

  } catch (error) {
    console.error("❌ 유튜브 영상 분석 오류:", error);

    // 에러 타입에 따른 상세 응답
    if (error instanceof Error) {
      // Gemini API 오류
      if (error.message.includes("Gemini") || error.message.includes("API")) {
        res.status(503).json({
          success: false,
          error: "AI 분석 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
          details: error.message,
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
        return;
      }

      // 일반 에러
      res.status(500).json({
        success: false,
        error: "유튜브 영상 분석 중 오류가 발생했습니다.",
        details: error.message,
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    } else {
      res.status(500).json({
        success: false,
        error: "알 수 없는 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  }
});

/**
 * GET /api/youtube/validate
 * 유튜브 URL 검증 엔드포인트 (분석 전 빠른 검증용)
 * 
 * Query Parameters:
 * - url: 검증할 유튜브 URL
 * 
 * Response:
 * {
 *   "success": true,
 *   "valid": true/false,
 *   "normalizedUrl": "정규화된 URL" (유효한 경우)
 * }
 */
router.get("/validate", async (req: Request, res: Response): Promise<void> => {
  try {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
      res.status(400).json({
        success: false,
        error: "URL 파라미터가 필요합니다.",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const normalizedUrl = validateAndNormalizeYoutubeUrl(url);

    if (normalizedUrl) {
      res.json({
        success: true,
        valid: true,
        normalizedUrl,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.json({
        success: true,
        valid: false,
        message: "유효하지 않은 유튜브 URL입니다.",
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("URL 검증 오류:", error);
    res.status(500).json({
      success: false,
      error: "URL 검증 중 오류가 발생했습니다.",
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * POST /api/youtube/batch-analyze
 * 여러 유튜브 영상 일괄 분석 엔드포인트 (확장성 고려)
 * 
 * Request Body:
 * {
 *   "urls": ["url1", "url2", ...]
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "results": [...],
 *     "failed": [...],
 *     "totalCount": 5,
 *     "successCount": 4,
 *     "failedCount": 1
 *   }
 * }
 */
router.post("/batch-analyze", async (req: Request, res: Response): Promise<void> => {
  try {
    const { urls } = req.body;

    // 입력 검증
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      res.status(400).json({
        success: false,
        error: "URL 배열이 필요합니다.",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // 최대 10개로 제한 (과부하 방지)
    if (urls.length > 10) {
      res.status(400).json({
        success: false,
        error: "최대 10개의 URL까지 처리 가능합니다.",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    console.log(`📦 일괄 분석 요청: ${urls.length}개 영상`);

    const results: YoutubeTrustAnalysis[] = [];
    const failed: Array<{ url: string; error: string }> = [];

    // 순차적으로 분석 (병렬 처리 시 API 제한 우려)
    for (const url of urls) {
      try {
        const normalizedUrl = validateAndNormalizeYoutubeUrl(url);
        if (!normalizedUrl) {
          failed.push({ url, error: "유효하지 않은 URL" });
          continue;
        }

        // 캐시 확인
        let cachedResult = await redisCacheService.getAnalysisCache(normalizedUrl);
        
        if (!cachedResult) {
          cachedResult = await databaseService.getAnalysisFromCache(normalizedUrl);
        }

        if (cachedResult) {
          // 캐시된 데이터를 YoutubeTrustAnalysis 타입으로 안전하게 변환
          results.push(cachedResult as unknown as YoutubeTrustAnalysis);
        } else {
          // 새로운 분석
          const analysis = await geminiService.analyzeYoutubeVideo(normalizedUrl);
          results.push(analysis);

          // 캐시 저장
          await redisCacheService.setAnalysisCache(normalizedUrl, analysis, 24 * 60 * 60);
          await databaseService.saveAnalysisToCache(
            normalizedUrl,
            analysis,
            analysis.videoInfo?.title || "제목 없음",
            "youtube"
          );
        }
      } catch (error) {
        console.error(`분석 실패 (${url}):`, error);
        failed.push({
          url,
          error: error instanceof Error ? error.message : "알 수 없는 오류",
        });
      }
    }

    res.json({
      success: true,
      data: {
        results,
        failed,
        totalCount: urls.length,
        successCount: results.length,
        failedCount: failed.length,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("일괄 분석 오류:", error);
    res.status(500).json({
      success: false,
      error: "일괄 분석 중 오류가 발생했습니다.",
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/youtube/stats
 * 유튜브 분석 통계 조회 (확장 기능)
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "message": "통계 기능은 곧 제공됩니다."
 *   }
 * }
 */
router.get("/stats", async (_req: Request, res: Response): Promise<void> => {
  try {
    // 향후 통계 기능 구현 시 확장 가능
    res.json({
      success: true,
      data: {
        message: "통계 기능은 곧 제공됩니다.",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("통계 조회 오류:", error);
    res.status(500).json({
      success: false,
      error: "통계 조회 중 오류가 발생했습니다.",
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;

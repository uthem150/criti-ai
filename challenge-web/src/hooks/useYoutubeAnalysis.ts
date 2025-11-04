/**
 * 유튜브 분석 관리 커스텀 훅
 */

import { useState } from "react";
import type { YoutubeTrustAnalysis } from "@criti-ai/shared";
import { challengeApiService } from "../services/challengeApiService";

interface UseYoutubeAnalysisReturn {
  url: string;
  loading: boolean;
  error: string | null;
  analysis: YoutubeTrustAnalysis | null;
  setUrl: (url: string) => void;
  analyzeVideo: () => Promise<void>;
  reset: () => void;
}

export const useYoutubeAnalysis = (): UseYoutubeAnalysisReturn => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<YoutubeTrustAnalysis | null>(null);

  /**
   * 유튜브 영상 분석 실행
   */
  const analyzeVideo = async () => {
    if (!url.trim()) {
      setError("유튜브 URL을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      // URL 유효성 검사
      const validation = await challengeApiService.validateYoutubeUrl(url);
      if (!validation.valid) {
        setError(validation.message || "유효하지 않은 유튜브 URL입니다.");
        setLoading(false);
        return;
      }

      // 분석 실행
      const result = await challengeApiService.analyzeYoutube(url);
      if (result.success && result.data) {
        setAnalysis(result.data);
      } else {
        setError(result.error || "분석에 실패했습니다.");
      }
    } catch (err) {
      console.error("분석 오류:", err);
      setError(
        err instanceof Error
          ? err.message
          : "분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * 상태 초기화
   */
  const reset = () => {
    setUrl("");
    setAnalysis(null);
    setError(null);
  };

  return {
    url,
    loading,
    error,
    analysis,
    setUrl,
    analyzeVideo,
    reset,
  };
};

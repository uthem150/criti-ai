// Backend API 호출 서비스
import type { TrustAnalysis, AnalysisRequest, ApiResponse } from '@criti-ai/shared';

const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  // 뉴스 기사 분석
  async analyzeContent(request: AnalysisRequest): Promise<TrustAnalysis> {
    const response = await fetch(`${API_BASE_URL}/analysis/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const result: ApiResponse<TrustAnalysis> = await response.json();
    
    if (result.success && result.data) {
      return result.data;
    } else {
      throw new Error(result.error || '분석 실패');
    }
  }

  // 빠른 신뢰도 체크
  async quickCheck(url: string): Promise<{ quickScore: number; domain: string }> {
    const response = await fetch(`${API_BASE_URL}/analysis/quick-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    const result: ApiResponse<{ quickScore: number; domain: string }> = await response.json();
    
    if (result.success && result.data) {
      return result.data;
    } else {
      throw new Error(result.error || '빠른 체크 실패');
    }
  }

  // 서버 상태 확인
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      const result = await response.json();
      return result.status === 'OK';
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();

// Backend API 호출 서비스 - Background Script 프록시 방식
import type { TrustAnalysis, AnalysisRequest } from '@shared/types';

// 환경변수 설정
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const API_ENDPOINTS = {
  ANALYZE: import.meta.env.VITE_API_ANALYSIS_ENDPOINT || '/api/analysis/analyze',
  HEALTH: import.meta.env.VITE_API_HEALTH_ENDPOINT || '/health',
  QUICK_CHECK: import.meta.env.VITE_API_QUICK_CHECK_ENDPOINT || '/api/analysis/quick-check',
  ANALYTICS: import.meta.env.VITE_API_ANALYTICS_ENDPOINT || '/api/analytics/track'
};

class ApiService {
  // Background Script를 통한 API 프록시 호출
  private async sendToBackground(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof chrome === 'undefined' || !chrome.runtime) {
        reject(new Error('크롬 확장 환경이 아닙니다'));
        return;
      }

      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        
        if (response?.success) {
          resolve(response);
        } else {
          reject(new Error(response?.error || '알 수 없는 오류'));
        }
      });
    });
  }

  // 네트워크 연결 테스트
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Background Script를 통한 연결 테스트');
      
      const response = await this.sendToBackground({
        type: 'HEALTH_CHECK'
      });
      
      console.log('✅ 연결 테스트 성공:', response.data);
      return response.success && response.status === 200;
    } catch (error) {
      console.error('❌ Background Script 통신 실패:', error);
      return false;
    }
  }

  // 뉴스 기사 분석
  async analyzeContent(request: AnalysisRequest): Promise<TrustAnalysis> {
    console.log('🔍 API 호출 시도 (Background Script 프록시):', request.url);

    // 연결 테스트 먼저
    const isConnected = await this.testConnection();
    if (!isConnected) {
      throw new Error('백엔드 서버에 연결할 수 없습니다. Background Script를 통한 연결 실패');
    }

    try {
      console.log('🚀 Background Script를 통한 API 요청 전송...');
      
      const response = await this.sendToBackground({
        type: 'API_PROXY',
        endpoint: 'analyze',
        url: `${API_BASE_URL}${API_ENDPOINTS.ANALYZE}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: request
      });

      console.log('✅ Background Script API 응답 성공');
      
      // 응답 데이터 처리
      if (response.data?.success && response.data?.data) {
        return response.data.data as TrustAnalysis;
      } else if (response.data && !response.data.success) {
        throw new Error(response.data.error || '분석 실패');
      } else {
        // 직접 데이터가 반환된 경우
        return response.data as TrustAnalysis;
      }
    } catch (error) {
      console.error('❌ Background Script API 호출 실패:', error);
      throw error;
    }
  }

  // 빠른 신뢰도 체크
  async quickCheck(url: string): Promise<{ quickScore: number; domain: string }> {
    try {
      const response = await this.sendToBackground({
        type: 'API_PROXY',
        endpoint: 'quick-check',
        url: `${API_BASE_URL}${API_ENDPOINTS.QUICK_CHECK}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { url }
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ 빠른 체크 실패:', error);
      throw error;
    }
  }

  // 사용량 통계 전송
  async trackUsage(event: string, data?: any): Promise<void> {
    try {
      await this.sendToBackground({
        type: 'API_PROXY',
        endpoint: 'track',
        url: `${API_BASE_URL}${API_ENDPOINTS.ANALYTICS}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { event, data, timestamp: new Date().toISOString() }
      });
    } catch (error) {
      console.warn('⚠️ 사용량 통계 전송 실패 (개발 모드에서는 정상):', error);
    }
  }

  // 서버 상태 확인
  async healthCheck(): Promise<boolean> {
    return this.testConnection();
  }
}

// 단일 인스턴스 내보내기
export const apiService = new ApiService();
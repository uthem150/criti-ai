/**
 * API 베이스 클라이언트
 * 모든 API 서비스의 기반이 되는 클래스
 */

export class ApiClient {
  protected baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || this.getDefaultBaseUrl();
  }

  /**
   * 환경에 따른 기본 API URL 반환
   */
  private getDefaultBaseUrl(): string {
    return import.meta.env.PROD
      ? "/api"
      : (import.meta.env?.VITE_API_BASE_URL as string) || "/api";
  }

  /**
   * HTTP GET 요청
   */
  protected async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * HTTP POST 요청
   */
  protected async post<T, D = unknown>(
    endpoint: string,
    data?: D
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * HTTP PUT 요청
   */
  protected async put<T, D = unknown>(
    endpoint: string,
    data?: D
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * HTTP DELETE 요청
   */
  protected async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * 공통 헤더 반환
   */
  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
    };
  }

  /**
   * 응답 처리 (에러 핸들링 포함)
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          `API 요청 실패: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * 헬스 체크
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: "GET",
        headers: this.getHeaders(),
      });
      return response.ok;
    } catch (error) {
      console.error("백엔드 헬스 체크 실패:", error);
      return false;
    }
  }
}

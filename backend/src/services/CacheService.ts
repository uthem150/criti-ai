export class CacheService {
  // 캐시 데이터를 저장할 Map 객체
  // key: string (데이터를 식별하는 고유 키)
  // value: { data: any; expiry: number } (실제 데이터와 만료 시간 담는 객체)
  private cache: Map<string, { data: any; expiry: number }> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // 5분마다 만료된 캐시 정리
    this.cleanupInterval = setInterval(
      () => {
        this.cleanupExpired();
      },
      5 * 60 * 1000
    );
  }

  /**
   * 만료된 캐시 항목 정리
   */
  private cleanupExpired(): void {
    const now = Date.now();
    let deletedCount = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      console.log(`🧹 메모리 캐시 정리: ${deletedCount}개 삭제`);
    }
  }

  /**
   * 서비스 종료 시 인터벌 정리
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log("✅ 메모리 캐시 정리 스케줄러 종료");
    }
  }

  /**
   * 키(key)에 해당하는 데이터를 캐시에서 조회
   * @param key 조회할 데이터의 키
   * @returns 캐시된 데이터 또는 null
   */
  async get(key: string): Promise<any> {
    // 1. Map에서 키로 데이터 가져옴
    const item = this.cache.get(key);

    // 2. 데이터 없으면 null 반환 (Cache Miss)
    if (!item) return null;

    // 3. 데이터 만료되었는지 확인
    // 현재 시간이 저장된 만료 시간보다 크면 만료된 것
    if (Date.now() > item.expiry) {
      // 만료된 데이터는 캐시에서 삭제
      this.cache.delete(key);
      return null; // 만료되었으므로 데이터가 없는 것과 같이 취급
    }

    // 4. 유효한 데이터 있으면 실제 데이터 반환 (Cache Hit)
    return item.data;
  }

  /**
   * 데이터 캐시에 저장
   * @param key 저장할 데이터의 키
   * @param data 저장할 실제 데이터
   * @param ttlSeconds 데이터의 유효 시간 (초 단위)
   */
  async set(key: string, data: any, ttlSeconds: number): Promise<void> {
    // 현재 시간(밀리초)에 유효 시간(초 * 1000)을 더해 만료 시간을 계산
    const expiry = Date.now() + ttlSeconds * 1000;
    // Map에 키와 함께 {데이터, 만료 시간} 객체를 저장
    this.cache.set(key, { data, expiry });
  }

  /**
   * 특정 데이터 캐시에서 삭제
   * @param key 삭제할 데이터 키
   */
  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  /**
   * 캐시의 모든 데이터 삭제
   */
  async clear(): Promise<void> {
    this.cache.clear();
  }
}

// 싱글톤 인스턴스 export
export const cacheService = new CacheService();

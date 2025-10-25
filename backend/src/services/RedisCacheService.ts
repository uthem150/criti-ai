import { Redis } from "ioredis";
import type { AnalysisResult, AnalysisCache } from "@criti-ai/shared";

export class RedisCacheService {
  private redis: Redis; // ioredis 인스턴스를 저장할 변수
  private isConnected: boolean = false; // 연결 상태를 추적하는 플래그

  constructor() {
    // 1. 환경 변수에서 Redis 접속 정보 가져오기
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    const redisPassword = process.env.REDIS_PASSWORD;

    // Redis 연결 설정 - 공식 옵션만 사용
    try {
      if (redisUrl.startsWith("redis://") || redisUrl.startsWith("rediss://")) {
        // URL 방식 연결
        this.redis = new Redis(redisUrl, {
          password: redisPassword || undefined,
          connectTimeout: 10000, // 10초 안에 연결 안되면 실패 처리
          lazyConnect: true, // 실제 명령을 실행할 때 연결 시작
          maxRetriesPerRequest: 3, // 요청 실패 시 최대 3번 재시도
          retryStrategy: (times: number) => {
            const delay = Math.min(times * 50, 2000); // 시도 횟수에 따라 딜레이 증가
            return delay;
          },
        });
      } else {
        // 호스트:포트 방식 연결
        // redisUrl이 URL 형식이 아닌 경우 (예: "localhost:6379")
        const [host, port] = redisUrl.replace("redis://", "").split(":");
        this.redis = new Redis({
          host: host || "localhost",
          port: parseInt(port) || 6379,
          password: redisPassword || undefined,
          connectTimeout: 10000,
          lazyConnect: true,
          maxRetriesPerRequest: 3,
          retryStrategy: (times: number) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
        });
      }
    } catch (error) {
      console.warn("⚠️ Redis 초기화 실패, 메모리 캐시로 대체:", error);
      // Redis 실패 시에도 애플리케이션이 동작하도록 더미 객체 생성
      this.redis = this.createDummyRedis();
    }

    this.redis.on("connect", () => {
      console.log("🔄 Redis connecting...");
    });

    this.redis.on("ready", () => {
      console.log("✅ Redis connection ready");
      this.isConnected = true;
    });

    this.redis.on("error", (err: Error) => {
      console.warn("⚠️ Redis connection error:", err.message);
      this.isConnected = false;

      // 개발 환경에서는 Redis 실패 시에도 계속 진행
      if (process.env.NODE_ENV === "development") {
        console.warn("📝 개발 환경: Redis 없이 메모리 캐시로 대체합니다.");
      }
    });

    this.redis.on("close", () => {
      console.log("❌ Redis connection closed");
      this.isConnected = false;
    });
  }

  /**
   * Redis 연결 실패 시 사용할 더미 객체 생성
   */
  private createDummyRedis(): any {
    return {
      setex: () => Promise.resolve("OK"),
      get: () => Promise.resolve(null),
      del: () => Promise.resolve(1),
      flushdb: () => Promise.resolve("OK"),
      incr: () => Promise.resolve(1),
      info: () => Promise.resolve(""),
      dbsize: () => Promise.resolve(0),
      ttl: () => Promise.resolve(-1),
      quit: () => Promise.resolve("OK"),
      on: () => {},
      status: "disconnected",
    };
  }

  /**
   * Redis 연결 상태 확인
   */
  public isRedisAvailable(): boolean {
    return this.isConnected && this.redis.status === "ready";
  }

  /**
   * 분석 결과 캐시 저장 (모든 분석 타입 지원)
   */
  async setAnalysisCache(
    url: string,
    analysis: AnalysisResult,
    ttlSeconds: number = 24 * 60 * 60
  ): Promise<void> {
    // 1. Redis 사용 불가 시 즉시 중단
    if (!this.isRedisAvailable()) {
      console.warn("Redis 사용 불가, 캐시 저장 스킵");
      return;
    }

    try {
      // 2. URL로 고유한 캐시 키 생성 (Base64 인코딩)
      const urlHash = Buffer.from(url).toString("base64");
      const cacheKey = `analysis:${urlHash}`;

      // 3. 캐시에 저장할 데이터 객체 구성 (메타데이터 추가)
      const cacheData: AnalysisCache = {
        url,
        urlHash,
        analysis,
        cachedAt: new Date().toISOString(), // 캐시된 시간
        expiresAt: new Date(Date.now() + ttlSeconds * 1000).toISOString(), // 만료될 시간
        hitCount: 1, // 조회 수 (처음이므로 1)
      };

      // 4. Redis에 TTL(만료 시간)과 함께 데이터 저장
      await this.redis.setex(cacheKey, ttlSeconds, JSON.stringify(cacheData));

      // 통계용 카운터 증가
      await this.redis.incr("stats:cache:set");

      console.log(`✅ 분석 결과 캐시 저장: ${url}`);
    } catch (error) {
      console.error("Redis 캐시 저장 실패:", error);
    }
  }

  /**
   * 분석 결과 캐시 조회 (모든 분석 타입 반환)
   */
  async getAnalysisCache(url: string): Promise<AnalysisResult | null> {
    if (!this.isRedisAvailable()) {
      return null;
    }

    try {
      const urlHash = Buffer.from(url).toString("base64");
      const cacheKey = `analysis:${urlHash}`;

      const cachedData = await this.redis.get(cacheKey);

      // [Cache Miss]: 캐시에 데이터가 없는 경우
      if (!cachedData) {
        await this.redis.incr("stats:cache:miss");
        return null;
      }

      // [Cache Hit]: 캐시에 데이터가 있는 경우
      const parsed: AnalysisCache = JSON.parse(cachedData);

      // 히트 카운트 증가
      parsed.hitCount += 1;
      await this.redis.setex(
        cacheKey,
        await this.redis.ttl(cacheKey),
        JSON.stringify(parsed)
      );

      // 히트 카운트 증가 및 데이터 업데이트
      await this.redis.incr("stats:cache:hit");

      console.log(`🎯 캐시 히트: ${url} (${parsed.hitCount}번째)`);
      return parsed.analysis;
    } catch (error) {
      console.error("Redis 캐시 조회 실패:", error);
      return null;
    }
  }

  /**
   * 챌린지 캐시 저장
   */
  async setChallengeCache(
    key: string,
    challenge: any,
    ttlSeconds: number = 60 * 60
  ): Promise<void> {
    if (!this.isRedisAvailable()) {
      return;
    }

    try {
      const cacheKey = `challenge:${key}`;
      // AnalysisCache와 달리 조회 수(hitCount) 같은 복잡한 메타데이터 없이, 전달받은 challenge 객체를 그대로 문자열로 변환하여 저장
      await this.redis.setex(cacheKey, ttlSeconds, JSON.stringify(challenge));
      console.log(`✅ 챌린지 캐시 저장: ${key}`);
    } catch (error) {
      console.error("챌린지 캐시 저장 실패:", error);
    }
  }

  /**
   * 챌린지 캐시 조회
   */
  async getChallengeCache(key: string): Promise<any | null> {
    if (!this.isRedisAvailable()) {
      return null;
    }

    try {
      const cacheKey = `challenge:${key}`;
      const cachedData = await this.redis.get(cacheKey);

      // 데이터가 없으면 null, 있으면 객체로 변환하여 반환
      if (!cachedData) {
        return null;
      }

      return JSON.parse(cachedData);
    } catch (error) {
      console.error("챌린지 캐시 조회 실패:", error);
      return null;
    }
  }

  /**
   * 일반 캐시 저장 (호환성 유지)
   */
  async set(key: string, data: any, ttlSeconds: number): Promise<void> {
    if (!this.isRedisAvailable()) {
      return;
    }

    try {
      await this.redis.setex(key, ttlSeconds, JSON.stringify(data));
    } catch (error) {
      console.error("일반 캐시 저장 실패:", error);
    }
  }

  /**
   * 일반 캐시 조회 (호환성 유지)
   */
  async get(key: string): Promise<any | null> {
    if (!this.isRedisAvailable()) {
      return null;
    }

    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("일반 캐시 조회 실패:", error);
      return null;
    }
  }

  /**
   * 캐시 삭제
   */
  async delete(key: string): Promise<void> {
    if (!this.isRedisAvailable()) {
      return;
    }

    try {
      await this.redis.del(key);
    } catch (error) {
      console.error("캐시 삭제 실패:", error);
    }
  }

  /**
   * 캐시 전체 삭제
   */
  async clear(): Promise<void> {
    if (!this.isRedisAvailable()) {
      return;
    }

    try {
      await this.redis.flushdb();
      console.log("🗑️ Redis 캐시 전체 삭제 완료");
    } catch (error) {
      console.error("캐시 전체 삭제 실패:", error);
    }
  }

  /**
   * 캐시 통계 조회
   */
  async getCacheStats(): Promise<{
    hits: number;
    misses: number;
    hitRate: number;
    totalKeys: number;
    memoryUsage: string;
  }> {
    if (!this.isRedisAvailable()) {
      return {
        hits: 0,
        misses: 0,
        hitRate: 0,
        totalKeys: 0,
        memoryUsage: "0 MB",
      };
    }

    try {
      // 1. hit, miss 카운터 값 가져오기
      const hits = parseInt((await this.redis.get("stats:cache:hit")) || "0");
      const misses = parseInt(
        (await this.redis.get("stats:cache:miss")) || "0"
      );

      // 2. 히트율 계산
      const total = hits + misses;
      const hitRate = total > 0 ? (hits / total) * 100 : 0;

      // 3. Redis 서버 정보(메모리) 가져오기
      const info = await this.redis.info("memory");
      const memoryMatch = info.match(/used_memory_human:(.+)/);
      const memoryUsage = memoryMatch ? memoryMatch[1].trim() : "0 MB";

      // 4. 전체 키 개수 가져오기
      const totalKeys = await this.redis.dbsize();

      return {
        hits,
        misses,
        hitRate: Math.round(hitRate * 100) / 100,
        totalKeys,
        memoryUsage,
      };
    } catch (error) {
      console.error("캐시 통계 조회 실패:", error);
      return {
        hits: 0,
        misses: 0,
        hitRate: 0,
        totalKeys: 0,
        memoryUsage: "0 MB",
      };
    }
  }

  /**
   * Redis 연결 종료
   */
  async disconnect(): Promise<void> {
    try {
      await this.redis.quit();
      console.log("✅ Redis 연결 정상 종료");
    } catch (error) {
      console.error("Redis 연결 종료 실패:", error);
    }
  }
}

// 싱글톤 인스턴스
// 애플리케이션이 시작될 때 단 한 번만 실행되고, 만들어진 유일한 객체를 export하여 애플리케이션의 모든 곳에서 공유
export const redisCacheService = new RedisCacheService();

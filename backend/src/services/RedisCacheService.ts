import Redis from 'ioredis';
import type { TrustAnalysis, AnalysisCache } from '@criti-ai/shared';

export class RedisCacheService {
  private redis: Redis;
  private isConnected: boolean = false;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const redisPassword = process.env.REDIS_PASSWORD;

    // Redis 연결 설정 - 공식 옵션만 사용
    try {
      if (redisUrl.startsWith('redis://') || redisUrl.startsWith('rediss://')) {
        // URL 방식 연결
        this.redis = new Redis(redisUrl, {
          password: redisPassword || undefined,
          connectTimeout: 10000,
          lazyConnect: true,
          maxRetriesPerRequest: 3,
          retryStrategy: (times: number) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
        });
      } else {
        // 호스트:포트 방식 연결
        const [host, port] = redisUrl.replace('redis://', '').split(':');
        this.redis = new Redis({
          host: host || 'localhost',
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
      console.warn('⚠️ Redis 초기화 실패, 메모리 캐시로 대체:', error);
      // Redis 실패 시에도 애플리케이션이 동작하도록 더미 객체 생성
      this.redis = this.createDummyRedis();
    }

    this.redis.on('connect', () => {
      console.log('🔄 Redis connecting...');
    });

    this.redis.on('ready', () => {
      console.log('✅ Redis connection ready');
      this.isConnected = true;
    });

    this.redis.on('error', (err) => {
      console.warn('⚠️ Redis connection error:', err.message);
      this.isConnected = false;
      
      // 개발 환경에서는 Redis 실패 시에도 계속 진행
      if (process.env.NODE_ENV === 'development') {
        console.warn('📝 개발 환경: Redis 없이 메모리 캐시로 대체합니다.');
      }
    });

    this.redis.on('close', () => {
      console.log('❌ Redis connection closed');
      this.isConnected = false;
    });
  }

  /**
   * Redis 연결 실패 시 사용할 더미 객체 생성
   */
  private createDummyRedis(): any {
    return {
      setex: () => Promise.resolve('OK'),
      get: () => Promise.resolve(null),
      del: () => Promise.resolve(1),
      flushdb: () => Promise.resolve('OK'),
      incr: () => Promise.resolve(1),
      info: () => Promise.resolve(''),
      dbsize: () => Promise.resolve(0),
      ttl: () => Promise.resolve(-1),
      quit: () => Promise.resolve('OK'),
      on: () => {},
      status: 'disconnected'
    };
  }

  /**
   * Redis 연결 상태 확인
   */
  public isRedisAvailable(): boolean {
    return this.isConnected && this.redis.status === 'ready';
  }

  /**
   * 분석 결과 캐시 저장
   */
  async setAnalysisCache(url: string, analysis: TrustAnalysis, ttlSeconds: number = 24 * 60 * 60): Promise<void> {
    if (!this.isRedisAvailable()) {
      console.warn('Redis 사용 불가, 캐시 저장 스킵');
      return;
    }

    try {
      const urlHash = Buffer.from(url).toString('base64');
      const cacheKey = `analysis:${urlHash}`;
      
      const cacheData: AnalysisCache = {
        url,
        urlHash,
        analysis,
        cachedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + ttlSeconds * 1000).toISOString(),
        hitCount: 1
      };

      await this.redis.setex(cacheKey, ttlSeconds, JSON.stringify(cacheData));
      
      // 통계용 카운터 증가
      await this.redis.incr('stats:cache:set');
      
      console.log(`✅ 분석 결과 캐시 저장: ${url}`);
    } catch (error) {
      console.error('Redis 캐시 저장 실패:', error);
    }
  }

  /**
   * 분석 결과 캐시 조회
   */
  async getAnalysisCache(url: string): Promise<TrustAnalysis | null> {
    if (!this.isRedisAvailable()) {
      return null;
    }

    try {
      const urlHash = Buffer.from(url).toString('base64');
      const cacheKey = `analysis:${urlHash}`;
      
      const cachedData = await this.redis.get(cacheKey);
      
      if (!cachedData) {
        await this.redis.incr('stats:cache:miss');
        return null;
      }

      const parsed: AnalysisCache = JSON.parse(cachedData);
      
      // 히트 카운트 증가
      parsed.hitCount += 1;
      await this.redis.setex(cacheKey, await this.redis.ttl(cacheKey), JSON.stringify(parsed));
      
      // 통계 업데이트
      await this.redis.incr('stats:cache:hit');
      
      console.log(`🎯 캐시 히트: ${url} (${parsed.hitCount}번째)`);
      return parsed.analysis;
      
    } catch (error) {
      console.error('Redis 캐시 조회 실패:', error);
      return null;
    }
  }

  /**
   * 챌린지 캐시 저장
   */
  async setChallengeCache(key: string, challenge: any, ttlSeconds: number = 60 * 60): Promise<void> {
    if (!this.isRedisAvailable()) {
      return;
    }

    try {
      const cacheKey = `challenge:${key}`;
      await this.redis.setex(cacheKey, ttlSeconds, JSON.stringify(challenge));
      console.log(`✅ 챌린지 캐시 저장: ${key}`);
    } catch (error) {
      console.error('챌린지 캐시 저장 실패:', error);
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
      
      if (!cachedData) {
        return null;
      }

      return JSON.parse(cachedData);
    } catch (error) {
      console.error('챌린지 캐시 조회 실패:', error);
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
      console.error('일반 캐시 저장 실패:', error);
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
      console.error('일반 캐시 조회 실패:', error);
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
      console.error('캐시 삭제 실패:', error);
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
      console.log('🗑️ Redis 캐시 전체 삭제 완료');
    } catch (error) {
      console.error('캐시 전체 삭제 실패:', error);
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
        memoryUsage: '0 MB'
      };
    }

    try {
      const hits = parseInt(await this.redis.get('stats:cache:hit') || '0');
      const misses = parseInt(await this.redis.get('stats:cache:miss') || '0');
      const total = hits + misses;
      const hitRate = total > 0 ? (hits / total) * 100 : 0;

      const info = await this.redis.info('memory');
      const memoryMatch = info.match(/used_memory_human:(.+)/);
      const memoryUsage = memoryMatch ? memoryMatch[1].trim() : '0 MB';

      const totalKeys = await this.redis.dbsize();

      return {
        hits,
        misses,
        hitRate: Math.round(hitRate * 100) / 100,
        totalKeys,
        memoryUsage
      };
    } catch (error) {
      console.error('캐시 통계 조회 실패:', error);
      return {
        hits: 0,
        misses: 0,
        hitRate: 0,
        totalKeys: 0,
        memoryUsage: '0 MB'
      };
    }
  }

  /**
   * Redis 연결 종료
   */
  async disconnect(): Promise<void> {
    try {
      await this.redis.quit();
      console.log('✅ Redis 연결 정상 종료');
    } catch (error) {
      console.error('Redis 연결 종료 실패:', error);
    }
  }
}

// 싱글톤 인스턴스
export const redisCacheService = new RedisCacheService();

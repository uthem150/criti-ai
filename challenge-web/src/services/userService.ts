/**
 * 사용자 관리 서비스
 * 사용자 ID 생성 및 관리
 */

import { CHALLENGE_CONSTANTS } from "../constants/challenge";

export class UserService {
  private userId: string;

  constructor() {
    this.userId = this.getOrCreateUserId();
  }

  /**
   * 브라우저별 고유 사용자 ID 생성/조회
   */
  private getOrCreateUserId(): string {
    try {
      const storageKey = CHALLENGE_CONSTANTS.STORAGE_KEYS.USER_ID;
      let userId = localStorage.getItem(storageKey);

      if (!userId) {
        userId = this.generateUserId();
        localStorage.setItem(storageKey, userId);
        console.log("🆕 새로운 사용자 ID 생성:", userId);
      } else {
        console.log("👤 기존 사용자 ID 사용:", userId);
      }

      return userId;
    } catch (error) {
      console.warn("⚠️ localStorage 사용 불가, 임시 ID 사용");
      return this.generateUserId("temp");
    }
  }

  /**
   * 고유 사용자 ID 생성
   */
  private generateUserId(prefix: string = "user"): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 현재 사용자 ID 반환
   */
  getCurrentUserId(): string {
    return this.userId;
  }

  /**
   * 사용자 ID 재설정
   */
  resetUserId(): string {
    const storageKey = CHALLENGE_CONSTANTS.STORAGE_KEYS.USER_ID;
    localStorage.removeItem(storageKey);
    this.userId = this.getOrCreateUserId();
    return this.userId;
  }
}

// 싱글톤 인스턴스
export const userService = new UserService();

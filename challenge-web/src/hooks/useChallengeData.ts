/**
 * 챌린지 데이터 관리 커스텀 훅
 */

import { useState, useEffect } from "react";
import type { Challenge, UserProgress } from "@criti-ai/shared";
import { challengeApiService } from "../services/challengeApiService";

interface UseChallengeDataReturn {
  challenges: Challenge[];
  currentChallenge: Challenge | null;
  challengeIndex: number;
  userProgress: UserProgress | null;
  isLoading: boolean;
  error: string | null;
  loadInitialData: () => Promise<void>;
  goToNext: () => void;
  goToPrevious: () => void;
  setChallengeIndex: (index: number) => void;
  updateUserProgress: (progress: Partial<UserProgress>) => void;
}

export const useChallengeData = (): UseChallengeDataReturn => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 현재 챌린지 설정
  useEffect(() => {
    if (challenges.length > 0 && challengeIndex < challenges.length) {
      setCurrentChallenge(challenges[challengeIndex]);
    }
  }, [challenges, challengeIndex]);

  /**
   * 초기 데이터 로드
   */
  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("🚀 초기 데이터 로드 시작");

      // 백엔드 연결 확인
      const isHealthy = await challengeApiService.healthCheck();
      if (!isHealthy) {
        throw new Error(
          "백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요."
        );
      }

      // 오늘의 챌린지 로드
      const todaysChallenges = await challengeApiService.getTodaysChallenges();
      console.log("✅ 오늘의 챌린지 로드 완료:", todaysChallenges.length, "개");

      if (todaysChallenges.length === 0) {
        throw new Error("오늘의 챌린지가 없습니다. 잠시 후 다시 시도해주세요.");
      }

      // 사용자 진행도 로드
      const progress = await challengeApiService.getUserProgress();
      console.log("✅ 사용자 진행도 로드 완료");

      setChallenges(todaysChallenges);
      setUserProgress(progress);
      setError(null);
    } catch (error) {
      console.error("❌ 초기 데이터 로드 실패:", error);
      setError(
        error instanceof Error
          ? error.message
          : "데이터를 불러오는 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 다음 챌린지로 이동
   */
  const goToNext = () => {
    if (challengeIndex < challenges.length - 1) {
      setChallengeIndex((prev) => prev + 1);
    }
  };

  /**
   * 이전 챌린지로 이동
   */
  const goToPrevious = () => {
    if (challengeIndex > 0) {
      setChallengeIndex((prev) => prev - 1);
    }
  };

  /**
   * 사용자 진행도 업데이트
   */
  const updateUserProgress = (progress: Partial<UserProgress>) => {
    if (userProgress) {
      setUserProgress({
        ...userProgress,
        ...progress,
      });
    }
  };

  return {
    challenges,
    currentChallenge,
    challengeIndex,
    userProgress,
    isLoading,
    error,
    loadInitialData,
    goToNext,
    goToPrevious,
    setChallengeIndex,
    updateUserProgress,
  };
};

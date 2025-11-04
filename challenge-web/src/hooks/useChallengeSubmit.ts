/**
 * 챌린지 제출 관리 커스텀 훅
 */

import { useState } from "react";
import { challengeApiService } from "../services/challengeApiService";

interface UseChallengeSubmitReturn {
  userAnswers: string[];
  showResult: boolean;
  isCorrect: boolean;
  submitLoading: boolean;
  startTime: number;
  toggleAnswer: (answer: string) => void;
  submitChallenge: (challengeId: string) => Promise<{
    isCorrect: boolean;
    correctAnswers: string[];
    explanation: string;
    score: number;
    bonusPoints?: number;
  } | null>;
  resetChallenge: () => void;
}

export const useChallengeSubmit = (): UseChallengeSubmitReturn => {
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  /**
   * 답안 선택/해제 토글
   */
  const toggleAnswer = (answer: string) => {
    setUserAnswers((prev) =>
      prev.includes(answer)
        ? prev.filter((a) => a !== answer)
        : [...prev, answer]
    );
  };

  /**
   * 챌린지 제출
   */
  const submitChallenge = async (challengeId: string) => {
    if (submitLoading) return null;

    setSubmitLoading(true);

    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      console.log("📝 답안 제출:", { userAnswers, timeSpent });

      const result = await challengeApiService.submitChallenge(
        challengeId,
        userAnswers,
        timeSpent
      );

      if (result) {
        setIsCorrect(result.isCorrect);
        setShowResult(true);
        console.log("✅ 답안 제출 완료:", result.isCorrect ? "정답" : "오답");
        return result;
      } else {
        throw new Error("답안 제출에 실패했습니다.");
      }
    } catch (error) {
      console.error("❌ 답안 제출 실패:", error);
      throw error;
    } finally {
      setSubmitLoading(false);
    }
  };

  /**
   * 챌린지 상태 초기화
   */
  const resetChallenge = () => {
    setUserAnswers([]);
    setShowResult(false);
    setIsCorrect(false);
    setStartTime(Date.now());
  };

  return {
    userAnswers,
    showResult,
    isCorrect,
    submitLoading,
    startTime,
    toggleAnswer,
    submitChallenge,
    resetChallenge,
  };
};

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
  explanation: string | null; // 서버에서 받은 해설
  resultAnswers: string[]; // 서버에서 받은 정답 ID
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
  const [explanation, setExplanation] = useState<string | null>(null); // 추가
  const [resultAnswers, setResultAnswers] = useState<string[]>([]); // 추가

  /**
   * 답안 선택/해제 토글 (answer는 "1", "2" 같은 ID)
   */
  const toggleAnswer = (answer: string) => {
    setUserAnswers((prev) =>
      prev.includes(answer)
        ? prev.filter((a) => a !== answer)
        : [answer] // 4지 선다형이므로 하나만 선택하도록 수정 (여러 개 선택 시: [...prev, answer])
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
        setExplanation(result.explanation); // 해설 저장
        setResultAnswers(result.correctAnswers); // 정답 ID 저장
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
    setExplanation(null);
    setResultAnswers([]); 
    setStartTime(Date.now());
  };

  return {
    userAnswers,
    showResult,
    isCorrect,
    submitLoading,
    startTime,
    explanation,
    resultAnswers,
    toggleAnswer,
    submitChallenge,
    resetChallenge,
  };
};
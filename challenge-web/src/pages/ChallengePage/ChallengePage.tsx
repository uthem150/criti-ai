import React, { useEffect, useState } from "react";
// 훅
import { useChallengeData } from "../../hooks/useChallengeData";
import { useChallengeSubmit } from "../../hooks/useChallengeSubmit";
import * as S from "./ChallengePage.style";

interface ChallengePageProps {
  onNavigateBack?: () => void;
}

// 오늘 날짜를 YYYY-MM-DD 형식으로 반환
const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// localStorage에서 오늘 완료한 문제 ID 목록 가져오기
const getTodayCompletedChallenges = (): string[] => {
  try {
    const today = getTodayDate();
    const storageKey = `completed_challenges_${today}`;
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// localStorage에 오늘 완료한 문제 ID 저장
const saveTodayCompletedChallenge = (challengeId: string) => {
  try {
    const today = getTodayDate();
    const storageKey = `completed_challenges_${today}`;
    const completed = getTodayCompletedChallenges();
    if (!completed.includes(challengeId)) {
      completed.push(challengeId);
      localStorage.setItem(storageKey, JSON.stringify(completed));
    }
  } catch (error) {
    console.error("localStorage 저장 실패:", error);
  }
};

// 챌린지 결과 저장 타입
interface ChallengeResult {
  challengeId: string;
  title: string;
  isCorrect: boolean;
  userAnswers: string[];
  correctAnswers: string[];
  explanation: string;
}

const ChallengePage: React.FC<ChallengePageProps> = ({
  onNavigateBack: _onNavigateBack,
}) => {
  // 챌린지 시작 여부
  const [hasStarted, setHasStarted] = useState(false);

  // 힌트 표시 여부
  const [showHints, setShowHints] = useState(false);

  // 완료된 챌린지 결과 저장
  const [challengeResults, setChallengeResults] = useState<ChallengeResult[]>(
    []
  );

  // 오늘 완료한 챌린지 ID 목록
  const [todayCompleted, setTodayCompleted] = useState<string[]>(
    getTodayCompletedChallenges()
  );

  // 완료 후 진행도 로드 플래그
  const [hasLoadedFinalProgress, setHasLoadedFinalProgress] = useState(false);

  // 1. 챌린지 데이터 관리 훅
  const {
    challenges,
    currentChallenge,
    challengeIndex,
    userProgress,
    isLoading,
    error,
    loadInitialData,
    goToNext,
    setChallengeIndex,
    updateUserProgress,
  } = useChallengeData();

  // 2. 챌린지 제출 관리 훅
  const {
    userAnswers,
    showResult,
    isCorrect,
    submitLoading,
    explanation,
    resultAnswers,
    toggleAnswer,
    submitChallenge,
    resetChallenge,
  } = useChallengeSubmit();

  // 3. 초기 데이터 로드 (컴포넌트 마운트 시 1회 실행)
  useEffect(() => {
    loadInitialData();
  }, []);

  // 4. 문제가 바뀔 때마다 힌트 상태 초기화
  useEffect(() => {
    setShowHints(false);
  }, [challengeIndex]);

  /**
   * 챌린지 시작
   */
  const handleStart = () => {
    setHasStarted(true);
  };

  /**
   * 답안 제출
   */
  const handleSubmit = async () => {
    if (!currentChallenge) return;

    try {
      const result = await submitChallenge(currentChallenge.id);

      if (result) {
        // 결과 저장
        setChallengeResults((prev) => [
          ...prev,
          {
            challengeId: currentChallenge.id,
            title: currentChallenge.title,
            isCorrect: result.isCorrect,
            userAnswers: userAnswers,
            correctAnswers: result.correctAnswers,
            explanation: result.explanation,
          },
        ]);

        // 정답이고 오늘 처음 푸는 문제인 경우에만 점수 추가
        if (result.isCorrect && !todayCompleted.includes(currentChallenge.id)) {
          console.log("✅ 정답! 사용자 진행도 업데이트");
          updateUserProgress({
            totalPoints: (userProgress?.totalPoints || 0) + result.score,
            completedChallenges: [
              ...(userProgress?.completedChallenges || []),
              currentChallenge.id,
            ],
          });

          // 오늘 완료한 문제로 저장
          saveTodayCompletedChallenge(currentChallenge.id);
          setTodayCompleted((prev) => [...prev, currentChallenge.id]);
        } else if (result.isCorrect) {
          console.log(
            "✅ 정답이지만 오늘 이미 푼 문제입니다. 점수 추가 안 함."
          );
        }
      }
    } catch (error) {
      console.error("❌ 답안 제출 실패:", error);
      alert("답안 제출 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  /**
   * 다음 문제로 이동
   */
  const handleNext = () => {
    goToNext();
    resetChallenge();
  };

  /**
   * 문제 다시 풀기
   */
  const handleRestart = () => {
    setChallengeResults([]);
    setChallengeIndex(0);
    resetChallenge();
    setHasStarted(true);
    setHasLoadedFinalProgress(false);
  };

  /**
   * 모든 문제 완료 여부
   */
  const isAllCompleted =
    hasStarted && challengeIndex === challenges.length - 1 && showResult;

  /**
   * 정답 개수 계산
   */
  const correctCount = challengeResults.filter((r) => r.isCorrect).length;
  const totalScore = correctCount * 10; // 각 문제당 10점

  /**
   * 모든 문제 완료했을 때 서버에서 진행도 다시 불러와서 새 뱃지 확인
   * (한 번만 실행)
   */
  useEffect(() => {
    if (isAllCompleted && !hasLoadedFinalProgress) {
      // 서버에서 최신 진행도 다시 불러옴
      loadInitialData();
      setHasLoadedFinalProgress(true);
    }
  }, [isAllCompleted, hasLoadedFinalProgress]);

  /**
   * 가장 최근에 획득한 training 카테고리 뱃지 가져오기
   */
  const getLatestTrainingBadge = () => {
    if (!userProgress?.badges || userProgress.badges.length === 0) {
      return null;
    }

    // training 카테고리 뱃지만 필터링하고 가장 최근 것 반환
    const trainingBadges = userProgress.badges
      .filter((badge) => badge.category === "training")
      .sort(
        (a, b) =>
          new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime()
      );

    return trainingBadges.length > 0 ? trainingBadges[0] : null;
  };

  const earnedBadge = getLatestTrainingBadge();

  // --- 렌더링 ---

  // 로딩 중 화면
  if (isLoading) {
    return (
      <S.Container>
        <S.ContentWrapper isStarted={false}>
          <S.ContentCard>
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
              <div style={{ fontSize: "18px", marginBottom: "8px" }}>
                오늘의 챌린지를 불러오는 중...
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>
                잠시만 기다려주세요
              </div>
            </div>
          </S.ContentCard>
        </S.ContentWrapper>
      </S.Container>
    );
  }

  // 에러 화면
  if (error) {
    return (
      <S.Container>
        <S.ContentWrapper isStarted={false}>
          <S.ContentCard>
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>❌</div>
              <div style={{ fontSize: "18px", marginBottom: "24px" }}>
                {error}
              </div>
              <S.StartButton onClick={loadInitialData}>다시 시도</S.StartButton>
            </div>
          </S.ContentCard>
        </S.ContentWrapper>
      </S.Container>
    );
  }

  // 챌린지가 없는 경우
  if (!currentChallenge && challenges.length === 0) {
    return (
      <S.Container>
        <S.ContentWrapper isStarted={false}>
          <S.ContentCard>
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
              <div style={{ fontSize: "18px" }}>
                현재 이용 가능한 챌린지가 없습니다.
              </div>
            </div>
          </S.ContentCard>
        </S.ContentWrapper>
      </S.Container>
    );
  }

  // 모든 문제 완료 화면
  if (isAllCompleted) {
    return (
      <S.Container>
        <S.ContentWrapper isStarted={true}>
          <S.CompletionContainer>
            <S.ScoreSection>
              <S.ScoreTitle>{totalScore}점</S.ScoreTitle>
              <S.ScoreSubtitle>
                {challenges.length}문제 중 {correctCount}문제를 맞추셨습니다!
              </S.ScoreSubtitle>

              {earnedBadge && (
                <S.BadgeDisplay>
                  <S.BadgeIcon>{earnedBadge.icon}</S.BadgeIcon>
                  <S.BadgeInfo>
                    <S.BadgeName>{earnedBadge.name}</S.BadgeName>
                    <S.BadgeDescription>
                      {earnedBadge.description}
                    </S.BadgeDescription>
                  </S.BadgeInfo>
                </S.BadgeDisplay>
              )}

              <S.RestartButton onClick={handleRestart}>
                새로운 문제 풀기
              </S.RestartButton>
            </S.ScoreSection>

            <S.ResultsListTitle>문제 결과</S.ResultsListTitle>
            <S.ResultsList>
              {challengeResults.map((result, index) => (
                <S.ResultItem key={result.challengeId}>
                  <S.ResultItemHeader>
                    <S.ResultItemNumber>{index + 1}번</S.ResultItemNumber>
                    <S.ResultItemStatus correct={result.isCorrect}>
                      {result.isCorrect ? "정답이에요!" : "땡! 틀렸어요."}
                    </S.ResultItemStatus>
                  </S.ResultItemHeader>
                  <S.ResultItemTitle>{result.title}</S.ResultItemTitle>

                  <S.AnswerLabel>
                    {result.isCorrect ? "정답" : "내가 고른 답"}
                  </S.AnswerLabel>
                  <S.AnswerBox correct={result.isCorrect}>
                    {challenges[index]?.options
                      .filter((opt) => result.userAnswers.includes(opt.id))
                      .map((opt) => opt.text)
                      .join(", ")}
                  </S.AnswerBox>

                  {!result.isCorrect && (
                    <>
                      <S.AnswerLabel>정답</S.AnswerLabel>
                      <S.AnswerBox correct={true}>
                        {challenges[index]?.options
                          .filter((opt) =>
                            result.correctAnswers.includes(opt.id)
                          )
                          .map((opt) => opt.text)
                          .join(", ")}
                      </S.AnswerBox>
                    </>
                  )}

                  {/* 해설 */}
                  {result.explanation && (
                    <S.ExplanationSection style={{ marginTop: "16px" }}>
                      <S.ExplanationTitle>📝 해설</S.ExplanationTitle>
                      <S.ExplanationText>
                        {result.explanation}
                      </S.ExplanationText>
                    </S.ExplanationSection>
                  )}
                </S.ResultItem>
              ))}
            </S.ResultsList>
          </S.CompletionContainer>
        </S.ContentWrapper>
      </S.Container>
    );
  }

  // 시작 전 화면
  if (!hasStarted) {
    return (
      <S.Container>
        <S.ContentWrapper isStarted={false}>
          <S.WelcomeContainer>
            <S.WelcomeIcon>🔍</S.WelcomeIcon>
            <S.WelcomeTitle>비판적 사고 훈련을 시작해볼까요?</S.WelcomeTitle>
            <S.WelcomeSubtitle>
              AI가 생성한 챌린지를 통해
              <br />
              가짜뉴스를 판별하는 능력을 기르세요!
            </S.WelcomeSubtitle>
            <S.StartButton onClick={handleStart}>
              훈련하기 시작하기
            </S.StartButton>
          </S.WelcomeContainer>
        </S.ContentWrapper>
      </S.Container>
    );
  }

  // 메인 챌린지 화면
  return (
    <S.Container>
      <S.ContentWrapper isStarted={true}>
        {/* 진행바 */}
        <S.ProgressBarContainer>
          <S.ProgressBar>
            <S.ProgressFill
              progress={((challengeIndex + 1) / challenges.length) * 100}
            />
          </S.ProgressBar>
        </S.ProgressBarContainer>

        {/* 챌린지 카드 */}
        <S.ContentCard>
          <S.QuestionNumber>{challengeIndex + 1}번</S.QuestionNumber>
          <S.QuestionTitle>{currentChallenge?.title}</S.QuestionTitle>

          {!showResult ? (
            <>
              {/* 선택지 */}
              <S.OptionsContainer>
                {currentChallenge?.options.map((option, index) => (
                  <S.OptionButton
                    key={option.id}
                    selected={userAnswers.includes(option.id)}
                    onClick={() => toggleAnswer(option.id)}
                  >
                    <S.OptionIcon selected={userAnswers.includes(option.id)}>
                      {userAnswers.includes(option.id) ? "✓" : index + 1}
                    </S.OptionIcon>
                    <S.OptionText>{option.text}</S.OptionText>
                  </S.OptionButton>
                ))}
              </S.OptionsContainer>

              {/* 힌트 섹션 (문제 풀 때 표시) */}
              {showHints &&
                currentChallenge?.hints &&
                currentChallenge.hints.length > 0 && (
                  <S.HintSection>
                    <S.HintContent>
                      {currentChallenge.hints.map((hint, index) => (
                        <div key={index} style={{ marginBottom: "12px" }}>
                          <strong>💡 힌트 {index + 1}:</strong> {hint}
                        </div>
                      ))}
                    </S.HintContent>
                  </S.HintSection>
                )}

              {/* 힌트 버튼과 제출 버튼 */}
              <S.ButtonContainer>
                {currentChallenge?.hints &&
                  currentChallenge.hints.length > 0 && (
                    <S.HintButton
                      onClick={() => setShowHints(!showHints)}
                      disabled={false}
                    >
                      {showHints ? "💡 힌트 숨기기" : "💡 힌트 보기"}
                    </S.HintButton>
                  )}
                <S.SubmitButton
                  onClick={handleSubmit}
                  disabled={userAnswers.length === 0 || submitLoading}
                >
                  {submitLoading ? "제출 중..." : "정답 확인하기"}
                </S.SubmitButton>
              </S.ButtonContainer>
            </>
          ) : (
            <S.ResultSection>
              {/* 결과 배지 */}
              <S.ResultBadge correct={isCorrect}>
                {isCorrect ? "✓" : "✗"}
              </S.ResultBadge>
              <S.ResultTitle correct={isCorrect}>
                {isCorrect ? "정답이에요!" : "땡! 틀렸어요."}
              </S.ResultTitle>

              {/* 내가 고른 답 / 정답 */}
              <S.AnswerExplanation>
                <S.AnswerLabel>
                  {isCorrect ? "정답" : "내가 고른 답"}
                </S.AnswerLabel>
                <S.AnswerBox correct={isCorrect}>
                  {currentChallenge?.options
                    .filter((opt) => userAnswers.includes(opt.id))
                    .map((opt) => opt.text)
                    .join(", ")}
                </S.AnswerBox>

                {!isCorrect && (
                  <>
                    <S.AnswerLabel>정답</S.AnswerLabel>
                    <S.AnswerBox correct={true}>
                      {currentChallenge?.options
                        .filter((opt) => resultAnswers.includes(opt.id))
                        .map((opt) => opt.text)
                        .join(", ")}
                    </S.AnswerBox>
                  </>
                )}
              </S.AnswerExplanation>

              {/* 해설 */}
              {explanation && (
                <S.ExplanationSection>
                  <S.ExplanationTitle>📝 해설</S.ExplanationTitle>
                  <S.ExplanationText>{explanation}</S.ExplanationText>
                </S.ExplanationSection>
              )}

              {/* 다음 문제 버튼 */}
              <S.NextButton onClick={handleNext}>다음 문제로 →</S.NextButton>
            </S.ResultSection>
          )}
        </S.ContentCard>
      </S.ContentWrapper>
    </S.Container>
  );
};

export default ChallengePage;

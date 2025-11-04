import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// 훅
import { useChallengeData } from "../../hooks/useChallengeData";
import { useChallengeSubmit } from "../../hooks/useChallengeSubmit";
import {
  PageContainer,
  Header,
  HeaderTitle,
  HeaderSubtitle,
  NavButtonContainer,
  NavButton,
  StatsBar,
  StatItem,
  StatLabel,
  StatValue,
  ChallengeContainer,
  ChallengeCard,
  ChallengeTitle,
  OptionsContainer,
  OptionButton,
  ActionButton,
  ResultContainer,
  ResultText,
  ExplanationText,
  NavigationButtons,
  BadgeContainer,
  Badge,
} from "./ChallengePage.style";

interface ChallengePageProps {
  onNavigateBack?: () => void;
}

const ChallengePage: React.FC<ChallengePageProps> = ({
  onNavigateBack: _onNavigateBack,
}) => {
  const navigate = useNavigate();

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
    goToPrevious,
    updateUserProgress,
  } = useChallengeData();

  // 2. 챌린지 제출 관리 훅
  const {
    userAnswers,
    showResult,
    isCorrect,
    submitLoading,
    explanation, // 해설
    toggleAnswer,
    submitChallenge,
    resetChallenge,
  } = useChallengeSubmit();

  // 3. 초기 데이터 로드 (컴포넌트 마운트 시 1회 실행)
  useEffect(() => {
    loadInitialData();
  }, []);

  /**
   * 답안 제출 (컴포넌트 레벨)
   * 훅 호출하고, 결과에 따라 userProgress 업데이트
   */
  const handleSubmit = async () => {
    if (!currentChallenge) return;

    try {
      // 훅 submitChallenge 함수 호출
      const result = await submitChallenge(currentChallenge.id);

      // 정답인 경우, useChallengeData 훅 updateUserProgress 함수로 상태 업데이트
      if (result && result.isCorrect) {
        console.log("✅ 정답! 사용자 진행도 업데이트");
        updateUserProgress({
          totalPoints: (userProgress?.totalPoints || 0) + result.score,
          completedChallenges: [
            ...(userProgress?.completedChallenges || []),
            currentChallenge.id,
          ],
        });
      }
    } catch (error) {
      console.error("❌ 답안 제출 실패 (Page):", error);
      alert("답안 제출 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  /**
   * 다음 챌린지로 이동
   */
  const handleNext = () => {
    goToNext(); // useChallengeData
    resetChallenge(); // useChallengeSubmit
  };

  /**
   * 이전 챌린지로 이동
   */
  const handlePrevious = () => {
    goToPrevious(); // useChallengeData
    resetChallenge(); // useChallengeSubmit
  };

  // --- 렌더링 ---

  // 로딩 중 화면
  if (isLoading) {
    return (
      <PageContainer>
        <Header>
          <HeaderTitle>🎯 Criti 챌린지</HeaderTitle>
          <HeaderSubtitle>AI와 함께하는 비판적 사고 훈련</HeaderSubtitle>
        </Header>
        <ChallengeContainer>
          <ChallengeCard>
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ fontSize: "24px", marginBottom: "16px" }}>⏳</div>
              <div>오늘의 챌린지를 불러오는 중...</div>
              <div
                style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}
              >
                잠시만 기다려주세요
              </div>
            </div>
          </ChallengeCard>
        </ChallengeContainer>
      </PageContainer>
    );
  }

  // 에러 화면
  if (error) {
    return (
      <PageContainer>
        <Header>
          <HeaderTitle>🎯 Criti 챌린지</HeaderTitle>
          <HeaderSubtitle>AI와 함께하는 비판적 사고 훈련</HeaderSubtitle>
        </Header>
        <ChallengeContainer>
          <ChallengeCard>
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ fontSize: "24px", marginBottom: "16px" }}>❌</div>
              <div style={{ marginBottom: "16px" }}>{error}</div>
              <ActionButton onClick={loadInitialData}>다시 시도</ActionButton>
            </div>
          </ChallengeCard>
        </ChallengeContainer>
      </PageContainer>
    );
  }

  // 챌린지가 없는 경우
  if (!currentChallenge) {
    return (
      <PageContainer>
        <Header>
          <HeaderTitle>🎯 Criti 챌린지</HeaderTitle>
          <HeaderSubtitle>AI와 함께하는 비판적 사고 훈련</HeaderSubtitle>
        </Header>
        <ChallengeContainer>
          <ChallengeCard>
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ fontSize: "24px", marginBottom: "16px" }}>📭</div>
              <div>현재 이용 가능한 챌린지가 없습니다.</div>
            </div>
          </ChallengeCard>
        </ChallengeContainer>
      </PageContainer>
    );
  }

  // 메인 챌린지 화면
  return (
    <PageContainer>
      <Header>
        <HeaderTitle>🎯 Criti 챌린지</HeaderTitle>
        <HeaderSubtitle>AI와 함께하는 비판적 사고 훈련</HeaderSubtitle>
      </Header>

      {/* 네비게이션 버튼 */}
      <NavButtonContainer>
        <NavButton onClick={() => navigate("/youtube")}>
          <span>🎬</span>
          유튜브 영상 분석
        </NavButton>
      </NavButtonContainer>

      {/* 사용자 진행도 */}
      {userProgress && (
        <StatsBar>
          <StatItem>
            <StatLabel>총 점수</StatLabel>
            <StatValue>{userProgress.totalPoints}점</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>레벨</StatLabel>
            <StatValue>Lv.{userProgress.level}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>완료한 챌린지</StatLabel>
            <StatValue>{userProgress.completedChallenges.length}개</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>획득한 배지</StatLabel>
            <StatValue>{userProgress.badges.length}개</StatValue>
          </StatItem>
        </StatsBar>
      )}

      {/* 배지 목록 */}
      {userProgress && userProgress.badges.length > 0 && (
        <BadgeContainer>
          <h3>🏆 획득한 배지</h3>
          {userProgress.badges.map((badge) => (
            <Badge key={badge.id}>
              <span className="icon">{badge.icon}</span>
              <div>
                <div className="name">{badge.name}</div>
                <div className="description">{badge.description}</div>
              </div>
            </Badge>
          ))}
        </BadgeContainer>
      )}

      {/* 챌린지 카드 */}
      <ChallengeContainer>
        <ChallengeCard>
          <ChallengeTitle>
            챌린지 {challengeIndex + 1}/{challenges.length}:{" "}
            {currentChallenge.title}
          </ChallengeTitle>

          {!showResult && (
            <>
              <OptionsContainer>
                {currentChallenge.options.map((option, index) => (
                  <OptionButton
                    key={option.id}
                    selected={userAnswers.includes(option.id)}
                    onClick={() => toggleAnswer(option.id)} // 훅의 toggleAnswer 사용
                    title={option.text}
                  >
                    {/* 번호 + 텍스트 */}
                    <span className="option-number">{index + 1}</span>
                    <div className="option-text">{option.text}</div>
                  </OptionButton>
                ))}
              </OptionsContainer>

              <ActionButton
                onClick={handleSubmit} // 래핑된 handleSubmit 함수 사용
                disabled={userAnswers.length === 0 || submitLoading}
              >
                {submitLoading ? "제출 중..." : "답안 제출"}
              </ActionButton>
            </>
          )}

          {showResult && (
            <ResultContainer>
              <ResultText isCorrect={isCorrect}>
                {isCorrect ? "🎉 정답입니다!" : "❌ 틀렸습니다."}
              </ResultText>

              <ExplanationText
                // React가 마크다운(굵은 글씨 등)을 렌더링하도록 설정
                dangerouslySetInnerHTML={{ __html: explanation || "" }}
              />
            </ResultContainer>
          )}
        </ChallengeCard>
      </ChallengeContainer>

      {/* 네비게이션 버튼 */}
      <NavigationButtons>
        <div style={{ display: "flex", gap: "12px" }}>
          {challengeIndex > 0 && (
            <ActionButton onClick={handlePrevious}>← 이전 챌린지</ActionButton>
          )}
          {challengeIndex < challenges.length - 1 && showResult && (
            <ActionButton onClick={handleNext}>다음 챌린지 →</ActionButton>
          )}
          {challengeIndex === challenges.length - 1 && showResult && (
            <ActionButton onClick={loadInitialData}>새로고침</ActionButton>
          )}
        </div>
      </NavigationButtons>
    </PageContainer>
  );
};

export default ChallengePage;

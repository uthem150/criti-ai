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
  ChallengeContent,
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
    isLoading, // loadingState.isLoading -> isLoading
    error, // loadingState.error -> error
    loadInitialData,
    goToNext,
    goToPrevious,
    updateUserProgress, // 사용자 진행도 업데이트 함수
  } = useChallengeData();

  // 2. 챌린지 제출 관리 훅
  const {
    userAnswers,
    showResult,
    isCorrect,
    submitLoading,
    toggleAnswer, // handleAnswerToggle -> toggleAnswer
    submitChallenge, // 제출 함수
    resetChallenge, // 리셋 함수
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

  /**
   * 답안 옵션 목록 반환 (이전과 동일)
   */
  const getAnswerOptions = () => {
    if (currentChallenge?.type === "article-analysis") {
      return [
        {
          id: "성급한 일반화",
          title: "성급한 일반화",
          description: "적은 사례로 모든 경우에 적용하는 오류",
          example: "예: 학생 한 명이 처벌받았으니 모든 학생이 문제이다",
          emoji: "📈",
        },
        {
          id: "허위 이분법",
          title: "허위 이분법",
          description: "복잡한 문제를 단순히 둘 중 하나로만 나누는 오류",
          example: "예: 찬성 또는 반대, 둘 중 하나만 선택하라",
          emoji: "⚖️",
        },
        {
          id: "인신공격",
          title: "인신공격",
          description: "논리대신 사람을 비난하는 오류",
          example: "예: 그 언론인은 예전에 거짓말했으니 말을 믿을 수 없다",
          emoji: "💭",
        },
        {
          id: "권위에 호소",
          title: "권위에 호소",
          description: "근거 없이 권위를 내세우는 오류",
          example: "예: 전문가가 말했으니 무조건 맞다",
          emoji: "👑",
        },
        {
          id: "감정적 편향",
          title: "감정적 편향",
          description: "이성적 판단보다 감정에 호소하는 표현",
          example: "예: 충격적이다, 분노한다, 끝날 뜻하다",
          emoji: "😡",
        },
        {
          id: "과장된 표현",
          title: "과장된 표현",
          description: "사실보다 과도하게 부풀리거나 축소되는 표현",
          example: "예: 모든 사람, 절대로, 전혀, 반드시",
          emoji: "📈",
        },
        {
          id: "허수아비 공격",
          title: "허수아비 공격",
          description: "상대방 주장을 왜곡해서 공격하는 오류",
          example: "예: 그들은 완전히 방두하자고 한다 (왜곡된 해석)",
          emoji: "🧙",
        },
        {
          id: "순환논리",
          title: "순환논리",
          description: "증명할 것을 근거로 사용하는 오류",
          example: "예: A가 옮다. 왜냐? A기 때문이다",
          emoji: "🔄",
        },
        {
          id: "광고성 콘텐츠",
          title: "광고성 콘텐츠",
          description: "상품이나 서비스를 홍보하려는 의도가 숨어있음",
          example: "예: 상품명 언급, 할인 정보, 연예인 추천",
          emoji: "📺",
        },
        {
          id: "긴급성 유도",
          title: "긴급성 유도",
          description: "시간 압박을 가해 성급한 판단을 유도하는 표현",
          example: "예: 지금 당장, 마지막 기회, 더 이상 망설이지 마라",
          emoji: "⏰",
        },
        {
          id: "과장된 수치",
          title: "과장된 수치",
          description: "근거 없거나 의심스러운 통계나 수치",
          example: "예: 98% 만족, 10명 중 9명 추천 (출처 불분명)",
          emoji: "📉",
        },
        {
          id: "선동적 언어",
          title: "선동적 언어",
          description: "감정을 자극해 특정 의견을 유도하는 언어",
          example: "예: 배신, 학살, 대참사, 유전의 진실",
          emoji: "🗣️",
        },
      ];
    }
    return [];
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
          <ChallengeContent>{currentChallenge.content}</ChallengeContent>

          {!showResult && (
            <>
              <OptionsContainer>
                {getAnswerOptions().map((option) => (
                  <OptionButton
                    key={option.id}
                    selected={userAnswers.includes(option.id)}
                    onClick={() => toggleAnswer(option.id)} // 훅의 toggleAnswer 사용
                    title={option.example}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontSize: "18px" }}>{option.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "600", marginBottom: "2px" }}>
                          {option.title}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            opacity: 0.8,
                            lineHeight: "1.3",
                          }}
                        >
                          {option.description}
                        </div>
                      </div>
                    </div>
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
              <ExplanationText>
                <strong>정답:</strong>{" "}
                {currentChallenge.correctAnswers.join(", ")}
              </ExplanationText>
              <ExplanationText>{currentChallenge.explanation}</ExplanationText>
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

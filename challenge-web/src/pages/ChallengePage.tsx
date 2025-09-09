import React, { useState, useEffect } from "react";
import type { Challenge, UserProgress } from "@criti-ai/shared";
import { challengeApiService } from "../services/challengeApiService";
import {
  PageContainer,
  Header,
  HeaderTitle,
  HeaderSubtitle,
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

// 로딩 상태 및 에러 상태
interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export const ChallengePage: React.FC<ChallengePageProps> = ({
  onNavigateBack: _onNavigateBack,
}) => {
  // 상태 관리
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  // 초기 데이터 로드
  useEffect(() => {
    loadInitialData();
  }, []);

  // 현재 챌린지 설정
  useEffect(() => {
    if (challenges.length > 0 && challengeIndex < challenges.length) {
      setCurrentChallenge(challenges[challengeIndex]);
      setStartTime(Date.now()); // 챌린지 시작 시간 기록
    }
  }, [challenges, challengeIndex]);

  /**
   * 초기 데이터 로드 (챌린지 + 사용자 진행도)
   */
  const loadInitialData = async () => {
    setLoadingState({ isLoading: true, error: null });
    
    try {
      console.log('🚀 초기 데이터 로드 시작');
      
      // 백엔드 연결 확인
      const isHealthy = await challengeApiService.healthCheck();
      if (!isHealthy) {
        throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      }

      // 오늘의 챌린지 로드
      const todaysChallenges = await challengeApiService.getTodaysChallenges();
      console.log('✅ 오늘의 챌린지 로드 완료:', todaysChallenges.length, '개');
      
      if (todaysChallenges.length === 0) {
        throw new Error('오늘의 챌린지가 없습니다. 잠시 후 다시 시도해주세요.');
      }

      // 사용자 진행도 로드
      const progress = await challengeApiService.getUserProgress();
      console.log('✅ 사용자 진행도 로드 완료');

      setChallenges(todaysChallenges);
      setUserProgress(progress);
      setLoadingState({ isLoading: false, error: null });
      
    } catch (error) {
      console.error('❌ 초기 데이터 로드 실패:', error);
      setLoadingState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : '데이터를 불러오는 중 오류가 발생했습니다.'
      });
    }
  };

  /**
   * 답안 선택/해제 토글
   */
  const handleAnswerToggle = (answer: string) => {
    setUserAnswers((prev) =>
      prev.includes(answer)
        ? prev.filter((a) => a !== answer)
        : [...prev, answer]
    );
  };

  /**
   * 답안 제출
   */
  const handleSubmit = async () => {
    if (!currentChallenge || submitLoading) return;

    setSubmitLoading(true);
    
    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000); // 초 단위
      console.log('📝 답안 제출:', { userAnswers, timeSpent });

      const result = await challengeApiService.submitChallenge(
        currentChallenge.id,
        userAnswers,
        timeSpent
      );

      if (result) {
        setIsCorrect(result.isCorrect);
        setShowResult(true);
        
        // 사용자 진행도 업데이트 (점수 반영)
        if (userProgress && result.isCorrect) {
          setUserProgress({
            ...userProgress,
            totalPoints: userProgress.totalPoints + result.score,
            completedChallenges: [...userProgress.completedChallenges, currentChallenge.id]
          });
        }
        
        console.log('✅ 답안 제출 완료:', result.isCorrect ? '정답' : '오답');
      } else {
        throw new Error('답안 제출에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 답안 제출 실패:', error);
      alert('답안 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitLoading(false);
    }
  };

  /**
   * 다음 챌린지로 이동
   */
  const handleNext = () => {
    if (challengeIndex < challenges.length - 1) {
      setChallengeIndex((prev) => prev + 1);
      resetChallenge();
    }
  };

  /**
   * 이전 챌린지로 이동
   */
  const handlePrevious = () => {
    if (challengeIndex > 0) {
      setChallengeIndex((prev) => prev - 1);
      resetChallenge();
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

  /**
   * 답안 옵션 목록 반환 (설명 포함)
   */
  const getAnswerOptions = () => {
    if (currentChallenge?.type === "article-analysis") {
      return [
        {
          id: "성급한 일반화",
          title: "성급한 일반화",
          description: "적은 사례로 모든 경우에 적용하는 오류",
          example: "예: 학생 한 명이 처벌받았으니 모든 학생이 문제이다",
          emoji: "📈"
        },
        {
          id: "허위 이분법",
          title: "허위 이분법",
          description: "복잡한 문제를 단순히 둘 중 하나로만 나누는 오류",
          example: "예: 찬성 또는 반대, 둘 중 하나만 선택하라",
          emoji: "⚖️"
        },
        {
          id: "인신공격",
          title: "인신공격",
          description: "논리대신 사람을 비난하는 오류",
          example: "예: 그 언론인은 예전에 거짓말했으니 말을 믿을 수 없다",
          emoji: "💭"
        },
        {
          id: "권위에 호소",
          title: "권위에 호소",
          description: "근거 없이 권위를 내세우는 오류",
          example: "예: 전문가가 말했으니 무조건 맞다",
          emoji: "👑"
        },
        {
          id: "감정적 편향",
          title: "감정적 편향",
          description: "이성적 판단보다 감정에 호소하는 표현",
          example: "예: 충격적이다, 분노한다, 끝날 뜻하다",
          emoji: "😡"
        },
        {
          id: "과장된 표현",
          title: "과장된 표현",
          description: "사실보다 과도하게 부풀리거나 축소되는 표현",
          example: "예: 모든 사람, 절대로, 전혀, 반드시",
          emoji: "📈"
        },
        {
          id: "허수아비 공격",
          title: "허수아비 공격",
          description: "상대방 주장을 왜곡해서 공격하는 오류",
          example: "예: 그들은 완전히 방두하자고 한다 (왜곡된 해석)",
          emoji: "🧙"
        },
        {
          id: "순환논리",
          title: "순환논리",
          description: "증명할 것을 근거로 사용하는 오류",
          example: "예: A가 옮다. 왜냐? A기 때문이다",
          emoji: "🔄"
        },
        {
          id: "광고성 콘텐츠",
          title: "광고성 콘텐츠",
          description: "상품이나 서비스를 홍보하려는 의도가 숨어있음",
          example: "예: 상품명 언급, 할인 정보, 연예인 추천",
          emoji: "📺"
        },
        {
          id: "긴급성 유도",
          title: "긴급성 유도",
          description: "시간 압박을 가해 성급한 판단을 유도하는 표현",
          example: "예: 지금 당장, 마지막 기회, 더 이상 망설이지 마라",
          emoji: "⏰"
        },
        {
          id: "과장된 수치",
          title: "과장된 수치",
          description: "근거 없거나 의심스러운 통계나 수치",
          example: "예: 98% 만족, 10명 중 9명 추천 (출처 불분명)",
          emoji: "📉"
        },
        {
          id: "선동적 언어",
          title: "선동적 언어",
          description: "감정을 자극해 특정 의견을 유도하는 언어",
          example: "예: 배신, 학살, 대참사, 유전의 진실",
          emoji: "🗣️"
        }
      ];
    }
    return [];
  };

  // 로딩 중 화면
  if (loadingState.isLoading) {
    return (
      <PageContainer>
        <Header>
          <HeaderTitle>🎯 Criti 챌린지</HeaderTitle>
          <HeaderSubtitle>AI와 함께하는 비판적 사고 훈련</HeaderSubtitle>
        </Header>
        <ChallengeContainer>
          <ChallengeCard>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '24px', marginBottom: '16px' }}>⏳</div>
              <div>오늘의 챌린지를 불러오는 중...</div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                잠시만 기다려주세요
              </div>
            </div>
          </ChallengeCard>
        </ChallengeContainer>
      </PageContainer>
    );
  }

  // 에러 화면
  if (loadingState.error) {
    return (
      <PageContainer>
        <Header>
          <HeaderTitle>🎯 Criti 챌린지</HeaderTitle>
          <HeaderSubtitle>AI와 함께하는 비판적 사고 훈련</HeaderSubtitle>
        </Header>
        <ChallengeContainer>
          <ChallengeCard>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '24px', marginBottom: '16px' }}>❌</div>
              <div style={{ marginBottom: '16px' }}>{loadingState.error}</div>
              <ActionButton onClick={loadInitialData}>
                다시 시도
              </ActionButton>
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
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '24px', marginBottom: '16px' }}>📭</div>
              <div>현재 이용 가능한 챌린지가 없습니다.</div>
            </div>
          </ChallengeCard>
        </ChallengeContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <HeaderTitle>🎯 Criti 챌린지</HeaderTitle>
        <HeaderSubtitle>AI와 함께하는 비판적 사고 훈련</HeaderSubtitle>
      </Header>

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
            챌린지 {challengeIndex + 1}/{challenges.length}: {currentChallenge.title}
          </ChallengeTitle>
          <ChallengeContent>{currentChallenge.content}</ChallengeContent>

          {!showResult && (
            <>
              <OptionsContainer>
                {getAnswerOptions().map((option) => (
                  <OptionButton
                    key={option.id}
                    selected={userAnswers.includes(option.id)}
                    onClick={() => handleAnswerToggle(option.id)}
                    title={option.example}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>{option.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                          {option.title}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          opacity: 0.8, 
                          lineHeight: '1.3'
                        }}>
                          {option.description}
                        </div>
                      </div>
                    </div>
                  </OptionButton>
                ))}
              </OptionsContainer>

              <ActionButton
                onClick={handleSubmit}
                disabled={userAnswers.length === 0 || submitLoading}
              >
                {submitLoading ? '제출 중...' : '답안 제출'}
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

import React, { useState, useEffect } from 'react';
import type { Challenge, UserProgress } from '@shared/types';
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
  Badge
} from './ChallengePage.style';

interface ChallengePageProps {
  onNavigateBack?: () => void;
}

// 더미 챌린지 데이터 (나중에 API로 교체)
const DUMMY_CHALLENGES: Challenge[] = [
  {
    id: '1',
    type: 'article-analysis',
    title: '이 기사에서 논리적 오류를 찾아보세요',
    content: `
      "최근 한 연구에 따르면 스마트폰을 많이 사용하는 청소년들의 성적이 떨어진다고 합니다. 
      실제로 우리 학교 1등 학생인 김OO도 스마트폰을 거의 사용하지 않습니다. 
      따라서 모든 청소년들은 반드시 스마트폰 사용을 중단해야 합니다.
      이것은 과학적으로 증명된 사실이므로 의심의 여지가 없습니다."
    `,
    correctAnswers: ['성급한 일반화', '허위 이분법'],
    explanation: `
      이 글에는 여러 논리적 오류가 있습니다:
      1. **성급한 일반화**: 한 연구와 한 명의 사례만으로 모든 청소년에게 적용
      2. **허위 이분법**: 스마트폰을 "완전히 사용하지 않거나" 또는 "많이 사용하거나" 둘 중 하나로만 제시
      3. **권위에 호소**: "과학적으로 증명된 사실"이라며 의심을 차단하려는 시도
    `,
    difficulty: 'beginner',
    points: 100
  },
  {
    id: '2',
    type: 'article-analysis', 
    title: '편향된 표현을 찾아보세요',
    content: `
      "충격적인 발표! 정부의 새로운 정책이 국민들을 분노하게 만들고 있습니다. 
      이 말도 안 되는 정책으로 인해 모든 국민이 피해를 보고 있으며, 
      반드시 즉시 철회되어야 합니다. 전문가들은 이구동성으로 비판하고 있습니다."
    `,
    correctAnswers: ['감정적 편향', '과장된 표현'],
    explanation: `
      이 글의 편향된 표현들:
      1. **감정적 편향**: "충격적인", "분노하게", "말도 안 되는" 등 감정을 자극하는 표현
      2. **과장된 표현**: "모든 국민", "반드시 즉시", "이구동성으로" 등 절대적 표현
      3. **선동적 언어**: 객관적 사실보다는 감정적 반응을 유도하는 언어 사용
    `,
    difficulty: 'beginner',
    points: 80
  }
];

export const ChallengePage: React.FC<ChallengePageProps> = ({ onNavigateBack }) => {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    userId: 'guest',
    totalPoints: 350,
    level: 2,
    badges: [
      { id: '1', name: '첫 걸음', description: '첫 번째 챌린지 완료', icon: '🎯', earnedAt: '2024-03-01' },
      { id: '2', name: '탐정', description: '편향 표현 5개 찾기', icon: '🔍', earnedAt: '2024-03-02' }
    ],
    completedChallenges: ['1', '2'],
    analyticsUsed: 15
  });

  useEffect(() => {
    if (DUMMY_CHALLENGES.length > 0) {
      setCurrentChallenge(DUMMY_CHALLENGES[challengeIndex]);
    }
  }, [challengeIndex]);

  const handleAnswerToggle = (answer: string) => {
    setUserAnswers(prev => 
      prev.includes(answer) 
        ? prev.filter(a => a !== answer)
        : [...prev, answer]
    );
  };

  const handleSubmit = () => {
    if (!currentChallenge) return;

    const correct = currentChallenge.correctAnswers.every(answer => 
      userAnswers.includes(answer)
    ) && userAnswers.every(answer => 
      currentChallenge.correctAnswers.includes(answer)
    );

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setUserProgress(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + currentChallenge.points,
        completedChallenges: [...prev.completedChallenges, currentChallenge.id]
      }));
    }
  };

  const handleNext = () => {
    if (challengeIndex < DUMMY_CHALLENGES.length - 1) {
      setChallengeIndex(prev => prev + 1);
      resetChallenge();
    }
  };

  const handlePrevious = () => {
    if (challengeIndex > 0) {
      setChallengeIndex(prev => prev - 1);
      resetChallenge();
    }
  };

  const resetChallenge = () => {
    setUserAnswers([]);
    setShowResult(false);
    setIsCorrect(false);
  };

  const getAnswerOptions = () => {
    if (currentChallenge?.type === 'article-analysis') {
      return [
        '성급한 일반화',
        '허위 이분법', 
        '인신공격',
        '권위에 호소',
        '감정적 편향',
        '과장된 표현',
        '허수아비 공격',
        '순환논리'
      ];
    }
    return [];
  };

  if (!currentChallenge) {
    return <div>로딩 중...</div>;
  }

  return (
    <PageContainer>
      <Header>
        <HeaderTitle>🎯 크리티 챌린지</HeaderTitle>
        <HeaderSubtitle>AI와 함께하는 비판적 사고 훈련</HeaderSubtitle>
      </Header>

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

      {userProgress.badges.length > 0 && (
        <BadgeContainer>
          <h3>🏆 획득한 배지</h3>
          {userProgress.badges.map(badge => (
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

      <ChallengeContainer>
        <ChallengeCard>
          <ChallengeTitle>
            챌린지 {challengeIndex + 1}: {currentChallenge.title}
          </ChallengeTitle>
          <ChallengeContent>
            {currentChallenge.content}
          </ChallengeContent>

          {!showResult && (
            <>
              <OptionsContainer>
                {getAnswerOptions().map(option => (
                  <OptionButton
                    key={option}
                    selected={userAnswers.includes(option)}
                    onClick={() => handleAnswerToggle(option)}
                  >
                    {option}
                  </OptionButton>
                ))}
              </OptionsContainer>

              <ActionButton 
                onClick={handleSubmit}
                disabled={userAnswers.length === 0}
              >
                답안 제출
              </ActionButton>
            </>
          )}

          {showResult && (
            <ResultContainer>
              <ResultText isCorrect={isCorrect}>
                {isCorrect ? '🎉 정답입니다!' : '❌ 틀렸습니다.'}
              </ResultText>
              <ExplanationText>
                <strong>정답:</strong> {currentChallenge.correctAnswers.join(', ')}
              </ExplanationText>
              <ExplanationText>
                {currentChallenge.explanation}
              </ExplanationText>
            </ResultContainer>
          )}
        </ChallengeCard>
      </ChallengeContainer>

      <NavigationButtons>
        {onNavigateBack && (
          <ActionButton onClick={onNavigateBack}>
            ← 확장 프로그램으로 돌아가기
          </ActionButton>
        )}
        <div style={{ display: 'flex', gap: '12px' }}>
          {challengeIndex > 0 && (
            <ActionButton onClick={handlePrevious}>
              ← 이전 챌린지
            </ActionButton>
          )}
          {challengeIndex < DUMMY_CHALLENGES.length - 1 && showResult && (
            <ActionButton onClick={handleNext}>
              다음 챌린지 →
            </ActionButton>
          )}
        </div>
      </NavigationButtons>
    </PageContainer>
  );
};

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Badge } from "@criti-ai/shared";
import { challengeApiService } from "../../services/challengeApiService";
import * as S from "./BadgesPage.style";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

interface BadgeCategory {
  id: string;
  name: string;
  icon: string;
}

const BADGE_CATEGORIES: BadgeCategory[] = [
  { id: "all", name: "전체", icon: "🏆" },
  { id: "training", name: "학습", icon: "📚" },
  { id: "streak", name: "연속 기록", icon: "🔥" },
  { id: "milestone", name: "성취", icon: "🎖️" },
  { id: "special", name: "특별", icon: "🎁" },
];

// 모든 가능한 뱃지 목록 (백엔드의 seedBadges.ts와 동일)
const ALL_POSSIBLE_BADGES: Omit<Badge, "earnedAt">[] = [
  // Training
  {
    id: "training-1",
    name: "비판적 사고 입문",
    description: "첫 챌린지를 완료했어요!",
    icon: "🌱",
    category: "training",
  },
  {
    id: "training-2",
    name: "감정 마스터",
    description: "일일 정답률 90% 이상 달성!",
    icon: "🎯",
    category: "training",
  },
  {
    id: "training-3",
    name: "논리의 달인",
    description: "일일 정답률 70% 이상 달성!",
    icon: "🎓",
    category: "training",
  },
  {
    id: "training-4",
    name: "도전자",
    description: "일일 정답률 50% 이상 달성!",
    icon: "💪",
    category: "training",
  },
  {
    id: "training-5",
    name: "완벽주의자",
    description: "오늘의 챌린지를 모두 맞췄어요!",
    icon: "💯",
    category: "training",
  },
  {
    id: "training-6",
    name: "번개같은 사고",
    description: "60초 안에 정답을 맞췄어요!",
    icon: "⚡",
    category: "training",
  },
  {
    id: "training-7",
    name: "독학의 달인",
    description: "힌트 없이 오늘의 챌린지를 모두 완료했어요!",
    icon: "🧠",
    category: "training",
  },
  {
    id: "training-8",
    name: "신속한 판단",
    description: "90초 안에 정답을 맞췄어요!",
    icon: "💨",
    category: "training",
  },
  {
    id: "training-9",
    name: "광속",
    description: "30초 안에 정답을 맞췄어요! 혹시 찍으신 건 아니죠?",
    icon: "☄️",
    category: "training",
  }, // Streak

  {
    id: "streak-1",
    name: "3일 연속 도전",
    description: "3일 연속으로 챌린지를 완료했어요!",
    icon: "🔥",
    category: "streak",
  },
  {
    id: "streak-2",
    name: "일주일 마스터",
    description: "7일 연속으로 챌린지를 완료했어요!",
    icon: "🔥🔥",
    category: "streak",
  },
  {
    id: "streak-3",
    name: "2주 연속 달성",
    description: "14일 연속으로 챌린지를 완료했어요!",
    icon: "📅",
    category: "streak",
  },
  {
    id: "streak-4",
    name: "한 달 챔피언",
    description: "30일 연속으로 챌린지를 완료했어요!",
    icon: "🔥🔥🔥",
    category: "streak",
  },
  {
    id: "streak-5",
    name: "백일장",
    description: "100일 연속 도전! 당신은 전설입니다!",
    icon: "👑",
    category: "streak",
  },
  {
    id: "streak-6",
    name: "살아있는 역사",
    description: "200일 연속 도전! 경이롭습니다!",
    icon: "🏛️",
    category: "streak",
  },
  // Milestone
  {
    id: "milestone-1",
    name: "새싹 탐정",
    description: "50점을 달성했어요!",
    icon: "🌱",
    category: "milestone",
  },
  {
    id: "milestone-2",
    name: "신입 탐정",
    description: "100점을 달성했어요!",
    icon: "⭐",
    category: "milestone",
  },
  {
    id: "milestone-3",
    name: "베테랑 탐정",
    description: "500점을 달성했어요!",
    icon: "💎",
    category: "milestone",
  },
  {
    id: "milestone-4",
    name: "마스터 탐정",
    description: "1,000점을 달성했어요!",
    icon: "🏆",
    category: "milestone",
  },
  {
    id: "milestone-5",
    name: "프로 탐정",
    description: "2,500점을 달성했어요!",
    icon: "🕵️",
    category: "milestone",
  },
  {
    id: "milestone-6",
    name: "전설의 탐정",
    description: "5,000점을 달성했어요!",
    icon: "👑",
    category: "milestone",
  },
  {
    id: "milestone-7",
    name: "CritiAI 마스터",
    description: "10,000점을 달성했어요! 명예의 전당 입성!",
    icon: "🌌",
    category: "milestone",
  },
  {
    id: "milestone-8",
    name: "챌린지 컬렉터",
    description: "10개의 챌린지를 완료했어요!",
    icon: "📚",
    category: "milestone",
  },
  {
    id: "milestone-9",
    name: "챌린지 마스터",
    description: "50개의 챌린지를 완료했어요!",
    icon: "🎖️",
    category: "milestone",
  },
  {
    id: "milestone-10",
    name: "수집가",
    description: "100개의 챌린지를 완료했어요!",
    icon: "📙",
    category: "milestone",
  },
  {
    id: "milestone-11",
    name: "사서",
    description: "250개의 챌린지를 완료했어요!",
    icon: "📔",
    category: "milestone",
  },
  {
    id: "milestone-12",
    name: "박물관장",
    description: "500개의 챌린지를 완료했어요!",
    icon: "🏛️",
    category: "milestone",
  },
  // Special
  {
    id: "special-1",
    name: "첫 방문",
    description: "CritiAI에 오신 것을 환영합니다!",
    icon: "🎉",
    category: "special",
  },
  {
    id: "special-2",
    name: "얼리 어답터",
    description: "베타 테스터로 참여해주셨어요!",
    icon: "🎁",
    category: "special",
  },
];

export default function BadgesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserBadges();
  }, []);

  const loadUserBadges = async () => {
    try {
      setLoading(true);
      const progress = await challengeApiService.getUserProgress();

      if (progress) {
        setEarnedBadges(progress.badges || []);
      }
    } catch (error) {
      console.error("뱃지 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const isEarned = (badgeName: string) => {
    return earnedBadges.some((b) => b.name === badgeName);
  };

  const getEarnedDate = (badgeName: string) => {
    const badge = earnedBadges.find((b) => b.name === badgeName);
    return badge?.earnedAt;
  };

  const filteredBadges =
    activeCategory === "all"
      ? ALL_POSSIBLE_BADGES
      : ALL_POSSIBLE_BADGES.filter((b) => b.category === activeCategory);

  const earnedCount = earnedBadges.length;
  const totalCount = ALL_POSSIBLE_BADGES.length;
  const completionRate =
    totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <S.Container>
        <S.LoadingCard>
          <LoadingSpinner />
          <div>뱃지를 불러오는 중...</div>
        </S.LoadingCard>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.Header>
        <S.Title>🏆 내 뱃지 컬렉션</S.Title>
        <S.Description>
          챌린지를 완료하고 다양한 뱃지를 수집하세요!
        </S.Description>
      </S.Header>

      <S.Stats>
        <S.StatCard>
          <S.StatValue>{earnedCount}</S.StatValue>
          <S.StatLabel>획득한 뱃지</S.StatLabel>
        </S.StatCard>
        <S.StatCard>
          <S.StatValue>{totalCount}</S.StatValue>
          <S.StatLabel>전체 뱃지</S.StatLabel>
        </S.StatCard>
        <S.StatCard>
          <S.StatValue>{completionRate}%</S.StatValue>
          <S.StatLabel>달성률</S.StatLabel>
        </S.StatCard>
      </S.Stats>

      <S.CategoryTabs>
        {BADGE_CATEGORIES.map((category) => (
          <S.CategoryTab
            key={category.id}
            active={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.icon} {category.name}
          </S.CategoryTab>
        ))}
      </S.CategoryTabs>

      {filteredBadges.length === 0 ? (
        <S.EmptyState>
          <h3>아직 뱃지가 없습니다</h3>
          <p>챌린지를 완료하고 첫 뱃지를 획득해보세요!</p>
        </S.EmptyState>
      ) : (
        <S.BadgesGrid>
          {filteredBadges.map((badge) => {
            const earned = isEarned(badge.name);
            const earnedDate = getEarnedDate(badge.name);

            return (
              <S.BadgeCard key={badge.id} earned={earned}>
                {!earned && <S.LockedBadge>🔒</S.LockedBadge>}
                <S.BadgeIcon>{badge.icon}</S.BadgeIcon>
                <S.BadgeName>{badge.name}</S.BadgeName>
                <S.BadgeDescription>{badge.description}</S.BadgeDescription>

                {earned && earnedDate && (
                  <S.BadgeEarnedDate>
                    {new Date(earnedDate).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    획득
                  </S.BadgeEarnedDate>
                )}

                {!earned && (
                  <S.ProgressInfo>아직 획득하지 못한 뱃지입니다</S.ProgressInfo>
                )}
              </S.BadgeCard>
            );
          })}
        </S.BadgesGrid>
      )}
    </S.Container>
  );
}

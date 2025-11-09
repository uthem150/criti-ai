import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BADGE_DATA = [
  // === Training 카테고리 (일일 챌린지) ===
  {
    name: "비판적 사고 입문",
    description: "첫 챌린지를 완료했어요!",
    icon: "🌱",
    category: "training",
    conditionType: "first_challenge",
    conditionValue: "1",
  },
  {
    name: "감정 마스터",
    description: "일일 정답률 90% 이상 달성!",
    icon: "🎯",
    category: "training",
    conditionType: "daily_accuracy",
    conditionValue: "90",
  },
  {
    name: "논리의 달인",
    description: "일일 정답률 70% 이상 달성!",
    icon: "🎓",
    category: "training",
    conditionType: "daily_accuracy",
    conditionValue: "70",
  },
  {
    name: "도전자",
    description: "일일 정답률 50% 이상 달성!",
    icon: "💪",
    category: "training",
    conditionType: "daily_accuracy",
    conditionValue: "50",
  },
  {
    name: "완벽주의자",
    description: "오늘의 챌린지를 모두 맞췄어요!",
    icon: "💯",
    category: "training",
    conditionType: "daily_perfect",
    conditionValue: "100",
  },
  {
    name: "번개같은 사고",
    description: "60초 안에 정답을 맞췄어요!",
    icon: "⚡",
    category: "training",
    conditionType: "fast_answer",
    conditionValue: "60",
  },
  {
    name: "독학의 달인",
    description: "힌트 없이 오늘의 챌린지를 모두 완료했어요!",
    icon: "🧠",
    category: "training",
    conditionType: "no_hints",
    conditionValue: "0",
  },
  {
    name: "신속한 판단",
    description: "90초 안에 정답을 맞췄어요!",
    icon: "💨",
    category: "training",
    conditionType: "fast_answer",
    conditionValue: "90",
  },
  {
    name: "광속",
    description: "30초 안에 정답을 맞췄어요! 혹시 찍으신 건 아니죠?",
    icon: "☄️",
    category: "training",
    conditionType: "fast_answer",
    conditionValue: "30",
  },

  {
    name: "3일 연속 도전",
    description: "3일 연속으로 챌린지를 완료했어요!",
    icon: "🔥",
    category: "streak",
    conditionType: "consecutive_days",
    conditionValue: "3",
  },
  {
    name: "일주일 마스터",
    description: "7일 연속으로 챌린지를 완료했어요!",
    icon: "🔥🔥",
    category: "streak",
    conditionType: "consecutive_days",
    conditionValue: "7",
  },
  {
    name: "2주 연속 달성",
    description: "14일 연속으로 챌린지를 완료했어요!",
    icon: "📅",
    category: "streak",
    conditionType: "consecutive_days",
    conditionValue: "14",
  },
  {
    name: "한 달 챔피언",
    description: "30일 연속으로 챌린지를 완료했어요!",
    icon: "🔥🔥🔥",
    category: "streak",
    conditionType: "consecutive_days",
    conditionValue: "30",
  },
  {
    name: "백일장",
    description: "100일 연속 도전! 당신은 전설입니다!",
    icon: "👑",
    category: "streak",
    conditionType: "consecutive_days",
    conditionValue: "100",
  },
  {
    name: "살아있는 역사",
    description: "200일 연속 도전! 경이롭습니다!",
    icon: "🏛️",
    category: "streak",
    conditionType: "consecutive_days",
    conditionValue: "200",
  },
  // === Milestone 카테고리 (누적 성취) ===
  {
    name: "새싹 탐정",
    description: "50점을 달성했어요!",
    icon: "🌱",
    category: "milestone",
    pointsRequired: 50,
  },
  {
    name: "신입 탐정",
    description: "100점을 달성했어요!",
    icon: "⭐",
    category: "milestone",
    pointsRequired: 100,
  },
  {
    name: "베테랑 탐정",
    description: "500점을 달성했어요!",
    icon: "💎",
    category: "milestone",
    pointsRequired: 500,
  },
  {
    name: "마스터 탐정",
    description: "1,000점을 달성했어요!",
    icon: "🏆",
    category: "milestone",
    pointsRequired: 1000,
  },
  {
    name: "프로 탐정",
    description: "2,500점을 달성했어요!",
    icon: "🕵️",
    category: "milestone",
    pointsRequired: 2500,
  },
  {
    name: "전설의 탐정",
    description: "5,000점을 달성했어요!",
    icon: "👑",
    category: "milestone",
    pointsRequired: 5000,
  },
  {
    name: "CritiAI 마스터",
    description: "10,000점을 달성했어요! 명예의 전당 입성!",
    icon: "🌌",
    category: "milestone",
    pointsRequired: 10000,
  },
  {
    name: "챌린지 컬렉터",
    description: "10개의 챌린지를 완료했어요!",
    icon: "📚",
    category: "milestone",
    challengesRequired: 10,
  },
  {
    name: "챌린지 마스터",
    description: "50개의 챌린지를 완료했어요!",
    icon: "🎖️",
    category: "milestone",
    challengesRequired: 50,
  },
  {
    name: "수집가",
    description: "100개의 챌린지를 완료했어요!",
    icon: "📙",
    category: "milestone",
    challengesRequired: 100,
  },
  {
    name: "사서",
    description: "250개의 챌린지를 완료했어요!",
    icon: "📔",
    category: "milestone",
    challengesRequired: 250,
  },
  {
    name: "박물관장",
    description: "500개의 챌린지를 완료했어요!",
    icon: "🏛️", // 스트릭의 '살아있는 역사'와 아이콘 통일
    category: "milestone",
    challengesRequired: 500,
  },
  // === Special 카테고리 (특별 이벤트) ===
  {
    name: "첫 방문",
    description: "CritiAI에 오신 것을 환영합니다!",
    icon: "🎉",
    category: "special",
    conditionType: "first_visit",
    conditionValue: "1",
  },
  {
    name: "얼리 어답터",
    description: "베타 테스터로 참여해주셨어요!",
    icon: "🎁",
    category: "special",
    conditionType: "beta_tester",
    conditionValue: "1",
  },
];

async function seedBadges() {
  console.log("🌱 뱃지 시드 데이터 생성 시작...");

  try {
    for (const badge of BADGE_DATA) {
      const existing = await prisma.badge.findFirst({
        where: {
          name: badge.name,
        },
      });

      if (existing) {
        console.log(`⏭️ 이미 존재: ${badge.name}`);
        continue;
      }

      await prisma.badge.create({
        data: {
          ...badge,
          isActive: true,
        },
      });

      console.log(`✅ 생성 완료: ${badge.icon} ${badge.name}`);
    }

    console.log(`\n🎉 총 ${BADGE_DATA.length}개의 뱃지 시드 완료!`);
  } catch (error) {
    console.error("❌ 뱃지 시드 실패:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
seedBadges();

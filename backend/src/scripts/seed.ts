import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 시드 데이터 생성 시작..."); // 기존 데이터 정리 (개발 환경에서만)

  if (process.env.NODE_ENV === "development") {
    console.log("🧹 기존 데이터 정리...");
    await prisma.userBadge.deleteMany();
    await prisma.challengeResult.deleteMany();
    await prisma.userFeedback.deleteMany();
    await prisma.user.deleteMany();
    await prisma.badge.deleteMany();
    await prisma.challenge.deleteMany();
    await prisma.systemConfig.deleteMany();
  }

  // 1. 배지 생성

  console.log("📛 배지 생성...");
  const badges = await Promise.all([
    prisma.badge.create({
      data: {
        name: "첫 걸음",
        description: "첫 번째 챌린지를 완료했습니다",
        icon: "🎯",
        category: "milestone",
        challengesRequired: 1,
      },
    }),
    prisma.badge.create({
      data: {
        name: "탐정",
        description: "챌린지 5개 완료",
        icon: "🔍",
        category: "training",
        challengesRequired: 5,
      },
    }),
    prisma.badge.create({
      data: {
        name: "논리 마스터",
        description: "총 500점을 획득했습니다",
        icon: "🧠",
        category: "milestone",
        pointsRequired: 500,
      },
    }),
    prisma.badge.create({
      data: {
        name: "챌린지 완주자",
        description: "10개의 챌린지를 완료했습니다",
        icon: "🏆",
        category: "training",
        challengesRequired: 10,
      },
    }),
    prisma.badge.create({
      data: {
        name: "비판적 사고자",
        description: "총 1000점을 획득했습니다",
        icon: "💡",
        category: "milestone",
        pointsRequired: 1000,
      },
    }),
    prisma.badge.create({
      data: {
        name: "광고 스나이퍼",
        description: "광고성 콘텐츠 20개를 식별했습니다",
        icon: "🎯",
        category: "analysis",
        pointsRequired: 500,
      },
    }),
  ]);

  console.log(`✅ 배지 ${badges.length}개 생성 완료`); // 2. 챌린지 생성 (*** 새 구조로 수정됨 ***)

  console.log("🎮 챌린지 생성...");

  const challenges = await Promise.all([
    prisma.challenge.create({
      data: {
        type: "article-analysis",
        title: "다음 중 '성급한 일반화'가 포함된 문장을 선택하세요.", // content: ... (삭제)
        category: "성급한 일반화", // 추가
        options: JSON.stringify([
          // 추가
          {
            id: "1",
            text: "최근 한 연구에 따르면 스마트폰을 많이 사용하는 청소년들의 성적이 떨어진다고 합니다.",
          },
          {
            id: "2",
            text: "실제로 우리 학교 1등 학생인 김OO도 스마트폰을 거의 사용하지 않습니다.",
          },
          {
            id: "3",
            text: "따라서 모든 청소년들은 반드시 스마트폰 사용을 중단해야 합니다.",
          }, // 정답
          {
            id: "4",
            text: "이것은 과학적으로 증명된 사실이므로 의심의 여지가 없습니다.",
          },
        ]),
        correctAnswers: JSON.stringify(["3"]), // 수정 (오류 이름 -> ID)
        explanation:
          "3번 문장은 '한 연구'와 '한 명의 학생' 사례만으로 '모든 청소년'이 '반드시' 중단해야 한다고 주장하므로 성급한 일반화의 오류입니다.",
        difficulty: "beginner",
        points: 100,
        hints: JSON.stringify([
          "한 명의 사례로 전체를 판단하고 있지 않나요?",
          "선택지가 너무 극단적이지 않나요?",
        ]),
      },
    }),
    prisma.challenge.create({
      data: {
        type: "article-analysis",
        title: "다음 중 '감정적 편향'이 드러나는 문장을 선택하세요.", // content: ... (삭제)
        category: "감정적 편향", // 추가
        options: JSON.stringify([
          // 추가
          {
            id: "1",
            text: "충격적인 발표! 정부의 새로운 정책이 국민들을 분노하게 만들고 있습니다.",
          }, // 정답
          {
            id: "2",
            text: "이 정책으로 인해 모든 국민이 피해를 보고 있으며, 반드시 즉시 철회되어야 합니다.",
          },
          {
            id: "3",
            text: "전문가들은 이 정책에 대해 이구동성으로 비판하고 있습니다.",
          },
          {
            id: "4",
            text: "정부는 해당 정책의 시행을 재고할 필요가 있습니다.",
          },
        ]),
        correctAnswers: JSON.stringify(["1"]), // 수정
        explanation:
          '1번 문장은 "충격적인", "분노하게" 등 감정적 단어를 사용하여 객관적 사실 전달보다 감정적 반응을 유도하므로 \'감정적 편향\'에 해당합니다.',
        difficulty: "beginner",
        points: 80,
        hints: JSON.stringify([
          "감정을 자극하는 단어들이 보이나요?",
          "사실을 전달하는 문장인가요?",
        ]),
      },
    }),
    prisma.challenge.create({
      data: {
        type: "article-analysis",
        title: "다음 중 '인신공격'의 오류가 포함된 문장을 선택하세요.", // content: ... (삭제)
        category: "인신공격", // 추가
        options: JSON.stringify([
          // 추가
          {
            id: "1",
            text: "A 후보를 지지하는 사람들은 모두 부정부패에 연루되어 있습니다.",
          }, // 정답
          {
            id: "2",
            text: "B 후보의 정책은 완벽하지는 않지만, A 후보보다는 훨씬 낫습니다.",
          },
          {
            id: "3",
            text: "만약 A 후보가 당선된다면 우리나라는 망할 것입니다.",
          },
          {
            id: "4",
            text: "상식이 있는 국민이라면 당연히 B 후보를 선택할 것입니다.",
          },
        ]),
        correctAnswers: JSON.stringify(["1"]), // 수정
        explanation:
          "1번 문장은 A 후보의 정책을 비판하는 대신, A 후보를 '지지하는 사람들'을 '부정부패에 연루'되었다고 공격하며 논점을 흐리고 있습니다. 이는 인신공격의 오류입니다.",
        difficulty: "advanced",
        points: 150,
        hints: JSON.stringify([
          "지지자들을 일반화하고 있지 않나요?",
          "주장 대신 사람을 공격하고 있나요?",
        ]),
      },
    }),
    prisma.challenge.create({
      data: {
        type: "article-analysis",
        title: "다음 중 '구매 유도' 의도가 가장 명확한 문장을 선택하세요.", // content: ... (삭제)
        category: "구매 유도",
        options: JSON.stringify([
          {
            id: "1",
            text: "요즘 피부가 너무 거칠어서 고민이었는데, 친구가 추천해준 OO크림을 써봤어요!",
          },
          {
            id: "2",
            text: "정말 하루 만에 피부가 달라졌어요. 여러분도 꼭 써보세요!",
          },
          {
            id: "3",
            text: "지금 할인 이벤트도 하고 있더라고요. 링크 남겨둘게요~",
          },
          { id: "4", text: "#광고아님 #진짜후기 #피부개선" },
        ]),
        correctAnswers: JSON.stringify(["3"]),
        explanation:
          "3번 문장은 '할인 이벤트', '링크 남겨둘게요'라는 명확한 Call-to-Action(CTA)을 통해 독자의 구매를 직접적으로 유도하고 있습니다.",
        difficulty: "intermediate",
        points: 120,
        hints: JSON.stringify([
          "정말 하루 만에 효과가 나타날까요?",
          "왜 할인 정보를 언급할까요?",
        ]),
      },
    }),
    prisma.challenge.create({
      data: {
        type: "article-analysis",
        title:
          "다음 중 데이터를 '시각적으로 과장'하여 해석한 문장을 선택하세요.",
        category: "시각적 과장",
        options: JSON.stringify([
          {
            id: "1",
            text: "청소년 게임 중독이 사회적 문제로 대두되고 있습니다.",
          },
          {
            id: "2",
            text: "작년 대비 올해 게임 시간이 20%에서 25%로 증가했다는 그래프가 공개되었습니다.",
          },
          {
            id: "3",
            text: "그래프를 보면 놀라울 정도로 급격한 증가를 보여주고 있어 심각한 사회 문제입니다.",
          },
          { id: "4", text: "관련 부처는 이에 대한 대책을 마련 중입니다." },
        ]),
        correctAnswers: JSON.stringify(["3"]),
        explanation:
          "3번 문장은 5%p 증가(20%→25%)라는 수치를 '놀라울 정도로 급격한 증가'라고 감정적/과장되게 해석하고 있습니다. 이는 Y축 조작 등으로 시각적 효과를 극대화한 그래프를 보고 잘못 해석한 결과일 수 있습니다.",
        difficulty: "advanced",
        points: 180,
        hints: JSON.stringify([
          "실제 증가율은 얼마일까요?",
          "변화를 설명하는 단어 중 과장된 것이 있나요?",
        ]),
      },
    }),
  ]);

  console.log(`✅ 챌린지 ${challenges.length}개 생성 완료`);
  // 3. 시스템 설정 생성
  console.log("⚙️ 시스템 설정 생성...");
  await Promise.all([
    prisma.systemConfig.create({
      data: {
        key: "max_cache_size",
        value: "10000",
        type: "number",
      },
    }),
    prisma.systemConfig.create({
      data: {
        key: "cache_ttl_hours",
        value: "24",
        type: "number",
      },
    }),
    prisma.systemConfig.create({
      data: {
        key: "daily_challenge_count",
        value: "5", // 챌린지 개수 5개로 수정
        type: "number",
      },
    }),
    prisma.systemConfig.create({
      data: {
        key: "analysis_rate_limit",
        value: "100",
        type: "number",
      },
    }),
    prisma.systemConfig.create({
      data: {
        key: "trusted_domains",
        value: JSON.stringify([
          "bbc.com",
          "reuters.com",
          "ap.org",
          "yonhapnews.co.kr",
          "jtbc.co.kr",
        ]),
        type: "json",
      },
    }),
  ]);
  console.log("✅ 시스템 설정 생성 완료");

  // 4. 테스트 사용자 생성 (개발 환경에서만)
  if (process.env.NODE_ENV === "development") {
    console.log("👤 테스트 사용자 생성...");

    const testUser = await prisma.user.create({
      data: {
        username: "testuser",
        displayName: "테스트 사용자",
        totalPoints: 80,
        level: 1,
        analyticsUsed: 15,
      },
    });
    // 테스트 사용자에게 몇 개 배지 부여
    await Promise.all([
      prisma.userBadge.create({
        data: {
          userId: testUser.id,
          badgeId: badges[0].id,
        },
      }),
    ]);
    // 테스트 챌린지 결과 생성

    await Promise.all([
      prisma.challengeResult.create({
        data: {
          userId: testUser.id,
          challengeId: challenges[0].id,
          userAnswers: JSON.stringify(["1"]),
          isCorrect: false,
          score: 30,
          timeSpent: 120,
          hintsUsed: 1,
        },
      }),
      prisma.challengeResult.create({
        data: {
          userId: testUser.id,
          challengeId: challenges[1].id, // 두 번째 챌린지 (정답 '1')
          userAnswers: JSON.stringify(["1"]), // 수정: 사용자가 '1'을 선택 (정답)
          isCorrect: true,
          score: 80, // 정답 점수
          timeSpent: 95,
          hintsUsed: 0,
        },
      }),
    ]);

    console.log(`✅ 테스트 사용자 생성 완료: ${testUser.id}`);
  }

  console.log("🎉 시드 데이터 생성 완료!");
}

main()
  .catch((e) => {
    console.error("❌ 시드 데이터 생성 실패:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

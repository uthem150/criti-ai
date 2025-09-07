import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 시드 데이터 생성 시작...');

  // 기존 데이터 정리 (개발 환경에서만)
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 기존 데이터 정리...');
    
    await prisma.userBadge.deleteMany();
    await prisma.challengeResult.deleteMany();
    await prisma.userFeedback.deleteMany();
    await prisma.user.deleteMany();
    await prisma.badge.deleteMany();
    await prisma.challenge.deleteMany();
    await prisma.systemConfig.deleteMany();
  }

  // 1. 배지 생성
  console.log('📛 배지 생성...');
  
  const badges = await Promise.all([
    prisma.badge.create({
      data: {
        name: '첫 걸음',
        description: '첫 번째 분석을 완료했습니다',
        icon: '🎯',
        category: 'milestone',
        pointsRequired: 0,
        challengesRequired: 0
      }
    }),
    prisma.badge.create({
      data: {
        name: '탐정',
        description: '편향 표현 5개를 찾아냈습니다',
        icon: '🔍',
        category: 'analysis',
        pointsRequired: 100
      }
    }),
    prisma.badge.create({
      data: {
        name: '논리 마스터',
        description: '논리적 오류 10개를 찾아냈습니다',
        icon: '🧠',
        category: 'analysis',
        pointsRequired: 300
      }
    }),
    prisma.badge.create({
      data: {
        name: '챌린지 완주자',
        description: '10개의 챌린지를 완료했습니다',
        icon: '🏆',
        category: 'training',
        challengesRequired: 10
      }
    }),
    prisma.badge.create({
      data: {
        name: '비판적 사고자',
        description: '총 1000점을 획득했습니다',
        icon: '💡',
        category: 'milestone',
        pointsRequired: 1000
      }
    }),
    prisma.badge.create({
      data: {
        name: '광고 스나이퍼',
        description: '광고성 콘텐츠 20개를 식별했습니다',
        icon: '🎯',
        category: 'analysis',
        pointsRequired: 500
      }
    })
  ]);

  console.log(`✅ 배지 ${badges.length}개 생성 완료`);

  // 2. 챌린지 생성
  console.log('🎮 챌린지 생성...');

  const challenges = await Promise.all([
    prisma.challenge.create({
      data: {
        type: 'article-analysis',
        title: '이 기사에서 논리적 오류를 찾아보세요',
        content: `최근 한 연구에 따르면 스마트폰을 많이 사용하는 청소년들의 성적이 떨어진다고 합니다. 
실제로 우리 학교 1등 학생인 김OO도 스마트폰을 거의 사용하지 않습니다. 
따라서 모든 청소년들은 반드시 스마트폰 사용을 중단해야 합니다.
이것은 과학적으로 증명된 사실이므로 의심의 여지가 없습니다.`,
        correctAnswers: JSON.stringify(['성급한 일반화', '허위 이분법', '권위에 호소']),
        explanation: '이 글에는 성급한 일반화(하나의 연구와 사례로 전체를 판단), 허위 이분법(완전히 안 쓰거나 많이 쓰거나만 제시), 권위에 호소(과학적 사실이라며 의심을 차단) 오류가 있습니다.',
        difficulty: 'beginner',
        points: 100,
        hints: JSON.stringify(['한 명의 사례로 전체를 판단하고 있지 않나요?', '선택지가 너무 극단적이지 않나요?'])
      }
    }),
    prisma.challenge.create({
      data: {
        type: 'article-analysis',
        title: '편향된 표현을 찾아보세요',
        content: `충격적인 발표! 정부의 새로운 정책이 국민들을 분노하게 만들고 있습니다. 
이 말도 안 되는 정책으로 인해 모든 국민이 피해를 보고 있으며, 
반드시 즉시 철회되어야 합니다. 전문가들은 이구동성으로 비판하고 있습니다.`,
        correctAnswers: JSON.stringify(['감정적 편향', '과장된 표현']),
        explanation: '이 글은 "충격적인", "분노하게", "말도 안 되는" 등 감정적 편향과 "모든 국민", "반드시", "이구동성" 등 과장된 표현을 사용하고 있습니다.',
        difficulty: 'beginner',
        points: 80,
        hints: JSON.stringify(['감정을 자극하는 단어들이 보이나요?', '정말 "모든" 국민이 피해를 볼까요?'])
      }
    }),
    prisma.challenge.create({
      data: {
        type: 'article-analysis',
        title: '고급 논리 오류 탐지',
        content: `A 후보를 지지하는 사람들은 모두 부정부패에 연루되어 있습니다. 
B 후보의 정책은 완벽하지는 않지만, A 후보보다는 훨씬 낫습니다.
만약 A 후보가 당선된다면 우리나라는 망할 것입니다. 
따라서 상식이 있는 국민이라면 당연히 B 후보를 선택할 것입니다.`,
        correctAnswers: JSON.stringify(['인신공격', '허수아비 공격', '흑백논리']),
        explanation: '인신공격(A 후보 지지자들을 부정부패와 연결), 허수아비 공격(상대방 주장을 왜곡), 흑백논리(A 아니면 B만 있는 것으로 단순화) 등의 오류가 포함되어 있습니다.',
        difficulty: 'advanced',
        points: 150,
        hints: JSON.stringify(['지지자들을 일반화하고 있지 않나요?', '선택지가 두 개뿐일까요?', '상대방을 공격하고 있나요?'])
      }
    }),
    prisma.challenge.create({
      data: {
        type: 'ad-detection',
        title: '숨겨진 광고를 찾아보세요',
        content: `요즘 피부가 너무 거칠어서 고민이었는데, 친구가 추천해준 OO크림을 써봤어요! 
정말 하루 만에 피부가 달라졌어요. 여러분도 꼭 써보세요! 
지금 할인 이벤트도 하고 있더라고요. 링크 남겨둘게요~ 
#광고아님 #진짜후기 #피부개선`,
        correctAnswers: JSON.stringify(['제품 홍보', '구매 유도', '해시태그 조작']),
        explanation: '이는 전형적인 인플루언서 마케팅으로, 자연스러운 후기를 가장했지만 제품 홍보, 할인 정보 제공, 링크 첨부 등 명백한 광고 요소가 포함되어 있습니다.',
        difficulty: 'intermediate',
        points: 120,
        hints: JSON.stringify(['정말 하루 만에 효과가 나타날까요?', '왜 할인 정보를 언급할까요?', '#광고아님 태그가 의심스럽지 않나요?'])
      }
    }),
    prisma.challenge.create({
      data: {
        type: 'data-visualization',
        title: '조작된 그래프 찾기',
        content: `"청소년 게임 중독 급증!" 
작년 대비 올해 게임 시간이 20%에서 25%로 증가했다는 그래프가 공개되었습니다. 
그래프를 보면 놀라울 정도로 급격한 증가를 보여주고 있어 심각한 사회 문제로 대두되고 있습니다.`,
        correctAnswers: JSON.stringify(['Y축 조작', '시각적 과장', '맥락 누락']),
        explanation: '5%p 증가(20%→25%)를 마치 5배 증가한 것처럼 보이게 하는 그래프 조작입니다. Y축을 15%~30%로 제한하여 작은 변화를 극적으로 보이게 했습니다.',
        difficulty: 'advanced',
        points: 180,
        hints: JSON.stringify(['실제 증가율은 얼마일까요?', '그래프의 Y축 범위를 확인해보세요', '전체적인 맥락이 빠져있지 않나요?'])
      }
    })
  ]);

  console.log(`✅ 챌린지 ${challenges.length}개 생성 완료`);

  // 3. 시스템 설정 생성
  console.log('⚙️ 시스템 설정 생성...');

  await Promise.all([
    prisma.systemConfig.create({
      data: {
        key: 'max_cache_size',
        value: '10000',
        type: 'number'
      }
    }),
    prisma.systemConfig.create({
      data: {
        key: 'cache_ttl_hours',
        value: '24',
        type: 'number'
      }
    }),
    prisma.systemConfig.create({
      data: {
        key: 'daily_challenge_count',
        value: '3',
        type: 'number'
      }
    }),
    prisma.systemConfig.create({
      data: {
        key: 'analysis_rate_limit',
        value: '100',
        type: 'number'
      }
    }),
    prisma.systemConfig.create({
      data: {
        key: 'trusted_domains',
        value: JSON.stringify([
          'bbc.com',
          'reuters.com', 
          'ap.org',
          'yonhapnews.co.kr',
          'jtbc.co.kr'
        ]),
        type: 'json'
      }
    })
  ]);

  console.log('✅ 시스템 설정 생성 완료');

  // 4. 테스트 사용자 생성 (개발 환경에서만)
  if (process.env.NODE_ENV === 'development') {
    console.log('👤 테스트 사용자 생성...');

    const testUser = await prisma.user.create({
      data: {
        username: 'testuser',
        displayName: '테스트 사용자',
        totalPoints: 280,
        level: 2,
        analyticsUsed: 15
      }
    });

    // 테스트 사용자에게 몇 개 배지 부여
    await Promise.all([
      prisma.userBadge.create({
        data: {
          userId: testUser.id,
          badgeId: badges[0].id // 첫 걸음
        }
      }),
      prisma.userBadge.create({
        data: {
          userId: testUser.id,
          badgeId: badges[1].id // 탐정
        }
      })
    ]);

    // 테스트 챌린지 결과 생성
    await Promise.all([
      prisma.challengeResult.create({
        data: {
          userId: testUser.id,
          challengeId: challenges[0].id,
          userAnswers: JSON.stringify(['성급한 일반화', '허위 이분법']),
          isCorrect: false,
          score: 50,
          timeSpent: 120,
          hintsUsed: 1
        }
      }),
      prisma.challengeResult.create({
        data: {
          userId: testUser.id,
          challengeId: challenges[1].id,
          userAnswers: JSON.stringify(['감정적 편향', '과장된 표현']),
          isCorrect: true,
          score: 80,
          timeSpent: 95,
          hintsUsed: 0
        }
      })
    ]);

    console.log(`✅ 테스트 사용자 생성 완료: ${testUser.id}`);
  }

  console.log('🎉 시드 데이터 생성 완료!');
}

main()
  .catch((e) => {
    console.error('❌ 시드 데이터 생성 실패:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { databaseService } from '../services/DatabaseService.js';
import { dailyChallengeService } from '../services/DailyChallengeService.js';

/**
 * 데이터베이스 마이그레이션 및 테스트 스크립트
 */
async function main() {
  console.log('🚀 Criti.AI 데이터베이스 마이그레이션 및 테스트 시작');
  
  try {
    // 1. 데이터베이스 연결 확인
    console.log('\n1️⃣ 데이터베이스 연결 확인...');
    await databaseService.connect();
    console.log('✅ 데이터베이스 연결 성공');
    
    // 2. 기존 데이터 정리 (개발환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log('\n2️⃣ 개발환경 데이터 정리...');
      await databaseService.client.challenge.deleteMany({
        where: {
          isGenerated: true
        }
      });
      console.log('✅ 기존 생성된 챌린지 정리 완료');
    }
    
    // 3. 오늘의 챌린지 생성 테스트
    console.log('\n3️⃣ 오늘의 챌린지 생성 테스트...');
    const todaysChallenges = await dailyChallengeService.getTodaysChallenges();
    console.log(`✅ 오늘의 챌린지 ${todaysChallenges.length}개 생성/조회 완료`);
    
    // 4. 생성된 챌린지 확인
    console.log('\n4️⃣ 생성된 챌린지 확인...');
    todaysChallenges.forEach((challenge, index) => {
      console.log(`   ${index + 1}. [${challenge.difficulty}] ${challenge.title}`);
      console.log(`      점수: ${challenge.points}점`);
      console.log(`      정답: ${challenge.correctAnswers.join(', ')}`);
    });
    
    // 5. 사용자 진행도 테스트
    console.log('\n5️⃣ 사용자 진행도 테스트...');
    const userProgress = await databaseService.getUserProgress('guest');
    if (userProgress) {
      console.log(`✅ 사용자 진행도: ${userProgress.totalPoints}점, 레벨 ${userProgress.level}`);
    } else {
      console.log('ℹ️ 새로운 게스트 사용자 생성 필요');
    }
    
    // 6. API 엔드포인트 테스트 (내부 호출)
    console.log('\n6️⃣ API 서비스 테스트...');
    const testChallengeId = todaysChallenges[0]?.id;
    if (testChallengeId) {
      const challenge = await databaseService.getChallenge(testChallengeId);
      console.log(`✅ 챌린지 개별 조회 성공: ${challenge?.title}`);
    }
    
    console.log('\n🎉 모든 테스트 완료! 시스템이 정상적으로 작동합니다.');
    console.log('\n📋 다음 단계:');
    console.log('   1. 백엔드 서버 시작: npm run dev:backend');
    console.log('   2. 프론트엔드 서버 시작: npm run dev:challenge');
    console.log('   3. http://localhost:3000 에서 테스트');
    
  } catch (error) {
    console.error('❌ 테스트 실패:', error);
    process.exit(1);
  } finally {
    await databaseService.disconnect();
  }
}

// 스크립트 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main };

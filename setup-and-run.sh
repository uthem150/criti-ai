# 크리티 AI 개발 환경 설정 및 실행

echo "🔍 크리티 AI 개발 환경 설정 중..."

# 1. 루트 패키지 설치
echo "📦 루트 패키지 설치 중..."
npm install

# 2. 모든 워크스페이스 패키지 설치
echo "📦 워크스페이스 패키지 설치 중..."
cd shared && npm install && echo "✅ Shared 패키지 설치 완료"
cd ../backend && npm install && echo "✅ Backend 패키지 설치 완료"
cd ../frontend && npm install && echo "✅ Frontend 패키지 설치 완료"
cd ..

echo ""
echo "✅ 모든 패키지 설치 완료!"
echo ""
echo "🚀 개발 서버를 시작합니다..."
echo ""

# 3. 개발 서버 실행 (concurrently 사용)
npm run dev

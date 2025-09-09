@echo off
echo 🚀 Criti.AI 시스템 자동 테스트 및 실행 스크립트
echo.

echo 📋 1단계: Prisma 스키마 업데이트
cd /d "D:\web\project\criti-ai\backend"
call npm run db:push
if %ERRORLEVEL% neq 0 (
    echo ❌ Prisma 스키마 푸시 실패
    pause
    exit /b 1
)

call npm run db:generate
if %ERRORLEVEL% neq 0 (
    echo ❌ Prisma 클라이언트 생성 실패
    pause
    exit /b 1
)

echo ✅ Prisma 스키마 업데이트 완료
echo.

echo 📋 2단계: 시스템 테스트 실행
call npm run test:system
if %ERRORLEVEL% neq 0 (
    echo ❌ 시스템 테스트 실패
    echo.
    echo 수동으로 백엔드 서버를 시작하세요:
    echo   cd D:\web\project\criti-ai\backend
    echo   npm run dev
    pause
    exit /b 1
)

echo ✅ 시스템 테스트 완료
echo.

echo 📋 3단계: 서버 시작 안내
echo.
echo 이제 다음 단계를 진행하세요:
echo.
echo 🖥️  터미널 1 - 백엔드 서버:
echo   cd D:\web\project\criti-ai\backend
echo   npm run dev
echo.
echo 🌐 터미널 2 - 프론트엔드 서버:
echo   cd D:\web\project\criti-ai\challenge-web  
echo   npm run dev
echo.
echo 🎯 테스트 URL:
echo   - 백엔드 헬스체크: http://localhost:3001/health
echo   - 챌린지 웹페이지: http://localhost:3000
echo.
echo 🎉 모든 준비가 완료되었습니다!
pause

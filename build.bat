@echo off
chcp 65001 >nul
title Criti AI 빌드 스크립트

echo 🔍 Criti AI 빌드 시작...
echo.

rem 1. Shared 패키지 빌드
echo 📦 1단계: Shared 패키지 빌드 중...
cd shared
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ❌ Shared 패키지 빌드 실패
    pause
    exit /b 1
)

rem 2. Frontend 빌드  
echo 🖥 2단계: Frontend 빌드 중...
cd ..\frontend
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ❌ Frontend 빌드 실패
    pause
    exit /b 1
)

rem 3. Backend 빌드
echo ⚙️ 3단계: Backend 빌드 중...
cd ..\backend
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ❌ Backend 빌드 실패
    pause
    exit /b 1
)

echo.
echo ✅ 모든 빌드 완료!
echo.
echo 🚀 실행 방법:
echo 1. 백엔드 실행: cd backend ^&^& npm start
echo 2. 개발 서버: cd frontend ^&^& npm run dev
echo 3. 크롬 확장: frontend\dist 폴더를 chrome://extensions/에서 로드
echo.
echo 📊 주요 URL:
echo - 백엔드 API: http://localhost:3001
echo - 프론트엔드: http://localhost:5173
echo - 챌린지 게임: http://localhost:5173/challenge.html
echo - 헬스체크: http://localhost:3001/health
echo.
pause

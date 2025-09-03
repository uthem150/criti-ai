@echo off
chcp 65001 >nul
title Criti AI 개발 환경 설정 및 실행

echo 🔍 Criti AI 개발 환경 설정 중...
echo.

rem 1. 루트 패키지 설치
echo 📦 루트 패키지 설치 중...
call npm install
if %ERRORLEVEL% neq 0 (
    echo ❌ 루트 패키지 설치 실패
    pause
    exit /b 1
)

rem 2. 모든 워크스페이스 패키지 설치  
echo 📦 워크스페이스 패키지 설치 중...
cd shared
call npm install
if %ERRORLEVEL% neq 0 (
    echo ❌ Shared 패키지 설치 실패
    pause
    exit /b 1
)
echo ✅ Shared 패키지 설치 완료

cd ..\backend
call npm install
if %ERRORLEVEL% neq 0 (
    echo ❌ Backend 패키지 설치 실패
    pause
    exit /b 1
)
echo ✅ Backend 패키지 설치 완료

cd ..\frontend
call npm install
if %ERRORLEVEL% neq 0 (
    echo ❌ Frontend 패키지 설치 실패
    pause
    exit /b 1
)
echo ✅ Frontend 패키지 설치 완료

cd ..
echo.
echo ✅ 모든 패키지 설치 완료!
echo.
echo 🚀 개발 서버를 시작합니다...
echo.

rem 3. 개발 서버 실행
call npm run dev

pause

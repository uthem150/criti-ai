#!/bin/bash
echo "🏠 로컬 개발 + Ngrok 터널링 가이드"

echo "1. Ngrok 설치"
echo "   - https://ngrok.com 가입"
echo "   - Windows: ngrok.exe 다운로드"
echo "   - 압축 해제 후 PATH 추가"

echo ""
echo "2. 로컬 서버 실행"
echo "   cd D:/web/project/criti-ai"
echo "   npm run dev"

echo ""  
echo "3. 새 터미널에서 Ngrok 실행"
echo "   ngrok http 3001"

echo ""
echo "4. 결과:"
echo "   로컬: http://localhost:3001"
echo "   외부: https://abc123.ngrok.io"

echo ""
echo "5. Vercel 환경변수 설정"
echo "   VITE_BACKEND_URL=https://abc123.ngrok.io"

echo ""
echo "✅ 완료! 이제 전세계에서 접속 가능"

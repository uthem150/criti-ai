# Criti AI (Criti.AI) - 개발 및 실행 가이드

## 🚀 프로젝트 개요

"Criti AI"는 AI 기반 뉴스 신뢰도 분석 크롬 확장 프로그램과 비판적 사고 훈련 웹 서비스입니다.

### 주요 기능

- **실시간 뉴스 분석**: 브라우저 사이드바에서 신뢰도, 편향성, 논리적 오류 분석
- **Criti 챌린지**: 인터랙티브 비판적 사고 훈련 게임
- **AI 기반 분석**: Google Gemini API를 활용한 정교한 텍스트 분석

## 📁 프로젝트 구조

```
criti-ai/
├── frontend/          # 크롬 확장 프로그램 + 웹 페이지
├── backend/           # Express.js API 서버
├── shared/            # 공통 타입 정의
└── README.md          # 이 파일
```

## 🛠 개발 환경 설정

### 1. 필수 요구사항

- Node.js 18+
- npm 또는 yarn
- Google Gemini API Key
- Chrome 브라우저

### 2. 설치 및 실행

#### 📦 패키지 설치

```bash
# 모든 패키지 한번에 설치
cd backend && npm install
cd ../frontend && npm install
cd ../shared && npm install
```

#### 🔑 환경 변수 설정

```bash
# backend/.env 파일 생성 (이미 설정됨)
GEMINI_API_KEY=your_api_key_here
PORT=3001
NODE_ENV=development
```

#### 🖥 서버 실행

```bash
# 백엔드 서버 시작 (터미널 1)
cd backend
npm run dev

# 프론트엔드 개발 서버 시작 (터미널 2)
cd frontend
npm run dev
```

#### ⚙️ 크롬 확장 프로그램 빌드 및 설치

```bash
cd frontend
npm run build

# 크롬에서 다음 경로로 확장 프로그램 로드:
# chrome://extensions/ -> "개발자 모드" 활성화 -> "압축해제된 확장 프로그램을 로드합니다" -> frontend/dist 폴더 선택
```

## 🎮 사용법

### 1. 크롬 확장 프로그램 사용

1. 뉴스 사이트 방문 (예: https://news.naver.com)
2. 우측 사이드바의 "이 기사 분석하기" 버튼 클릭
3. AI 분석 결과 확인 (신뢰도, 편향성, 논리적 오류)
4. 하이라이트된 텍스트에 마우스 올려 상세 설명 확인

### 2. Criti 챌린지 웹 게임

1. 확장 프로그램 팝업에서 "챌린지 게임" 클릭
2. 또는 직접 http://localhost:5173/challenge.html 방문
3. 논리적 오류 찾기, 편향 표현 탐지 게임 플레이
4. 점수 획득 및 배지 컬렉션

## 🏗 아키텍처

### Frontend (TypeScript + React + Emotion)

- **크롬 확장 프로그램**: Content Script, Background Script, Popup
- **웹 페이지**: 챌린지 게임 (독립적인 SPA)
- **디자인 시스템**: 일관된 UI/UX를 위한 컬러, 타이포그래피 정의

### Backend (Express.js + TypeScript)

- **분석 API**: `/api/analysis/*` - Gemini API를 활용한 텍스트 분석
- **챌린지 API**: `/api/challenge/*` - 게임 데이터 및 채점
- **캐싱**: 중복 분석 요청 최적화

### Shared (TypeScript)

- **타입 정의**: Frontend-Backend 간 타입 공유
- **API 인터페이스**: 일관된 데이터 구조

## 🔧 개발 도구

### 빌드 및 개발

- **Vite**: 빠른 개발 서버 및 빌드
- **@crxjs/vite-plugin**: 크롬 확장 프로그램 빌드 자동화
- **TypeScript**: 타입 안전성
- **ESLint + Prettier**: 코드 품질 관리

### 스타일링

- **Emotion**: CSS-in-JS 스타일링
- **Design System**: 재사용 가능한 컴포넌트 시스템

## 📊 API 엔드포인트

### 분석 API

- `POST /api/analysis/analyze` - 뉴스 기사 전체 분석
- `POST /api/analysis/quick-check` - 빠른 신뢰도 체크
- `GET /health` - 서버 상태 확인

### 챌린지 API

- `GET /api/challenge/challenges` - 챌린지 목록
- `GET /api/challenge/challenges/:id` - 특정 챌린지
- `POST /api/challenge/challenges/:id/submit` - 답안 제출
- `GET /api/challenge/progress/:userId` - 사용자 진행도

## 🧪 테스트

### 개발 테스트

1. 백엔드 서버 실행 확인: http://localhost:3001/health
2. 프론트엔드 개발 서버: http://localhost:5173
3. 챌린지 페이지: http://localhost:5173/challenge.html

### 크롬 확장 프로그램 테스트

1. `npm run build` 실행
2. Chrome 확장 프로그램으로 `dist` 폴더 로드
3. 뉴스 사이트에서 사이드바 동작 확인

## 🚀 배포

### 프로덕션 빌드

```bash
cd frontend && npm run build
cd ../backend && npm run build
```

### 크롬 웹 스토어 업로드

1. `frontend/dist` 폴더를 zip으로 압축
2. Chrome Web Store Developer Dashboard에서 업로드

## 🛠 향후 개선사항

1. **데이터베이스 연동**: 현재 더미 데이터 → PostgreSQL/MongoDB
2. **사용자 인증**: 로그인 시스템 및 개인화
3. **AI 모델 확장**: 다양한 AI API 지원 (OpenAI, Claude 등)
4. **다국어 지원**: 영어, 일본어 등 추가
5. **모바일 앱**: React Native로 모바일 버전

## 🤝 기여하기

1. 이슈 생성 및 토론
2. Fork & Pull Request
3. 코드 리뷰 및 피드백

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

---

**개발자**: Criti AI 팀  
**연락처**: [이메일 주소]  
**버전**: 1.0.0

🎯 **목표**: AI 시대의 정보 과잉 속, 사용자의 비판적 사고 능력을 기르는 혁신적인 도구

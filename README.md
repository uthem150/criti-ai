# 🔍 Criti AI - 스마트 콘텐츠 분석기

AI 기반 뉴스, 블로그, 커뮤니티 콘텐츠의 신뢰도를 분석하고 비판적 사고 능력을 향상시키는 크롬 확장 프로그램입니다.

## ✨ 주요 기능

### 🎯 종합 분석
- **신뢰도 점수**: 출처, 객관성, 논리성, 광고성, 근거 충실도를 종합한 0-100점 점수
- **막대 차트 기반 시각화**: 각 분석 항목별 상세 점수 표시

### 🚫 광고성 콘텐츠 탐지
- **네이티브 광고 식별**: 홍보성 목적으로 작성된 콘텐츠 탐지
- **상업적 의도 분석**: 제품 언급, 행동 유도, 브랜드 중심 등 지표 분석
- **광고성 지표 상세 표시**: 각 지표의 가중치와 근거 제공

### 🎭 편향성 분석
- **감정적 편향 탐지**: '충격적인', '반드시' 등 조작적 표현 식별
- **정치적 편향 분석**: 진보/보수/중도 성향 및 확신도 표시
- **클릭베이트 요소**: 호기심 갭, 감정 트리거, 긴급성 등 분석

### 🧠 논리적 오류 식별
- **성급한 일반화**: 제한된 사례로 전체 판단하는 오류
- **감정 호소**: 논리 대신 감정에 의존하는 오류
- **권위 호소**: 부적절한 권위자 인용 오류
- **초등학생도 이해할 수 있는 설명** 제공

### 🏛️ 출처 신뢰도 검증
- **도메인 평판 분석**: 주요 언론사, 블로그, 개인 사이트 구분
- **과거 신뢰도**: 해당 출처의 역사적 신뢰도 점수
- **전문 분야**: 해당 출처가 전문성을 갖는 분야 표시

### 🔍 교차 검증
- **핵심 주장 추출**: 팩트체크가 필요한 주요 주장들
- **추천 검색 키워드**: 추가 검증을 위한 검색어 제안
- **팩트체크 소스**: 관련 팩트체크 기관의 검증 결과

## 🌐 지원 사이트

### ✅ 완전 지원
- **주요 언론사**: 중앙일보, 조선일보, 한겨레, 네이버 뉴스 등
- **블로그 플랫폼**: 네이버 블로그, 티스토리, 브런치 등
- **커뮤니티**: 네이버 카페, 다음 카페 등
- **기타**: 모든 웹 콘텐츠 (30자 이상의 텍스트)

### 🚫 제한 사항
- Chrome 확장 프로그램 페이지
- 로컬 파일 (file://)
- 브라우저 설정 페이지

## 🚀 빠른 시작

### 1. 프로젝트 설치
```bash
# 저장소 클론
git clone <repository-url>
cd criti-ai

# 모든 의존성 설치
npm run install:all

# 공유 타입 빌드
cd shared && npm run build && cd ..
```

### 2. 백엔드 서버 시작
```bash
# .env 파일 설정 (backend 폴더)
echo "GEMINI_API_KEY=your_gemini_api_key_here" > backend/.env

# 개발 서버 시작
npm run dev:backend
# 또는 별도 터미널에서
cd backend && npm run dev
```

### 3. 프론트엔드 빌드
```bash
# 크롬 확장 프로그램 빌드
npm run build:frontend
# 또는
cd frontend && npm run build
```

### 4. 크롬 확장 프로그램 설치
1. Chrome 브라우저에서 `chrome://extensions/` 접속
2. "개발자 모드" 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. `frontend/dist` 폴더 선택

## 💻 개발 환경 설정

### 필수 요구사항
- Node.js 18+ 
- npm 또는 yarn
- Chrome 브라우저
- Google Gemini API 키

### 환경 변수 설정
```bash
# backend/.env
GEMINI_API_KEY=your_actual_gemini_api_key
NODE_ENV=development
PORT=3001
```

### 개발 모드 실행
```bash
# 전체 개발 환경 (백엔드 + 프론트엔드)
npm run dev

# 또는 개별 실행
npm run dev:backend  # 백엔드만
npm run dev:frontend # 프론트엔드만
```

## 🔧 사용법

### 기본 사용법
1. **사이트 방문**: 뉴스, 블로그, 커뮤니티 등 분석하고 싶은 페이지로 이동
2. **확장 프로그램 클릭**: 브라우저 우상단의 Criti AI 아이콘 클릭
3. **분석 시작**: "지금 분석 시작하기" 버튼 클릭
4. **결과 확인**: 우측에 나타나는 사이드바에서 상세 분석 결과 확인

### 고급 기능
- **하이라이트 클릭**: 본문에서 색상으로 표시된 편향/오류 부분 클릭 시 해당 위치로 스크롤 이동
- **세부 점수**: 막대 차트에서 각 분석 항목별 점수 확인
- **광고성 분석**: "자세히" 버튼으로 광고성 지표 상세 내용 확인
- **교차 검증**: 추천 키워드로 추가 정보 검색

## 🏗️ 프로젝트 구조

```
criti-ai/
├── frontend/           # 크롬 확장 프로그램 (React + TypeScript + Vite)
│   ├── src/extension/  # 확장 프로그램 관련 코드
│   │   ├── background/ # Background Script
│   │   ├── content/    # Content Script (Shadow DOM)
│   │   └── popup/      # 팝업 UI
│   └── src/components/ # React 컴포넌트
│       └── analysis/   # 분석 결과 표시 컴포넌트
├── backend/            # API 서버 (Express + TypeScript)
│   └── src/services/   # Gemini API 서비스
└── shared/             # 공유 타입 정의
```

## 🎯 핵심 기술

- **Frontend**: React, TypeScript, Emotion, Vite
- **Backend**: Express, TypeScript, Google Gemini API
- **Chrome Extension**: Manifest V3, Shadow DOM, Content Scripts
- **AI**: Google Gemini 1.5 Flash 모델

## 🔍 분석 알고리즘

### 신뢰도 점수 계산
```
전체 점수 = (출처 신뢰도 × 0.25) + (객관성 × 0.2) + (논리성 × 0.25) + (비광고성 × 0.2) + (근거 충실도 × 0.1)
```

### 분석 단계
1. **콘텐츠 타입 감지**: 뉴스/블로그/커뮤니티/상업적 콘텐츠 구분
2. **도메인 평판 조회**: 출처의 과거 신뢰도 및 전문 분야 확인
3. **AI 종합 분석**: Gemini API로 편향성, 논리성, 광고성 등 분석
4. **결과 시각화**: 막대 차트 및 하이라이트로 사용자 친화적 표시

## 🛠️ 문제 해결

### 자주 발생하는 문제

#### "페이지를 새로고침 후 다시 시도해주세요"
- **원인**: Content Script가 아직 로드되지 않음
- **해결**: 페이지 새로고침(F5) 후 재시도

#### "백엔드 서버 연결 실패"
- **원인**: API 서버가 실행되지 않았거나 Gemini API 키 누락
- **해결**: 
  1. `npm run dev:backend`로 서버 시작
  2. `backend/.env`에 GEMINI_API_KEY 설정 확인

#### 사이드바가 열리지 않음
- **원인**: Shadow DOM 생성 실패 또는 사이트 제한
- **해결**: 
  1. 다른 뉴스/블로그 사이트에서 시도
  2. 확장 프로그램 재설치

#### 분석 결과가 나오지 않음
- **원인**: 콘텐츠가 너무 짧거나 분석 불가능한 형태
- **해결**: 더 긴 텍스트가 있는 기사/글에서 시도

## 🎮 추가 기능

### 크리티 챌린지 (개발 예정)
- **훈련용 기사**: AI가 생성한 편향적/오류가 있는 가상 기사
- **게임화**: 점수, 배지, 레벨 시스템
- **실력 향상**: 단계별 난이도로 비판적 사고 능력 향상

## 📊 성능 최적화

- **캐싱**: 동일 URL 분석 결과 캐싱으로 API 비용 절약
- **Shadow DOM**: 외부 사이트 CSS와 완전 격리
- **지능적 콘텐츠 추출**: 텍스트 밀도 기반 주요 내용 식별
- **점진적 로딩**: 기본 분석 → 상세 분석 순차 표시

## 📈 향후 계획

- [ ] 동영상 콘텐츠 분석 (YouTube, TV 뉴스)
- [ ] 다국어 지원 (영어, 중국어, 일본어)
- [ ] 팩트체크 데이터베이스 연동
- [ ] 사용자 커뮤니티 기능
- [ ] 브라우저 확장 (Firefox, Safari)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 라이센스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일 참조

## 📞 연락처

프로젝트 링크: [https://github.com/your-username/criti-ai](https://github.com/your-username/criti-ai)

---

**🔍 Criti AI와 함께 더 똑똑한 정보 소비를 시작하세요!**

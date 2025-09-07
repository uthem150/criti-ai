# 🎯 Criti.AI - AI 기반 뉴스 신뢰도 분석 플랫폼

AI 시대의 정보 과잉 속에서 사용자의 비판적 사고 능력을 키우는 혁신적인 크롬 확장 프로그램

## 📋 프로젝트 개요

**Criti.AI**는 가짜 뉴스와 딥페이크가 넘쳐나는 시대에 사용자가 스스로 정보를 판별할 수 있는 능력을 기르도록 돕는 AI 기반 교육 도구입니다.

### 🎯 주요 기능

1. **실시간 분석 모듈 (Insight Guardian)**
   - 뉴스 기사의 신뢰도 다차원 분석
   - 출처, 편향성, 논리성, 광고성 검증
   - 실시간 하이라이팅 및 상세 설명

2. **능동적 훈련 모듈 (Criti Challenge)**
   - 논리적 오류 찾기 챌린지
   - 편향 표현 탐지 훈련
   - 딥페이크/AI 이미지 구별 연습

### 🏗️ 기술 스택

**Frontend:**
- TypeScript + Vite
- React 19
- Emotion (styled-components)
- Chrome Extension APIs

**Backend:**
- Node.js + Express + TypeScript
- Prisma ORM + SQLite
- Redis (캐싱)
- Gemini AI API

**Infrastructure:**
- 3단계 캐싱 시스템 (Redis → DB → Memory)
- 모노레포 구조

## 🚀 빠른 시작

### 1단계: 저장소 클론 및 설정

```bash
git clone <repository-url>
cd criti-ai
```

### 2단계: 환경 설정

**백엔드 환경 설정:**
```bash
cd backend
cp .env.example .env
# .env 파일에서 GEMINI_API_KEY 설정
```

**프론트엔드 환경 설정:**
```bash
cd ../frontend
# .env 파일은 이미 설정되어 있음
```

### 3단계: 의존성 설치

```bash
# 프로젝트 루트에서
npm run install:all
```

### 4단계: 데이터베이스 설정

```bash
cd backend
npm run db:generate  # Prisma 클라이언트 생성
npm run db:push      # 데이터베이스 스키마 생성
npm run db:seed      # 초기 데이터 삽입
```

### 5단계: 개발 서버 실행

```bash
# 프로젝트 루트에서
npm run dev
```

이제 다음 주소에서 서비스를 확인할 수 있습니다:
- 백엔드: http://localhost:3001
- 프론트엔드: http://localhost:5173
- Health Check: http://localhost:3001/health

## 📁 프로젝트 구조

```
criti-ai/
├── backend/           # Express.js 백엔드
│   ├── src/
│   │   ├── services/  # 비즈니스 로직
│   │   ├── routes/    # API 라우트
│   │   └── scripts/   # 유틸리티 스크립트
│   ├── prisma/        # 데이터베이스 스키마
│   └── .env           # 환경 변수
├── frontend/          # React + Vite 프론트엔드
│   ├── src/
│   │   ├── components/  # 공통 컴포넌트
│   │   ├── extension/   # 크롬 확장 프로그램
│   │   ├── pages/       # 페이지 컴포넌트
│   │   ├── services/    # API 서비스
│   │   └── styles/      # 디자인 시스템
│   └── public/        # 정적 파일
├── shared/            # 공통 타입 정의
└── package.json       # 모노레포 설정
```

## 🛠️ 개발 스크립트

```bash
# 전체 프로젝트 개발 모드
npm run dev

# 개별 실행
npm run dev:backend    # 백엔드만
npm run dev:frontend   # 프론트엔드만

# 빌드
npm run build         # 전체 빌드
npm run build:frontend # 크롬 확장 프로그램 빌드

# 데이터베이스
npm run db:generate   # Prisma 클라이언트 생성
npm run db:push      # 스키마 푸시
npm run db:seed      # 시드 데이터 삽입
npm run db:studio    # Prisma Studio 실행

# 린트 및 포맷팅
npm run lint         # 전체 린트 검사
npm run clean        # 빌드 파일 정리
```

## 🔧 주요 서비스

### GeminiService
- Gemini AI API를 활용한 뉴스 분석
- 신뢰도, 편향성, 논리적 오류 탐지
- 챌린지 자동 생성

### RedisCacheService
- Redis 기반 고성능 캐싱
- 분석 결과 캐싱으로 API 호출 최적화
- 캐시 통계 및 모니터링

### DatabaseService
- Prisma ORM 기반 데이터 관리
- 사용자 진행도, 챌린지 결과 저장
- 배지 시스템 및 통계 생성

## 📊 캐싱 전략

3단계 캐싱 시스템으로 최적의 성능과 안정성 확보:

1. **Redis** (1순위): 고속 인메모리 캐시
2. **Database** (2순위): 영구 저장 + 백업
3. **Memory** (3순위): 최후의 보루

## 🎮 챌린지 시스템

### 난이도별 분류
- **Beginner**: 기본적인 편향 표현 찾기
- **Intermediate**: 광고성 콘텐츠 탐지
- **Advanced**: 복합적인 논리 오류 분석

### 배지 시스템
- 🎯 첫 걸음: 첫 번째 분석 완료
- 🔍 탐정: 편향 표현 다수 발견
- 🧠 논리 마스터: 논리적 오류 전문가
- 🏆 챌린지 완주자: 다수 챌린지 완료

## 🔒 보안 및 성능

- **API 키 보안**: 백엔드에서만 AI API 키 관리
- **CORS 정책**: 화이트리스트 기반 접근 제어
- **Rate Limiting**: API 남용 방지
- **캐시 최적화**: 중복 분석 요청 최소화

## 🌟 향후 계획

### 2단계: 프론트엔드 완성
- [ ] 디자인 시스템 구축
- [ ] 크롬 확장 프로그램 UI 완성
- [ ] 실시간 하이라이팅 기능

### 3단계: 고급 기능
- [ ] 다국어 지원
- [ ] 모바일 앱 버전
- [ ] 소셜 기능 (커뮤니티)

### 4단계: 프로덕션 배포
- [ ] 서버 인프라 구축
- [ ] 크롬 웹 스토어 배포
- [ ] 모니터링 시스템 구축

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

---

**🎯 "AI가 만든 가짜 정보, AI와 함께 이겨내다" - Criti.AI**

# 🎮 Criti.AI Challenge Web

AI와 함께하는 비판적 사고 훈련 플랫폼의 웹 애플리케이션입니다.

## 📋 프로젝트 개요

**Criti.AI Challenge**는 사용자가 가짜 뉴스를 판별하고 논리적 오류를 찾는 능력을 기를 수 있도록 도와주는 교육용 웹 애플리케이션입니다.

### 🎯 주요 기능

- **논리적 오류 찾기 챌린지**: 다양한 텍스트에서 논리적 오류 탐지 훈련
- **편향 표현 분석**: 감정적 편향과 과장된 표현 식별 연습
- **광고성 콘텐츠 판별**: 네이티브 광고와 상업적 의도 탐지 훈련
- **실시간 피드백**: 즉시 결과 확인 및 상세한 설명 제공
- **진행도 추적**: 점수, 레벨, 배지 시스템으로 학습 동기 부여

## 🚀 빠른 시작

### 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (포트 3000)
npm run dev

# 타입 체크
npm run type-check

# 린트 검사
npm run lint
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 🏗️ 기술 스택

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Emotion (styled-components)
- **Deployment**: Vercel
- **Shared Types**: @criti-ai/shared 패키지

## 📁 프로젝트 구조

```
challenge-web/
├── src/
│   ├── pages/
│   │   ├── ChallengePage.tsx        # 메인 챌린지 페이지
│   │   └── ChallengePage.style.ts   # 페이지 스타일링
│   ├── styles/
│   │   └── design-system.ts         # 디자인 시스템
│   └── main.tsx                     # 앱 진입점
├── public/                          # 정적 파일들
├── dist/                           # 빌드 결과물
├── package.json
├── vite.config.ts
├── tsconfig.json
├── vercel.json                     # Vercel 배포 설정
└── README.md
```

## 🎮 챌린지 시스템

### 난이도별 분류

- **Beginner**: 기본적인 논리적 오류와 편향 표현 찾기
- **Intermediate**: 광고성 콘텐츠와 복합적인 오류 분석  
- **Advanced**: 고급 논리적 추론과 미묘한 편향 탐지

### 평가 요소

- **논리적 오류**: 성급한 일반화, 허위 이분법, 인신공격 등
- **편향 표현**: 감정적 편향, 과장된 표현, 선동적 언어
- **광고성 요소**: 긴급성 유도, 과장된 수치, 상업적 의도

### 점수 시스템

- **기본 점수**: 챌린지 완료 시 획득
- **보너스 점수**: 빠른 완료 시 추가 획득
- **레벨 시스템**: 누적 점수에 따른 레벨 상승
- **배지 시스템**: 특정 조건 달성 시 배지 획득

## 🌐 배포

### Vercel 자동 배포

```bash
# Vercel CLI 설치 (글로벌)
npm install -g vercel

# 프로젝트 연결 및 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 환경별 URL

- **개발**: `http://localhost:3000`
- **스테이징**: `https://criti-ai-challenge-git-main.vercel.app`
- **프로덕션**: `https://criti-ai-challenge.vercel.app`

## 🔗 관련 프로젝트

- **Frontend (Chrome Extension)**: `../frontend/`
- **Backend (API Server)**: `../backend/`
- **Shared Types**: `../shared/`

## 📊 성능 최적화

- **코드 분할**: Vendor와 UI 라이브러리 별도 번들링
- **트리 셰이킹**: 사용하지 않는 코드 제거
- **압축**: Gzip 압축 및 에셋 최적화
- **캐싱**: 정적 파일 장기 캐싱 설정

## 🤝 기여하기

1. 이슈 확인 또는 새로운 이슈 생성
2. 피처 브랜치 생성: `git checkout -b feature/amazing-feature`
3. 변경사항 커밋: `git commit -m 'Add amazing feature'`
4. 브랜치 푸시: `git push origin feature/amazing-feature`
5. Pull Request 생성

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](../LICENSE) 파일을 참조하세요.

---

**🎯 "AI와 함께 배우는 비판적 사고" - Criti.AI Challenge**

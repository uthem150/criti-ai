# 🎯 Criti AI - 통합 하이라이트 시스템 개발 가이드

## 📋 목차
- [🚀 최근 업데이트](#-최근-업데이트)
- [🏛️ Oracle Micro 서버 배포 가이드](#️-oracle-micro-서버-배포-가이드)
- [📋 시스템 아키텍처](#-시스템-아키텍처)
- [🛠️ 개발 환경 설정](#️-개발-환경-설정)
- [🧪 테스트 방법](#-테스트-방법)

## 🏛️ Oracle Micro 서버 배포 가이드

> ⚠️ **중요**: 이 가이드는 실제 배포 과정에서 발생한 모든 문제점과 해결책을 포함합니다.

### 📊 Oracle Micro 서버 사양
- **CPU**: 1 vCPU (x86-64)
- **RAM**: 1 GB (실제 956MB 사용 가능)
- **Storage**: 47 GB SSD
- **Network**: 480 Mbps, 10TB/월
- **비용**: 완전 무료 (Oracle Always Free)

### 🚨 배포 과정에서 발생하는 주요 문제들

#### 1. Ubuntu Minimal 환경에서 누락된 패키지들

**문제**: Ubuntu Minimal에는 기본 명령어들이 설치되어 있지 않음

```bash
# 오류 메시지들
bash: git: command not found
bash: ping: command not found
sudo: ufw: command not found
```

**해결책**: 필수 패키지 설치
```bash
# Git 설치
sudo apt update
sudo apt install git -y

# Ping 명령어 설치
sudo apt install iputils-ping -y

# UFW 방화벽 설치
sudo apt install ufw -y
```

#### 2. Docker 권한 문제

**문제**: Docker 데몬 소켓 접근 권한 없음
```
permission denied while trying to connect to the Docker daemon socket
```

**해결책**: Docker 그룹 추가 및 세션 갱신
```bash
# 사용자를 docker 그룹에 추가
sudo usermod -aG docker ubuntu

# 현재 세션에 그룹 권한 적용
newgrp docker

# 또는 SSH 재접속
exit
ssh -i "키파일.pem" ubuntu@서버IP
```

#### 3. npm ci vs npm install 문제

**문제**: `package-lock.json` 없어서 `npm ci` 실패
```
npm error The `npm ci` command can only install with an existing package-lock.json
```

**해결책**: Dockerfile에서 `npm ci`를 `npm install`로 변경
```dockerfile
# 기존 (문제)
RUN cd shared && npm ci --production --no-audit --no-fund

# 수정 (해결)
RUN cd shared && npm install --no-audit --no-fund
```

#### 4. TypeScript 컴파일러 없음 문제

**문제**: `--production` 플래그로 인한 devDependencies 미설치
```
sh: tsc: not found
```

**해결책**: 빌드 단계에서 `--production` 플래그 제거
```dockerfile
# 기존 (문제)
RUN cd shared && npm install --production --no-audit --no-fund

# 수정 (해결)
RUN cd shared && npm install --no-audit --no-fund
```

#### 5. ES 모듈 import 경로 문제

**문제**: ES 모듈에서 `.js` 확장자 누락
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/app/dist/routes/analysis'
```

**해결책**: import 경로에 `.js` 확장자 추가
```typescript
// 기존 (문제)
import analysisRoutes from "./routes/analysis";
import { GeminiService } from './services/GeminiService';

// 수정 (해결)
import analysisRoutes from "./routes/analysis.js";
import { GeminiService } from './services/GeminiService.js';
```

#### 6. 환경변수 구조 혼란

**문제**: 루트 `.env`와 `backend/.env` 중복으로 인한 설정 혼란

**해결책**: `docker-compose.micro.yml`에서 `backend/.env` 직접 사용
```yaml
# 수정된 docker-compose.micro.yml
services:
  backend:
    env_file:
      - backend/.env  # 직접 참조
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:/app/data/criti-ai.db
      - REDIS_URL=redis://redis:6379
      # GEMINI_API_KEY는 backend/.env에서 자동 로드
```

### ✅ 완전 자동화 배포 스크립트

모든 문제를 해결한 완전 자동화 스크립트가 준비되어 있습니다:

```bash
# 1. 프로젝트 클론
git clone https://github.com/your-username/criti-ai.git
cd criti-ai

# 2. 완전 자동화 배포 실행
./deploy-micro-auto.sh

# 3. API 키만 입력하면 완료!
```

### 🔍 배포 후 상태 확인

```bash
# 서비스 상태 확인
docker-compose -f docker-compose.micro.yml ps

# API 테스트
curl http://localhost:3001/health
curl http://서버IP:3001/health

# 시스템 리소스 모니터링
./monitor-micro.sh --status

# 로그 확인
docker-compose -f docker-compose.micro.yml logs -f
```

### 📊 성능 최적화 설정

#### 메모리 최적화
```dockerfile
# Node.js 힙 메모리 제한
CMD ["node", "--max-old-space-size=128", "dist/app.js"]
```

#### Docker 리소스 제한
```yaml
# docker-compose.micro.yml
services:
  backend:
    mem_limit: 200m
    mem_reservation: 150m
    cpus: 0.7
  redis:
    mem_limit: 80m
    mem_reservation: 50m
    cpus: 0.2
```

#### 시스템 최적화
```bash
# 2GB Swap 파일 생성
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 메모리 최적화 설정
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
echo 'vm.vfs_cache_pressure=50' | sudo tee -a /etc/sysctl.conf
```

### 🔄 일상 운영 관리

```bash
# 상태 모니터링
./monitor-micro.sh --status

# 서비스 재시작
./monitor-micro.sh --restart

# 코드 업데이트 배포
git pull origin main
docker-compose -f docker-compose.micro.yml up -d --build

# 리소스 정리
docker system prune -f
```

### 🚨 문제 해결 체크리스트

#### 배포 실패 시
- [ ] Git 설치 확인: `git --version`
- [ ] Docker 권한 확인: `docker ps`
- [ ] 메모리 여유 확인: `free -h`
- [ ] 디스크 공간 확인: `df -h`
- [ ] 환경변수 설정 확인: `cat backend/.env`

#### 서비스 오류 시
- [ ] 컨테이너 상태: `docker-compose -f docker-compose.micro.yml ps`
- [ ] 백엔드 로그: `docker-compose -f docker-compose.micro.yml logs backend`
- [ ] 포트 충돌: `sudo netstat -tlnp | grep 3001`
- [ ] API 응답: `curl http://localhost:3001/health`

#### 성능 문제 시
- [ ] 메모리 사용률: `free -h`
- [ ] Docker 리소스: `docker stats --no-stream`
- [ ] 시스템 로드: `uptime`
- [ ] 로그 크기: `du -sh /var/log/`

### 💰 비용 최적화

**Oracle Always Free 한도 내에서 운영**
- ✅ Compute: VM.Standard.E2.1.Micro (사용 중)
- ✅ Block Volume: 47GB (사용 중)
- ✅ Object Storage: 20GB (미사용)
- ✅ Outbound Transfer: 10TB/월
- 💚 **월 운영비: 0원!**

### ✨ 주요 개선사항

1. **완전히 개선된 하이라이트 시스템**
   - 모든 분석 결과를 통합한 하이라이트 표시
   - 형광펜 효과의 시각적 하이라이트
   - 사이드바-본문 양방향 상호작용

2. **향상된 사용자 경험**
   - 사이드바에서 항목 클릭 → 본문 하이라이트로 스크롤 이동
   - 본문 하이라이트 클릭 → 사이드바 해당 섹션으로 이동
   - 직관적인 색상 구분 및 hover 효과

3. **개선된 AI 분석**
   - 모든 분석 결과에서 하이라이트할 텍스트 추출
   - 편향성, 논리적 오류, 광고성, 핵심 주장 통합 분석
   - 더 정확하고 상세한 분석 결과

## 📋 시스템 아키텍처

### 하이라이트 시스템 구조

```
📦 하이라이트 시스템
 ├── 🔍 데이터 수집 (collectAllHighlights)
 │   ├── biasAnalysis.highlightedTexts
 │   ├── logicalFallacies[].affectedText  
 │   ├── advertisementAnalysis.indicators[].evidence
 │   └── crossReference.keyClaims
 │
 ├── 🎨 시각적 표시 (TextHighlighter)
 │   ├── 타입별 형광펜 색상
 │   ├── hover 효과 및 툴팁
 │   └── 클릭 가능한 인터랙션
 │
 └── 🔗 상호작용 (Sidebar ↔ Content)
     ├── 사이드바 클릭 → 본문 스크롤
     ├── 하이라이트 클릭 → 사이드바 이동
     └── 섹션별 자동 확장
```

### 색상 체계

| 분석 타입 | 색상 | 설명 |
|----------|------|------|
| 🎭 편향성 (bias) | 주황색 | 편향적 표현, 클릭베이트 |
| 🧠 논리적 오류 (fallacy) | 빨간색 | 논리적 오류가 포함된 문장 |
| 💥 감정 조작 (manipulation) | 보라색 | 감정을 자극하는 조작적 표현 |
| 🎯 광고성 (advertisement) | 청록색 | 광고성, 상업적 표현 |
| 📋 핵심 주장 (claim) | 초록색 | 팩트체크 필요한 주요 주장 |

## 🛠️ 개발 환경 설정

### 1. 프로젝트 설치 및 실행

```bash
# 전체 프로젝트 설치
npm run install:all

# 개발 환경 실행
npm run dev

# 또는 개별 실행
npm run dev:frontend  # Vite 개발 서버
npm run dev:backend   # Express 서버
```

### 2. 환경 변수 설정

```bash
# backend/.env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
NODE_ENV=development

# frontend/.env (선택사항)
VITE_API_BASE_URL=http://localhost:3001
```

### 3. 크롬 확장 프로그램 로드

1. Chrome 확장 프로그램 개발자 모드 활성화
2. `frontend/dist` 폴더를 확장 프로그램으로 로드
3. 임의의 웹사이트에서 확장 프로그램 아이콘 클릭하여 테스트

## 🧪 테스트 방법

### 개발자 도구에서 테스트

```javascript
// 브라우저 콘솔에서 실행
import { testHighlightSystem, browserHighlightTest } from '/src/utils/testUtils.ts';

// 1. 하이라이트 시스템 전체 테스트
testHighlightSystem();

// 2. 브라우저에서 시각적 테스트
browserHighlightTest();

// 3. 실제 분석 테스트
// 임의의 웹페이지에서 Criti AI 확장 프로그램 실행
```

### 단계별 테스트 가이드

#### 1단계: 하이라이트 데이터 수집 테스트
```bash
# 터미널에서
cd frontend
npm run test:highlights
```

#### 2단계: 시각적 하이라이트 테스트
1. 개발 서버 실행 (`npm run dev`)
2. 테스트 페이지 접속 (`http://localhost:5173/test`)
3. Criti AI 확장 프로그램 실행
4. 하이라이트 색상 및 상호작용 확인

#### 3단계: 실제 웹사이트 테스트
1. 뉴스 사이트 또는 블로그 접속
2. 확장 프로그램 실행하여 분석
3. 하이라이트 클릭 및 스크롤 이동 테스트
4. 사이드바 항목 클릭하여 본문 이동 테스트

## 🔧 커스터마이징 가이드

### 하이라이트 색상 변경

```typescript
// frontend/src/components/analysis/TextHighlighter/TextHighlighter.style.ts
.criti-ai-highlight-bias {
  --highlight-color: rgba(245, 158, 11, 0.3);  // 원하는 색상으로 변경
  --highlight-border-color: #f59e0b;
  color: #92400e;
}
```

### 새로운 분석 타입 추가

1. **타입 정의 추가**
```typescript
// shared/src/types.ts
export interface HighlightedText {
  text: string;
  type: "bias" | "fallacy" | "manipulation" | "advertisement" | "claim" | "새로운타입";
  // ...
}
```

2. **수집 로직 추가**
```typescript
// frontend/src/utils/highlightUtils.ts
export function collectAllHighlights(analysis: TrustAnalysis): HighlightedText[] {
  // 새로운 분석 결과에서 하이라이트 수집 로직 추가
}
```

3. **스타일 추가**
```css
/* TextHighlighter.style.ts */
.criti-ai-highlight-새로운타입 {
  --highlight-color: rgba(원하는색상);
  --highlight-border-color: 테두리색상;
  color: 텍스트색상;
}
```

### 백엔드 프롬프트 수정

```typescript
// backend/src/services/GeminiService.ts
private buildAnalysisPrompt(request: AnalysisRequest): string {
  return `
    # 새로운 분석 지침 추가
    ## N단계: 새로운 분석 타입
    - 새로운 분석을 위한 지침 작성
    
    # JSON 출력에 새로운 필드 추가
    "새로운분석": {
      "indicators": [
        {
          "evidence": "하이라이트할 텍스트",
          "explanation": "분석 설명"
        }
      ]
    }
  `;
}
```

## 📝 개발 체크리스트

### 새로운 분석 기능 추가 시

- [ ] 타입 정의 업데이트 (`shared/src/types.ts`)
- [ ] 백엔드 프롬프트 수정 (`GeminiService.ts`)
- [ ] 하이라이트 수집 로직 추가 (`highlightUtils.ts`)
- [ ] 시각적 스타일 정의 (`TextHighlighter.style.ts`)
- [ ] 사이드바 UI 업데이트 (`Sidebar.tsx`)
- [ ] 테스트 케이스 추가 (`testUtils.ts`)

### 성능 최적화 체크포인트

- [ ] 하이라이트 중복 제거 로직 확인
- [ ] DOM 조작 최소화
- [ ] 메모리 누수 방지 (이벤트 리스너 정리)
- [ ] 대용량 콘텐츠 처리 최적화

## 🐛 문제 해결 가이드

### 하이라이트가 표시되지 않는 경우

1. **콘솔 에러 확인**
   ```javascript
   // 브라우저 개발자 도구에서 확인
   console.log('하이라이트 데이터:', highlights);
   console.log('DOM 선택자 확인:', document.querySelectorAll('.criti-ai-highlight'));
   ```

2. **텍스트 매칭 문제**
   - AI가 반환한 텍스트가 실제 페이지 텍스트와 정확히 일치하는지 확인
   - 공백, 특수문자, 줄바꿈 차이 점검

3. **사이트별 호환성 문제**
   - `TextHighlighter.tsx`의 `contentSelectors` 배열에 해당 사이트 선택자 추가
   - iframe 내부 콘텐츠의 경우 보안 정책 확인

### 성능 문제

1. **하이라이트 개수 제한**
   ```typescript
   // highlightUtils.ts에서 개수 제한
   return Array.from(uniqueHighlights.values())
     .slice(0, 50); // 최대 50개로 제한
   ```

2. **DOM 조작 최적화**
   - `requestAnimationFrame` 사용
   - 배치 DOM 업데이트 적용

## 📚 참고 자료

- [Emotion CSS-in-JS 문서](https://emotion.sh/docs/introduction)
- [Chrome Extension API](https://developer.chrome.com/docs/extensions/reference/)
- [Google Gemini API](https://ai.google.dev/docs)
- [TypeScript 고급 타입](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

## 🤝 기여 가이드

1. Feature Branch 생성: `feat/new-feature`
2. 단계별 커밋으로 작업 진행
3. 테스트 케이스 작성 및 실행
4. Pull Request 생성

### 커밋 메시지 컨벤션

```
<type>(<scope>): <description>

feat(highlight): 새로운 하이라이트 타입 추가
fix(sidebar): 스크롤 이동 버그 수정  
style(ui): 하이라이트 색상 개선
refactor(utils): 하이라이트 수집 로직 최적화
test(highlight): 통합 테스트 케이스 추가
docs(readme): API 문서 업데이트
```

---

## 🎉 완성된 기능들

✅ **통합 하이라이트 시스템** - 모든 분석 결과 시각적 표시  
✅ **양방향 상호작용** - 사이드바 ↔ 본문 스크롤 이동  
✅ **형광펜 효과** - 직관적인 색상 구분 및 hover 효과  
✅ **개선된 AI 분석** - 정확한 텍스트 추출 및 분석  
✅ **반응형 디자인** - 모바일 및 다양한 화면 크기 지원  
✅ **성능 최적화** - 중복 제거 및 DOM 조작 최적화  

**이제 Criti AI는 사용자가 웹 콘텐츠의 편향성, 논리적 오류, 광고성을 시각적으로 쉽게 파악할 수 있는 완전한 미디어 리터러시 도구가 되었습니다!** 🎯

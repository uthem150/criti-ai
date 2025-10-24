# Oracle Micro 배포 가이드

## Oracle Micro 사양 및 최적화 결과

### 서버 사양
```
CPU: 1 vCPU (x86-64)
RAM: 1 GB
Storage: 47 GB SSD
Network: 480 Mbps
Monthly Transfer: 10 TB
비용: 완전 무료 (평생)
```

### 최적화 후 성능
```
 Node.js Backend: ~150MB RAM
 Redis Cache: ~50MB RAM  
 Nginx Proxy: ~30MB RAM
 System Overhead: ~300MB RAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
총 사용량: ~530MB / 1024MB
여유 메모리: ~494MB (48%)
```



---

## 단계별 배포

### 1: Oracle Cloud 인스턴스 생성

#### 1-1. Oracle Cloud 계정 생성
```
1. https://cloud.oracle.com 접속
2. "Start for free" 클릭
3. 회원가입 (신용카드 필요, 과금 없음)
4. 이메일 인증
5. SMS 인증
```

#### 1-2. VM.Standard.E2.1.Micro 인스턴스 생성
```
Shape 설정
• Name: criti-ai-micro
• Image: Ubuntu 22.04 Minimal
• Shape: VM.Standard.E2.1.Micro
• OCPU: 1 (고정)
• Memory: 1 GB (고정)
• Boot Volume: 47 GB

네트워킹
• Create new VCN
• Create new public subnet
• Assign public IP
```

#### 1-3. SSH 키 생성 및 다운로드
```
• "Generate SSH key pair" 선택
• Private Key 다운로드 (중요!)
• Public Key 다운로드
```

### 2: 보안 그룹 설정

#### 2-1. Security List 규칙 추가
```
VCN → Security Lists → Default Security List

Ingress Rules 추가:
• Port 22 (SSH): 0.0.0.0/0
• Port 80 (HTTP): 0.0.0.0/0  
• Port 443 (HTTPS): 0.0.0.0/0
• Port 3001 (API): 0.0.0.0/0
```

### 3: SSH 접속

#### 3-1. Windows에서 접속
```powershell
# PowerShell 실행
cd Downloads
icacls .\ssh키파일.key /inheritance:r
icacls .\ssh키파일.key /grant:r "%username%:R"

# SSH 접속
ssh -i .\ssh키파일.key ubuntu@서버IP주소
```

#### 3-2. Mac/Linux에서 접속
```bash
chmod 600 ~/Downloads/ssh키파일.key
ssh -i ~/Downloads/ssh키파일.key ubuntu@서버IP주소
```

### 4: 자동 배포 실행

#### 4-1. 배포 스크립트 다운로드
```bash
# GitHub에 코드가 있는 경우
git clone https://github.com/본인계정/criti-ai.git
cd criti-ai
```

#### 4-2. 자동 배포 실행
```bash
./deploy-micro-auto.sh
```

#### 4-3. 배포 중 설정 입력
```
1. GitHub 저장소 URL 입력 (선택사항)
2. Gemini API Key 입력 (필수)
   - https://aistudio.google.com 에서 발급
   - "Get API key" → "Create API key"
```

### 5: 배포 완료 확인

#### 5-1. 서비스 상태 확인
```bash
# 컨테이너 상태
docker-compose -f docker-compose.micro.yml ps

# 헬스체크
curl http://localhost:3001/health

# 시스템 리소스
./monitor-micro.sh --status
```

#### 5-2. 외부 접속 테스트
```
브라우저에서 접속:
http://서버IP주소:3001/health

정상 응답 예시
{
  "status": "OK",
  "timestamp": "2024-01-15T...",
  "service": "Criti.AI Backend"
}
```

---

## Vercel 프론트엔드 배포

### 6: Vercel 배포

#### 6-1. Vercel 계정 생성
```
1. https://vercel.com 접속
2. "Start Deploying" 클릭
3. GitHub 계정으로 로그인
```

#### 6-2. 프로젝트 배포
```
1. "Add New..." → "Project"
2. "criti-ai" 저장소 선택
3. "Import" 클릭
4. 설정 확인:
   - Framework: Vite (자동감지)
   - Root Directory: chrome-extension
   - Build Command: npm run build
```

#### 6-3. 환경 변수 설정
```
Environment Variables:
• VITE_BACKEND_URL: http://서버IP주소:3001
• VITE_APP_NAME: Criti.AI
• VITE_APP_VERSION: 1.0.0
```

#### 6-4. 배포 완료
```
약 2-3분 후 배포 완료
배포된 URL: https://criti-ai-xxx.vercel.app
```

### 7: 백엔드-프론트엔드 연결

#### 7-1. 백엔드 환경 변수 업데이트
```bash
# 서버에서 실행
nano .env

# FRONTEND_URL 수정
FRONTEND_URL=https://criti-ai-xxx.vercel.app

# 서비스 재시작
docker-compose -f docker-compose.micro.yml restart backend
```

---

## 운영 및 관리

### 8: 일상 관리 명령어

#### 8-1. 서비스 관리
```bash
# 상태 확인
./monitor-micro.sh --status

# 서비스 재시작
./monitor-micro.sh --restart

# 로그 확인
docker-compose -f docker-compose.micro.yml logs -f

# 리소스 정리
./monitor-micro.sh --cleanup
```

#### 8-2. 업데이트 배포
```bash
# 코드 업데이트
git pull origin main

# 서비스 재배포
docker-compose -f docker-compose.micro.yml down
docker-compose -f docker-compose.micro.yml up -d --build
```

#### 8-3. 문제 해결
```bash
# 메모리 사용률 확인
free -h

# 디스크 사용률 확인  
df -h

# 프로세스 확인
htop

# Docker 상태 확인
docker stats
```

---

## 성능 모니터링

### 9: 실시간 모니터링

#### 9-1. 자동 모니터링 시스템
```
 메모리 사용률 90% 초과시 자동 재시작
 서비스 다운시 자동 복구
 헬스체크 실패시 자동 대응
 주간 Docker 리소스 정리
 시스템 리소스 로깅
```

#### 9-2. 수동 모니터링
```bash
# 실시간 시스템 상태
watch 'free -h && echo && df -h && echo && docker stats --no-stream'

# 로그 모니터링
tail -f /var/log/syslog

# 자세한 성능 분석
iotop  # 디스크 I/O
nethogs  # 네트워크 사용량
```


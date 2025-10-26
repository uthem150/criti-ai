# =============================================================================
# 백엔드 Dockerfile (개발 & 로컬 테스트용)
# =============================================================================
FROM node:18-alpine

# =============================================================================
# YouTube 자막 추출을 위한 yt-dlp 설치
# =============================================================================
RUN apk add --no-cache \
    # Python 3 (yt-dlp 실행에 필요)
    python3 \
    py3-pip \
    # ffmpeg (비디오 처리에 필요)
    ffmpeg \
    # 개발 도구
    curl \
    wget \
    && rm -rf /var/cache/apk/*

# yt-dlp 설치 (pip로 설치하면 자동 업데이트 가능)
RUN pip3 install --no-cache-dir --break-system-packages yt-dlp

# yt-dlp 버전 확인 (빌드 로그에 출력)
RUN yt-dlp --version && echo "✅ yt-dlp installed successfully"

# =============================================================================
# 애플리케이션 설정
# =============================================================================

WORKDIR /app

# 의존성 설치 (캐시 최적화)
COPY package*.json ./
COPY shared/package*.json ./shared/
RUN npm ci

# 소스 코드 복사
COPY . .

# Prisma 설정
RUN npx prisma generate

# TypeScript 빌드
RUN npm run build

# 시드 데이터 실행 (선택사항)
RUN npm run db:push
RUN npm run db:seed

# 환경 변수 설정
ENV NODE_ENV=development \
    YT_DLP_PATH=/usr/bin/yt-dlp

# 포트 노출
EXPOSE 3001

# 개발 실행 (nodemon 사용)
CMD ["npm", "run", "dev"]

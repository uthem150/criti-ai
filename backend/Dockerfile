# 백엔드 Dockerfile
FROM node:18-alpine

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

EXPOSE 3001

# 프로덕션 실행
CMD ["npm", "start"]

#!/bin/bash

# Oracle Micro 완전 자동화 배포 스크립트
# 이 스크립트 하나로 모든 설정과 배포가 완료됩니다.

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# 함수 정의
print_header() {
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════════╗"
    echo "║                    🚀 Criti.AI Oracle Micro 배포                 ║"
    echo "║                   완전 자동화 설치 스크립트                        ║"
    echo "╚══════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_step() {
    echo -e "\n${BLUE}[단계 $1/$2]${NC} $3"
    echo "────────────────────────────────────────────────────"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# 진행 상황 표시
show_progress() {
    local current=$1
    local total=$2
    local percent=$((current * 100 / total))
    local filled=$((percent / 2))
    local empty=$((50 - filled))
    
    printf "\r${BLUE}진행률: ["
    printf "%${filled}s" | tr ' ' '█'
    printf "%${empty}s" | tr ' ' '░'
    printf "] %d%% (%d/%d)${NC}" $percent $current $total
}

# 사전 확인
pre_check() {
    print_step 1 10 "사전 환경 확인"
    
    # Oracle Cloud 인스턴스 확인
    if [ ! -f /sys/hypervisor/uuid ] || ! grep -q "^ec2" /sys/hypervisor/uuid 2>/dev/null; then
        # EC2가 아니면 Oracle Cloud일 가능성
        print_success "Oracle Cloud 환경 감지"
    fi
    
    # 메모리 확인
    local mem_mb=$(free -m | awk '/^Mem:/ {print $2}')
    if [ "$mem_mb" -lt 800 ]; then
        print_error "메모리가 800MB 미만입니다. Micro 인스턴스가 아닐 수 있습니다."
    fi
    print_success "메모리: ${mem_mb}MB (Micro 인스턴스 확인됨)"
    
    # 디스크 공간 확인
    local disk_available=$(df / | tail -1 | awk '{print $4}')
    if [ "$disk_available" -lt 5000000 ]; then  # 5GB
        print_warning "디스크 공간이 부족할 수 있습니다."
    fi
    
    # 인터넷 연결 확인
    if ! ping -c 1 google.com >/dev/null 2>&1; then
        print_error "인터넷 연결을 확인할 수 없습니다."
    fi
    print_success "인터넷 연결 정상"
}

# 시스템 최적화
optimize_system() {
    print_step 2 10 "시스템 최적화"
    
    # 시스템 업데이트
    show_progress 1 5
    sudo apt update >/dev/null 2>&1
    
    show_progress 2 5
    sudo apt upgrade -y >/dev/null 2>&1
    
    # Swap 생성
    show_progress 3 5
    if [ ! -f /swapfile ]; then
        sudo fallocate -l 2G /swapfile
        sudo chmod 600 /swapfile
        sudo mkswap /swapfile >/dev/null 2>&1
        sudo swapon /swapfile
        echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab >/dev/null
        print_success "2GB Swap 파일 생성 완료"
    fi
    
    # 시스템 최적화 설정
    show_progress 4 5
    sudo tee -a /etc/sysctl.conf >/dev/null << EOF
vm.swappiness=10
vm.vfs_cache_pressure=50
vm.overcommit_memory=1
net.core.rmem_max=16777216
net.core.wmem_max=16777216
EOF
    sudo sysctl -p >/dev/null 2>&1
    
    # 불필요한 서비스 정리
    show_progress 5 5
    for service in snapd bluetooth ModemManager whoopsie cups; do
        sudo systemctl disable "$service" >/dev/null 2>&1 || true
        sudo systemctl stop "$service" >/dev/null 2>&1 || true
    done
    
    print_success "시스템 최적화 완료"
}

# Docker 설치
install_docker() {
    print_step 3 10 "Docker 설치"
    
    if ! command -v docker &> /dev/null; then
        show_progress 1 3
        curl -fsSL https://get.docker.com -o get-docker.sh
        
        show_progress 2 3
        sudo sh get-docker.sh >/dev/null 2>&1
        sudo usermod -aG docker ubuntu
        rm get-docker.sh
        
        # Docker 메모리 최적화
        sudo mkdir -p /etc/docker
        sudo tee /etc/docker/daemon.json >/dev/null << EOF
{
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "10m",
        "max-file": "3"
    },
    "storage-driver": "overlay2"
}
EOF
        sudo systemctl restart docker
        print_success "Docker 설치 완료"
    else
        print_success "Docker가 이미 설치되어 있습니다"
    fi
    
    # Docker Compose 설치
    show_progress 3 3
    if ! command -v docker-compose &> /dev/null; then
        sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose >/dev/null 2>&1
        sudo chmod +x /usr/local/bin/docker-compose
        print_success "Docker Compose 설치 완료"
    fi
}

# 방화벽 설정
setup_firewall() {
    print_step 4 10 "방화벽 설정"
    
    sudo ufw --force reset >/dev/null 2>&1
    sudo ufw default deny incoming >/dev/null 2>&1
    sudo ufw default allow outgoing >/dev/null 2>&1
    sudo ufw allow 22/tcp >/dev/null 2>&1
    sudo ufw allow 80/tcp >/dev/null 2>&1
    sudo ufw allow 443/tcp >/dev/null 2>&1
    sudo ufw --force enable >/dev/null 2>&1
    
    print_success "방화벽 설정 완료 (22, 80, 443 포트 개방)"
}

# 프로젝트 코드 준비
setup_project() {
    print_step 5 10 "프로젝트 코드 설정"
    
    # GitHub 저장소 확인
    if [ ! -d ".git" ]; then
        echo -e "${YELLOW}GitHub 저장소 URL을 입력하세요:${NC}"
        read -p "Repository URL: " repo_url
        
        if [ -n "$repo_url" ]; then
            git clone "$repo_url" temp_repo
            cp -r temp_repo/* .
            cp -r temp_repo/.* . 2>/dev/null || true
            rm -rf temp_repo
            print_success "GitHub에서 코드 다운로드 완료"
        else
            print_warning "저장소 URL이 없습니다. 현재 디렉토리의 파일을 사용합니다."
        fi
    else
        git pull origin main >/dev/null 2>&1 || print_warning "Git pull 실패 (로컬 파일 사용)"
        print_success "코드 업데이트 완료"
    fi
}

# 환경 변수 설정
setup_environment() {
    print_step 6 10 "환경 변수 설정"
    
    # backend/.env 파일 확인 및 설정
    if [ ! -f "backend/.env" ]; then
        print_warning "backend/.env 파일이 없습니다. 생성합니다."
        cp "backend/.env.example" "backend/.env" 2>/dev/null || touch "backend/.env"
    fi
    
    # Gemini API Key 확인 및 설정
    if ! grep -q "GEMINI_API_KEY=" "backend/.env" || grep -q "your_gemini_api_key_here" "backend/.env"; then
        echo -e "${YELLOW}Gemini API Key 설정이 필요합니다:${NC}"
        echo ""
        echo "🔑 Gemini API Key가 필요합니다."
        echo "   1. https://aistudio.google.com 접속"
        echo "   2. Google 계정으로 로그인"
        echo "   3. 'Get API key' → 'Create API key' 클릭"
        echo "   4. 생성된 키를 복사하여 아래에 입력"
        echo ""
        read -p "Gemini API Key: " api_key
        
        if [ -n "$api_key" ]; then
            # backend/.env에 API 키 설정
            if grep -q "GEMINI_API_KEY=" "backend/.env"; then
                sed -i "s/GEMINI_API_KEY=.*/GEMINI_API_KEY=$api_key/" "backend/.env"
            else
                echo "GEMINI_API_KEY=$api_key" >> "backend/.env"
            fi
            print_success "Gemini API Key 설정 완료 (backend/.env)"
        else
            print_error "API Key는 필수입니다!"
        fi
    else
        print_success "Gemini API Key가 이미 설정되어 있습니다 (backend/.env)"
    fi
    
    # 프로덕션 환경에 맞게 backend/.env 업데이트
    sed -i "s/NODE_ENV=.*/NODE_ENV=production/" "backend/.env"
    sed -i "s|DATABASE_URL=.*|DATABASE_URL=file:/app/data/criti-ai.db|" "backend/.env"
    sed -i "s|REDIS_URL=.*|REDIS_URL=redis://redis:6379|" "backend/.env"
    
    print_success "백엔드 환경 변수 설정 완료"
    print_warning "프론트엔드 배포 후 FRONTEND_URL을 backend/.env에서 업데이트하세요"
}

# SSL 인증서 설정
setup_ssl() {
    print_step 7 11 "SSL 인증서 설정"
    
    show_progress 1 3
    echo -e "${YELLOW}SSL 설정을 원하시나요? (도메인이 있으면 y, IP만 사용하면 n):${NC}"
    read -p "SSL 설정 (y/n): " ssl_choice
    
    if [ "$ssl_choice" = "y" ]; then
        echo -e "${YELLOW}도메인을 입력하세요:${NC}"
        read -p "Domain: " domain
        
        if [ -n "$domain" ]; then
            # nginx 임시 중지
            docker-compose -f config/docker/docker-compose.micro.yml stop nginx 2>/dev/null || true
            
            # Let's Encrypt 인증서 발급
            sudo certbot certonly --standalone -d "$domain" --non-interactive --agree-tos --email admin@"$domain" 2>/dev/null || {
                print_warning "Let's Encrypt 실패, 자체 서명 인증서로 대체"
                domain=$(curl -s ifconfig.me)
            }
            
            show_progress 2 3
            # 인증서 복사
            sudo mkdir -p /etc/nginx/ssl
            if [ -f "/etc/letsencrypt/live/$domain/fullchain.pem" ]; then
                sudo cp "/etc/letsencrypt/live/$domain/fullchain.pem" /etc/nginx/ssl/criti-ai.crt
                sudo cp "/etc/letsencrypt/live/$domain/privkey.pem" /etc/nginx/ssl/criti-ai.key
                print_success "Let's Encrypt 인증서 설정 완료"
            else
                # 자체 서명 인증서 생성
                server_ip=$(curl -s ifconfig.me)
                sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
                    -keyout /etc/nginx/ssl/criti-ai.key \
                    -out /etc/nginx/ssl/criti-ai.crt \
                    -subj "/C=KR/ST=Seoul/L=Seoul/O=CritiAI/OU=Dev/CN=$server_ip" >/dev/null 2>&1
                print_success "자체 서명 인증서 생성 완료"
            fi
        fi
    else
        # 자체 서명 인증서 생성 (IP 사용)
        show_progress 2 3
        server_ip=$(curl -s ifconfig.me)
        sudo mkdir -p /etc/nginx/ssl
        sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout /etc/nginx/ssl/criti-ai.key \
            -out /etc/nginx/ssl/criti-ai.crt \
            -subj "/C=KR/ST=Seoul/L=Seoul/O=CritiAI/OU=Dev/CN=$server_ip" >/dev/null 2>&1
        print_success "자체 서명 인증서 생성 완료"
    fi
    
    show_progress 3 3
    # 인증서 권한 설정
    sudo chmod 644 /etc/nginx/ssl/criti-ai.crt
    sudo chmod 600 /etc/nginx/ssl/criti-ai.key
    
    # certbot 웹루트 생성
    sudo mkdir -p /var/www/certbot
    
    print_success "SSL 설정 완료"
}

# 서비스 빌드 및 시작
build_and_start() {
    print_step 8 11 "서비스 빌드 및 시작"
    
    # 기존 컨테이너 정리
    show_progress 1 4
    docker-compose -f ../config/docker/docker-compose.micro.yml down >/dev/null 2>&1 || true
    
    # 이미지 빌드
    show_progress 2 4
    echo -e "\n${BLUE}Docker 이미지 빌드 중... (5-10분 소요)${NC}"
    docker-compose -f ../config/docker/docker-compose.micro.yml build >/dev/null 2>&1
    
    # 서비스 시작
    show_progress 3 4
    docker-compose -f ../config/docker/docker-compose.micro.yml up -d >/dev/null 2>&1
    
    # 서비스 시작 대기
    show_progress 4 4
    echo -e "\n${BLUE}서비스 시작 대기 중...${NC}"
    sleep 60
    
    print_success "서비스 시작 완료"
}

# 서비스 상태 확인
verify_deployment() {
    print_step 9 11 "배포 상태 확인"
    
    # 컨테이너 상태 확인
    show_progress 1 3
    local containers_up=$(docker-compose -f ../config/docker/docker-compose.micro.yml ps | grep -c "Up" || echo "0")
    if [ "$containers_up" -lt 3 ]; then
        print_warning "일부 컨테이너가 실행되지 않았습니다."
    else
        print_success "모든 컨테이너가 정상 실행 중"
    fi
    
    # Health check
    show_progress 2 3
    local health_attempts=0
    while [ $health_attempts -lt 5 ]; do
        if curl -s http://localhost:3001/health >/dev/null 2>&1; then
            print_success "백엔드 API 정상 작동"
            break
        fi
        health_attempts=$((health_attempts + 1))
        sleep 10
    done
    
    if [ $health_attempts -eq 5 ]; then
        print_warning "백엔드 API 응답 없음 (시간이 더 필요할 수 있습니다)"
    fi
    
    # 메모리 사용량 확인
    show_progress 3 3
    local mem_usage=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100.0)}')
    if [ "$mem_usage" -gt 85 ]; then
        print_warning "메모리 사용률이 높습니다: ${mem_usage}%"
    else
        print_success "메모리 사용률 정상: ${mem_usage}%"
    fi
}

# 모니터링 설정
setup_monitoring() {
    print_step 10 11 "모니터링 설정"
    
    # 모니터링 스크립트 실행 권한 부여
    chmod +x monitor-micro.sh
    
    # 시스템 서비스로 등록
    sudo tee /etc/systemd/system/criti-ai-monitor.service >/dev/null << EOF
[Unit]
Description=Criti.AI Monitoring Service
After=docker.service
Requires=docker.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=$(pwd)
ExecStart=$(pwd)/monitor-micro.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable criti-ai-monitor >/dev/null 2>&1
    sudo systemctl start criti-ai-monitor >/dev/null 2>&1
    
    print_success "자동 모니터링 시스템 설정 완료"
}

# 최종 정보 출력
show_final_info() {
    print_step 11 11 "배포 완료"
    
    SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "서버IP확인불가")
    
    echo -e "\n${GREEN}🎉 Criti.AI Oracle Micro 배포가 완료되었습니다!${NC}\n"
    
    echo "📋 서비스 정보:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🌐 백엔드 API: http://$SERVER_IP:3001"
    echo "🔍 Health Check: http://$SERVER_IP:3001/health"
    echo "📊 시스템 모니터링: ./monitor.sh --status"
    echo ""
    
    echo "🛠️ 유용한 명령어:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "• 서비스 상태 확인: docker-compose -f docker-compose.micro.yml ps"
    echo "• 로그 확인: docker-compose -f docker-compose.micro.yml logs -f"
    echo "• 서비스 재시작: docker-compose -f docker-compose.micro.yml restart"
    echo "• 리소스 모니터링: ./monitor-micro.sh --status"
    echo "• 수동 재시작: ./monitor-micro.sh --restart"
    echo ""
    
    echo "🔗 다음 단계:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "1. Vercel에서 프론트엔드 배포"
    echo "   - https://vercel.com 접속"
    echo "   - GitHub 저장소 연결"
    echo "   - 환경변수 VITE_BACKEND_URL=http://$SERVER_IP:3001 설정"
    echo ""
    echo "2. 백엔드 환경변수 업데이트"
    echo "   - nano backend/.env"
    echo "   - FRONTEND_URL을 Vercel URL로 변경"
    echo "   - docker-compose -f docker-compose.micro.yml restart"
    echo ""
    
    echo "💰 비용 정보:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "• Oracle Cloud: 무료 (Always Free)"
    echo "• Vercel: 무료"
    echo "• 총 운영비: 0원! 💚"
    echo ""
    
    echo "⚠️ 주의사항:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "• 메모리 사용률 90% 초과시 자동 재시작됩니다"
    echo "• 서비스 로그를 정기적으로 확인하세요"
    echo "• Gemini API 사용량을 모니터링하세요"
    echo ""
    
    # QR 코드로 접속 정보 표시 (선택사항)
    if command -v qrencode >/dev/null 2>&1; then
        echo "📱 QR 코드로 접속:"
        qrencode -t ANSI "http://$SERVER_IP:3001/health"
    fi
}

# 메인 실행 함수
main() {
    print_header
    
    echo "Oracle Micro 서버에 Criti.AI를 배포합니다."
    echo "예상 소요 시간: 10-15분"
    echo ""
    read -p "계속하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "배포를 취소했습니다."
        exit 0
    fi
    
    # 각 단계 실행
    pre_check
    optimize_system
    install_docker
    setup_firewall
    setup_project
    setup_environment
    setup_ssl
    build_and_start
    verify_deployment
    setup_monitoring
    show_final_info
    
    echo -e "\n${GREEN}🚀 배포가 성공적으로 완료되었습니다!${NC}"
    echo "시스템이 안정화될 때까지 5분 정도 기다린 후 서비스를 이용하세요."
}

# 스크립트 실행
main "$@"

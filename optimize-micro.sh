#!/bin/bash

# Oracle Micro 서버 극한 최적화 스크립트
set -e

echo "🔥 Oracle Micro 서버 최적화를 시작합니다..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 함수 정의
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. 시스템 정보 확인
print_status "시스템 정보 확인 중..."
echo "CPU: $(nproc) cores"
echo "RAM: $(free -h | awk '/^Mem:/ {print $2}')"
echo "Disk: $(df -h / | awk 'NR==2 {print $4}') available"
echo "OS: $(lsb_release -d | cut -f2)"

# 2. 시스템 업데이트 (최소한만)
print_status "시스템 업데이트 중..."
sudo apt update
sudo apt upgrade -y
sudo apt autoremove -y
sudo apt autoclean

# 3. Swap 파일 생성 (메모리 부족 대비)
print_status "Swap 파일 생성 중..."
if [ ! -f /swapfile ]; then
    # 2GB Swap 생성 (RAM의 2배)
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    
    # 부팅시 자동 마운트
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    
    # Swap 사용률 최적화 (메모리 부족시에만 사용)
    echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
    echo 'vm.vfs_cache_pressure=50' | sudo tee -a /etc/sysctl.conf
    
    print_success "Swap 파일 생성 완료 (2GB)"
else
    print_warning "Swap 파일이 이미 존재합니다"
fi

# 4. 메모리 최적화 설정
print_status "메모리 최적화 설정 중..."
sudo tee -a /etc/sysctl.conf << EOF

# 메모리 최적화 설정
vm.dirty_background_ratio = 5
vm.dirty_ratio = 10
vm.dirty_expire_centisecs = 1500
vm.dirty_writeback_centisecs = 500
vm.overcommit_memory = 1
vm.max_map_count = 262144

# 네트워크 최적화
net.core.rmem_default = 262144
net.core.rmem_max = 16777216
net.core.wmem_default = 262144
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 65536 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
EOF

sudo sysctl -p

# 5. 불필요한 서비스 비활성화
print_status "불필요한 서비스 비활성화 중..."
services_to_disable=(
    "snapd"
    "bluetooth"
    "ModemManager"
    "whoopsie"
    "cups"
    "avahi-daemon"
)

for service in "${services_to_disable[@]}"; do
    if systemctl is-enabled "$service" >/dev/null 2>&1; then
        sudo systemctl disable "$service"
        sudo systemctl stop "$service"
        print_success "$service 비활성화 완료"
    fi
done

# 6. Docker 설치 (메모리 효율적인 방법)
if ! command -v docker &> /dev/null; then
    print_status "Docker 설치 중..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker ubuntu
    
    # Docker 메모리 최적화 설정
    sudo mkdir -p /etc/docker
    sudo tee /etc/docker/daemon.json << EOF
{
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "10m",
        "max-file": "3"
    },
    "storage-driver": "overlay2",
    "default-ulimits": {
        "nofile": {
            "Name": "nofile",
            "Hard": 64000,
            "Soft": 64000
        }
    }
}
EOF
    
    sudo systemctl restart docker
    rm get-docker.sh
fi

# 7. Docker Compose 설치
if ! command -v docker-compose &> /dev/null; then
    print_status "Docker Compose 설치 중..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# 8. 방화벽 설정
print_status "방화벽 설정 중..."
sudo ufw --force reset
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# 9. 로그 관리 설정
print_status "로그 관리 설정 중..."
# Journal 로그 크기 제한
sudo mkdir -p /etc/systemd/journald.conf.d
sudo tee /etc/systemd/journald.conf.d/99-criti-ai.conf << EOF
[Journal]
SystemMaxUse=100M
SystemMaxFileSize=10M
SystemMaxFiles=10
RuntimeMaxUse=50M
RuntimeMaxFileSize=5M
RuntimeMaxFiles=5
MaxRetentionSec=1week
EOF

sudo systemctl restart systemd-journald

# 10. 크론 작업 설정 (정기 정리)
print_status "크론 작업 설정 중..."
(crontab -l 2>/dev/null; echo "0 3 * * * docker system prune -f") | crontab -
(crontab -l 2>/dev/null; echo "0 4 * * 0 sudo apt autoremove -y && sudo apt autoclean") | crontab -

# 11. 모니터링 스크립트 생성
print_status "모니터링 스크립트 생성 중..."
sudo tee /usr/local/bin/monitor-resources.sh << 'EOF'
#!/bin/bash
echo "=== 시스템 리소스 모니터링 ==="
echo "날짜: $(date)"
echo ""
echo "== 메모리 사용률 =="
free -h
echo ""
echo "== 디스크 사용률 =="
df -h /
echo ""
echo "== CPU 로드 =="
uptime
echo ""
echo "== Docker 컨테이너 상태 =="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Image}}"
echo ""
echo "== Docker 리소스 사용률 =="
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
EOF

sudo chmod +x /usr/local/bin/monitor-resources.sh

# 12. 편의 스크립트 생성
print_status "편의 스크립트 생성 중..."
tee ~/deploy.sh << 'EOF'
#!/bin/bash
echo "🚀 Criti.AI 배포 스크립트"

# 코드 업데이트
git pull origin main

# 환경 변수 확인
if [ ! -f .env ]; then
    echo "❌ .env 파일이 없습니다!"
    echo "cp .env.example .env 실행 후 환경 변수를 설정하세요."
    exit 1
fi

# 서비스 재시작
docker-compose -f docker-compose.micro.yml down
docker-compose -f docker-compose.micro.yml up -d --build

# 상태 확인
sleep 30
./monitor.sh
EOF

tee ~/monitor.sh << 'EOF'
#!/bin/bash
/usr/local/bin/monitor-resources.sh
EOF

chmod +x ~/deploy.sh ~/monitor.sh

# 13. 최종 시스템 정리
print_status "최종 시스템 정리 중..."
sudo apt autoremove -y
sudo apt autoclean
sudo journalctl --vacuum-size=50M

# 14. 완료 메시지
print_success "Oracle Micro 서버 최적화 완료!"
echo ""
echo "📊 최적화 결과:"
echo "- Swap: 2GB 생성"
echo "- 불필요한 서비스 비활성화"
echo "- Docker 메모리 최적화"
echo "- 로그 크기 제한"
echo "- 방화벽 설정 완료"
echo ""
echo "🛠️ 유용한 명령어:"
echo "- 리소스 모니터링: ./monitor.sh"
echo "- 서비스 배포: ./deploy.sh"
echo "- 로그 확인: docker-compose -f docker-compose.micro.yml logs -f"
echo ""
echo "⚠️ 다음 단계:"
echo "1. 프로젝트 코드 클론"
echo "2. 환경 변수 설정 (.env)"
echo "3. ./deploy.sh 실행"
echo ""
echo "🔄 재부팅 권장: sudo reboot"

#!/bin/bash

# Oracle Micro 자동 모니터링 및 복구 스크립트
# 메모리 사용률이 90% 이상이면 자동 재시작

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/monitor.log"
COMPOSE_FILE="$SCRIPT_DIR/../config/docker/docker-compose.micro.yml"

# 로그 함수
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 메모리 사용률 확인
check_memory() {
    local mem_percent=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100.0)}')
    echo $mem_percent
}

# 서비스 상태 확인
check_services() {
    local backend_status=$(docker-compose -f "$COMPOSE_FILE" ps backend | grep -c "Up")
    local redis_status=$(docker-compose -f "$COMPOSE_FILE" ps redis | grep -c "Up")
    local nginx_status=$(docker-compose -f "$COMPOSE_FILE" ps nginx | grep -c "Up")
    
    if [ "$backend_status" -eq 0 ] || [ "$redis_status" -eq 0 ] || [ "$nginx_status" -eq 0 ]; then
        return 1
    fi
    return 0
}

# 헬스체크
health_check() {
    local health_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health)
    if [ "$health_status" -eq 200 ]; then
        return 0
    else
        return 1
    fi
}

# 서비스 재시작
restart_services() {
    log_message "🔄 서비스 재시작 중..."
    
    # 현재 실행 중인 컨테이너 정리
    docker-compose -f "$COMPOSE_FILE" down --timeout 10
    
    # 잠시 대기 (메모리 정리)
    sleep 10
    
    # 시스템 캐시 정리
    sync
    echo 3 | sudo tee /proc/sys/vm/drop_caches > /dev/null
    
    # 서비스 재시작
    docker-compose -f "$COMPOSE_FILE" up -d
    
    # 서비스 시작 대기
    sleep 30
    
    if check_services && health_check; then
        log_message "✅ 서비스 재시작 성공"
        
        # Slack/Discord 알림 (선택사항)
        # send_notification "Criti.AI 서비스가 재시작되었습니다."
    else
        log_message "❌ 서비스 재시작 실패"
    fi
}

# Docker 리소스 정리
cleanup_docker() {
    log_message "🧹 Docker 리소스 정리 중..."
    
    # 사용하지 않는 이미지 제거
    docker image prune -f
    
    # 사용하지 않는 볼륨 제거
    docker volume prune -f
    
    # 사용하지 않는 네트워크 제거
    docker network prune -f
    
    log_message "✅ Docker 리소스 정리 완료"
}

# 시스템 정보 로깅
log_system_info() {
    local mem_percent=$(check_memory)
    local disk_percent=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    local load_avg=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
    
    log_message "📊 시스템 상태 - 메모리: ${mem_percent}%, 디스크: ${disk_percent}%, 로드: ${load_avg}"
}

# 메인 모니터링 루프
main_monitor() {
    log_message "🚀 Criti.AI 모니터링 시작"
    
    local restart_count=0
    local max_restarts=3
    local restart_window=3600  # 1시간
    local window_start=$(date +%s)
    
    while true; do
        local current_time=$(date +%s)
        local mem_percent=$(check_memory)
        
        # 1시간마다 재시작 카운터 리셋
        if [ $((current_time - window_start)) -gt $restart_window ]; then
            restart_count=0
            window_start=$current_time
            log_message "🔄 재시작 카운터 리셋"
        fi
        
        # 시스템 정보 로깅 (5분마다)
        if [ $((current_time % 300)) -eq 0 ]; then
            log_system_info
        fi
        
        # 메모리 사용률 확인
        if [ "$mem_percent" -gt 90 ]; then
            log_message "⚠️ 높은 메모리 사용률 감지: ${mem_percent}%"
            
            if [ $restart_count -lt $max_restarts ]; then
                restart_services
                restart_count=$((restart_count + 1))
                sleep 300  # 5분 대기
            else
                log_message "❌ 최대 재시작 횟수 초과. 관리자 확인 필요."
                sleep 3600  # 1시간 대기
            fi
        fi
        
        # 서비스 상태 확인
        if ! check_services; then
            log_message "⚠️ 서비스 다운 감지"
            
            if [ $restart_count -lt $max_restarts ]; then
                restart_services
                restart_count=$((restart_count + 1))
            fi
        fi
        
        # 헬스체크 확인
        if ! health_check; then
            log_message "⚠️ 헬스체크 실패"
            
            # 3번 연속 실패하면 재시작
            local fail_count=0
            for i in {1..3}; do
                sleep 10
                if ! health_check; then
                    fail_count=$((fail_count + 1))
                fi
            done
            
            if [ $fail_count -eq 3 ] && [ $restart_count -lt $max_restarts ]; then
                restart_services
                restart_count=$((restart_count + 1))
            fi
        fi
        
        # 매주 일요일 03:00에 Docker 정리
        if [ "$(date +%w)" -eq 0 ] && [ "$(date +%H)" -eq 3 ] && [ "$(date +%M)" -eq 0 ]; then
            cleanup_docker
        fi
        
        # 30초마다 체크
        sleep 30
    done
}

# 스크립트 종료 시 정리
cleanup() {
    log_message "🛑 모니터링 스크립트 종료"
    exit 0
}

trap cleanup SIGINT SIGTERM

# 사용법 출력
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Criti.AI Oracle Micro 모니터링 스크립트"
    echo ""
    echo "사용법:"
    echo "  $0                 # 모니터링 시작"
    echo "  $0 --status       # 현재 상태 확인"
    echo "  $0 --restart      # 수동 재시작"
    echo "  $0 --cleanup      # Docker 정리"
    echo "  $0 --help         # 도움말"
    exit 0
fi

# 명령어 처리
case "$1" in
    --status)
        log_system_info
        if check_services; then
            echo "✅ 모든 서비스가 정상 실행 중"
        else
            echo "❌ 일부 서비스가 중단됨"
        fi
        if health_check; then
            echo "✅ 헬스체크 통과"
        else
            echo "❌ 헬스체크 실패"
        fi
        ;;
    --restart)
        restart_services
        ;;
    --cleanup)
        cleanup_docker
        ;;
    *)
        # 백그라운드에서 실행 중인지 확인
        if pgrep -f "monitor-micro.sh" > /dev/null; then
            echo "⚠️ 모니터링이 이미 실행 중입니다."
            echo "종료하려면: pkill -f monitor-micro.sh"
            exit 1
        fi
        
        # 메인 모니터링 실행
        main_monitor
        ;;
esac

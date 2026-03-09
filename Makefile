.PHONY: help build up down restart logs logs-api logs-db logs-cache \
        db-shell redis-cli db-backup db-restore clean ps test health

# Colors for output
BLUE=\033[0;34m
GREEN=\033[0;32m
YELLOW=\033[1;33m
RED=\033[0;31m
NC=\033[0m # No Color

help:
	@echo "$(BLUE)════════════════════════════════════════════════════════════$(NC)"
	@echo "$(BLUE)  CCCZ Portal - Docker Management$(NC)"
	@echo "$(BLUE)════════════════════════════════════════════════════════════$(NC)"
	@echo ""
	@echo "$(GREEN)Build & Start:$(NC)"
	@echo "  make build          - Build Docker images"
	@echo "  make up             - Start all services"
	@echo "  make down           - Stop all services"
	@echo "  make restart        - Restart all services"
	@echo ""
	@echo "$(GREEN)Logs & Status:$(NC)"
	@echo "  make logs           - Follow all logs"
	@echo "  make logs-api       - Follow API logs"
	@echo "  make logs-db        - Follow Database logs"
	@echo "  make logs-cache     - Follow Cache logs"
	@echo "  make ps             - Show running containers"
	@echo "  make health         - Check service health"
	@echo ""
	@echo "$(GREEN)Database:$(NC)"
	@echo "  make db-shell       - Connect to MySQL shell"
	@echo "  make db-backup      - Backup database"
	@echo "  make db-restore     - Restore database from backup.sql"
	@echo ""
	@echo "$(GREEN)Cache:$(NC)"
	@echo "  make redis-cli      - Connect to Redis CLI"
	@echo ""
	@echo "$(GREEN)Maintenance:$(NC)"
	@echo "  make clean          - Stop and remove containers/volumes"
	@echo "  make test           - Run tests"
	@echo ""
	@echo "$(GREEN)Development:$(NC)"
	@echo "  make dev            - Start in development mode"
	@echo "  make shell-api      - Shell into API container"
	@echo ""

# ============================================================================
# Build & Start
# ============================================================================

build:
	@echo "$(YELLOW)Building Docker images...$(NC)"
	docker-compose build
	@echo "$(GREEN)✓ Build complete$(NC)"

up:
	@echo "$(YELLOW)Starting services...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)✓ Services started$(NC)"
	@echo ""
	@echo "$(BLUE)Waiting for services to be healthy...$(NC)"
	@sleep 5
	@make health

down:
	@echo "$(YELLOW)Stopping services...$(NC)"
	docker-compose down
	@echo "$(GREEN)✓ Services stopped$(NC)"

restart:
	@echo "$(YELLOW)Restarting services...$(NC)"
	docker-compose restart
	@echo "$(GREEN)✓ Services restarted$(NC)"

# ============================================================================
# Logs
# ============================================================================

logs:
	docker-compose logs -f --timestamps

logs-api:
	docker-compose logs -f --timestamps api

logs-db:
	docker-compose logs -f --timestamps db

logs-cache:
	docker-compose logs -f --timestamps cache

# ============================================================================
# Status & Health
# ============================================================================

ps:
	@echo "$(BLUE)Running containers:$(NC)"
	@docker-compose ps
	@echo ""

health:
	@echo "$(BLUE)Checking service health...$(NC)"
	@echo ""
	@docker-compose exec -T api curl -s http://localhost:3000/ > /dev/null && \
		echo "$(GREEN)✓ API (3000)$(NC)" || echo "$(RED)✗ API$(NC)"
	@docker-compose exec -T db mysqladmin -u ccclezoo_user -p$$DB_PASS ping -h localhost > /dev/null 2>&1 && \
		echo "$(GREEN)✓ Database (3306)$(NC)" || echo "$(RED)✗ Database$(NC)"
	@docker-compose exec -T cache redis-cli ping > /dev/null 2>&1 && \
		echo "$(GREEN)✓ Cache (6379)$(NC)" || echo "$(RED)✗ Cache$(NC)"
	@echo ""

# ============================================================================
# Database Operations
# ============================================================================

db-shell:
	@echo "$(YELLOW)Connecting to MySQL...$(NC)"
	docker-compose exec db mysql -u ccclezoo_user -p -h db ccclezoo_db

db-backup:
	@echo "$(YELLOW)Backing up database...$(NC)"
	docker-compose exec -T db mysqldump -u ccclezoo_user -p$$DB_PASS ccclezoo_db > backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)✓ Backup complete$(NC)"

db-restore:
	@echo "$(YELLOW)Restoring database from backup.sql...$(NC)"
	@test -f backup.sql || (echo "$(RED)Error: backup.sql not found$(NC)" && exit 1)
	docker-compose exec -T db mysql -u ccclezoo_user -p$$DB_PASS ccclezoo_db < backup.sql
	@echo "$(GREEN)✓ Restore complete$(NC)"

# ============================================================================
# Cache Operations
# ============================================================================

redis-cli:
	@echo "$(YELLOW)Connecting to Redis...$(NC)"
	docker-compose exec cache redis-cli -a $$REDIS_PASSWORD

# ============================================================================
# Development
# ============================================================================

dev:
	@echo "$(YELLOW)Starting development environment...$(NC)"
	NODE_ENV=development docker-compose up api db cache
	@echo "$(GREEN)✓ Development mode active$(NC)"

shell-api:
	@echo "$(YELLOW)Opening shell in API container...$(NC)"
	docker-compose exec api /bin/sh

# ============================================================================
# Maintenance
# ============================================================================

clean:
	@echo "$(YELLOW)Cleaning up containers and volumes...$(NC)"
	docker-compose down -v
	@echo "$(GREEN)✓ Cleanup complete$(NC)"

test:
	@echo "$(YELLOW)Running tests...$(NC)"
	docker-compose exec api npm run test
	@echo "$(GREEN)✓ Tests complete$(NC)"

# ============================================================================
# Info
# ============================================================================

info:
	@echo "$(BLUE)════════════════════════════════════════════════════════════$(NC)"
	@echo "$(BLUE)  Service Information$(NC)"
	@echo "$(BLUE)════════════════════════════════════════════════════════════$(NC)"
	@echo ""
	@echo "$(GREEN)API:$(NC)"
	@echo "  URL:     http://localhost:3000"
	@echo "  Exposed: Port 3000"
	@echo ""
	@echo "$(GREEN)Database:$(NC)"
	@echo "  Host:     db (internal) / localhost:3306 (local)"
	@echo "  Database: ccclezoo_db"
	@echo "  User:     ccclezoo_user"
	@echo ""
	@echo "$(GREEN)Cache:$(NC)"
	@echo "  Host:     cache (internal) / localhost:6379 (local)"
	@echo ""
	@echo "$(GREEN)Network:$(NC)"
	@echo "  Subnet: 172.20.0.0/16"
	@echo "  Driver: bridge"
	@echo ""
	@echo "$(BLUE)════════════════════════════════════════════════════════════$(NC)"

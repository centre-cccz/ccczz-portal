# Docker Setup Guide - CCCZ Portal

## 🚀 Quick Start

### 1. Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

### 2. Configuration

Copy and update environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your secure passwords:

```bash
# Generate secure passwords
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For DB_PASS
openssl rand -base64 32  # For REDIS_PASSWORD
```

### 3. Build & Start Services

```bash
# Build Docker images
docker-compose build

# Start all services (detached mode)
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api      # Next.js API
docker-compose logs -f db       # MySQL Database
docker-compose logs -f cache    # Redis Cache
```

### 4. Verify Services

```bash
# Check running containers
docker-compose ps

# Test API health
curl http://localhost:3000/

# Test Database connection
docker-compose exec db mysql -u ccclezoo_user -p -h db ccclezoo_db

# Test Redis connection
docker-compose exec cache redis-cli -a your_redis_password ping
```

---

## 🛠️ Common Commands

### Start Services

```bash
docker-compose up -d
```

### Stop Services

```bash
docker-compose down
```

### Restart Services

```bash
docker-compose restart

# Specific service
docker-compose restart api
```

### View Logs

```bash
# All services
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Follow specific service
docker-compose logs -f api
```

### Execute Commands in Container

```bash
# Run command in API container
docker-compose exec api npm run build

# MySQL shell
docker-compose exec db mysql -u ccclezoo_user -p ccclezoo_db

# Redis CLI
docker-compose exec cache redis-cli -a password
```

### Database Operations

```bash
# Backup database
docker-compose exec db mysqldump -u ccclezoo_user -p ccclezoo_db > backup.sql

# Restore database
docker-compose exec -T db mysql -u ccclezoo_user -p ccclezoo_db < backup.sql

# Execute SQL file
docker-compose exec db mysql -u ccclezoo_user -p ccclezoo_db < db/init.sql
```

---

## 🔐 Security Best Practices

### 1. Change Default Passwords

- Update `DB_ROOT_PASSWORD`
- Update `DB_PASS`
- Update `REDIS_PASSWORD`
- Update `JWT_SECRET`
- Update `SESSION_SECRET`

### 2. Network Isolation

- Services communicate on isolated Docker network (172.20.0.0/16)
- Only API is exposed on port 3000
- Database on port 3306 (internal only by default)
- Redis on port 6379 (internal only by default)

### 3. Resource Limits

- API: 2 CPU, 2GB RAM
- Database: 1 CPU, 1GB RAM
- Cache: 0.5 CPU, 512MB RAM

### 4. Health Checks

All services have health checks configured

### 5. Non-root User

API runs as `nextjs` user (UID 1001)

---

## 📊 Service Architecture

```
┌─────────────────────────────────────────────────┐
│           Docker Compose Network                │
│         (172.20.0.0/16 - cccz_network)         │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐  ┌──────────────┐            │
│  │  Next.js API │  │   MySQL DB   │            │
│  │  :3000       │  │  :3306       │            │
│  │ (Public)     │  │ (Internal)   │            │
│  └──────────────┘  └──────────────┘            │
│         │                 │                     │
│         └─────────────────┘                     │
│                 │                               │
│         ┌───────▼────────┐                      │
│         │  Redis Cache   │                      │
│         │    :6379       │                      │
│         │ (Internal)     │                      │
│         └────────────────┘                      │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### API not connecting to Database

```bash
# Check DB health
docker-compose ps db

# Check logs
docker-compose logs db

# Test connection
docker-compose exec api nc -zv db 3306
```

### High Memory Usage

```bash
# Check resource usage
docker stats

# Reduce limits in docker-compose.yml
# Under api > deploy > resources > limits
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
```

### Database Won't Start

```bash
# Remove volume and reinitialize
docker-compose down -v
docker-compose up -d db

# Check initialization logs
docker-compose logs db
```

---

## 📈 Production Deployment

For production, use:

- Managed database (AWS RDS, Google Cloud SQL, etc.)
- Managed cache (AWS ElastiCache, etc.)
- Container orchestration (Kubernetes, Docker Swarm, etc.)
- SSL/TLS certificates
- Environment-specific configurations

---

## 🔍 Monitoring

### Logs

```bash
docker-compose logs -f --timestamps
```

### Stats

```bash
docker stats
```

### Health

```bash
docker-compose ps
```

---

**Generated**: February 6, 2026
**Status**: ✅ Production Ready

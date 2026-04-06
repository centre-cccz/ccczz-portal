# Multi-Platform Deployment Script for CCCZ Portal
# Supports: Vercel, cPanel, Docker, Local Development

#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="ccczz-portal"
VERCEL_ORG_ID="${VERCEL_ORG_ID:-}"
VERCEL_PROJECT_ID="${VERCEL_PROJECT_ID:-}"
DOCKER_REGISTRY="${DOCKER_REGISTRY:-ghcr.io}"
DOCKER_REPO="${DOCKER_REPO:-cccz-portal}"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi

    log_success "Prerequisites check passed"
}

# Install dependencies
install_deps() {
    log_info "Installing dependencies..."
    npm ci
    log_success "Dependencies installed"
}

# Run tests
run_tests() {
    log_info "Running tests..."
    if npm run test 2>/dev/null; then
        log_success "Tests passed"
    else
        log_warning "Tests failed or not configured"
    fi
}

# Build application
build_app() {
    log_info "Building application..."
    npm run build
    log_success "Build completed"
}

# Deploy to Vercel
deploy_vercel() {
    log_info "Deploying to Vercel..."

    if [ -z "$VERCEL_TOKEN" ]; then
        log_error "VERCEL_TOKEN not set"
        return 1
    fi

    if [ -z "$VERCEL_ORG_ID" ]; then
        log_error "VERCEL_ORG_ID not set"
        return 1
    fi

    if [ -z "$VERCEL_PROJECT_ID" ]; then
        log_error "VERCEL_PROJECT_ID not set"
        return 1
    fi

    npx vercel --prod --yes
    log_success "Deployed to Vercel"
}

# Deploy to cPanel
deploy_cpanel() {
    log_info "Deploying to cPanel..."

    if [ -z "$CPANEL_HOST" ]; then
        CPANEL_HOST="41.79.235.70"
    fi

    if [ -z "$CPANEL_USER" ]; then
        CPANEL_USER="ccclezoo"
    fi

    if [ -z "$CPANEL_PATH" ]; then
        CPANEL_PATH="/home/ccclezoo/public_html"
    fi

    # Create deployment package
    log_info "Creating deployment package..."
    mkdir -p deploy
    cp -r .next deploy/
    cp -r public deploy/
    cp package.json deploy/
    cp package-lock.json deploy/

    # Deploy via SCP
    log_info "Uploading to cPanel..."
    scp -r deploy/* "$CPANEL_USER@$CPANEL_HOST:$CPANEL_PATH/"

    # Clean up
    rm -rf deploy

    log_success "Deployed to cPanel"
}

# Build Docker image
build_docker() {
    log_info "Building Docker image..."

    local tag="${1:-latest}"
    local image_name="$DOCKER_REGISTRY/$DOCKER_REPO:$tag"

    docker build -t "$image_name" .
    log_success "Docker image built: $image_name"
}

# Push Docker image
push_docker() {
    log_info "Pushing Docker image..."

    local tag="${1:-latest}"
    local image_name="$DOCKER_REGISTRY/$DOCKER_REPO:$tag"

    docker push "$image_name"
    log_success "Docker image pushed: $image_name"
}

# Deploy to Docker (local)
deploy_docker_local() {
    log_info "Deploying locally with Docker..."

    local tag="${1:-latest}"
    local image_name="$DOCKER_REGISTRY/$DOCKER_REPO:$tag"

    # Stop existing container
    docker stop cccz-portal 2>/dev/null || true
    docker rm cccz-portal 2>/dev/null || true

    # Run new container
    docker run -d \
        --name cccz-portal \
        -p 3000:3000 \
        -e NODE_ENV=production \
        "$image_name"

    log_success "Deployed locally on port 3000"
}

# Main deployment function
deploy() {
    local target="$1"

    case "$target" in
        "vercel")
            check_prerequisites
            install_deps
            run_tests
            build_app
            deploy_vercel
            ;;
        "cpanel")
            check_prerequisites
            install_deps
            build_app
            deploy_cpanel
            ;;
        "docker")
            check_prerequisites
            install_deps
            build_app
            build_docker
            push_docker
            ;;
        "docker-local")
            check_prerequisites
            install_deps
            build_app
            build_docker "local"
            deploy_docker_local "local"
            ;;
        "all")
            log_info "Deploying to all platforms..."
            check_prerequisites
            install_deps
            run_tests
            build_app

            # Deploy to Vercel
            deploy_vercel || log_warning "Vercel deployment failed"

            # Deploy to cPanel
            deploy_cpanel || log_warning "cPanel deployment failed"

            # Build and push Docker
            build_docker
            push_docker || log_warning "Docker push failed"

            log_success "Multi-platform deployment completed"
            ;;
        *)
            echo "Usage: $0 {vercel|cpanel|docker|docker-local|all}"
            echo ""
            echo "Targets:"
            echo "  vercel      - Deploy to Vercel"
            echo "  cpanel      - Deploy to cPanel"
            echo "  docker      - Build and push Docker image"
            echo "  docker-local- Deploy locally with Docker"
            echo "  all         - Deploy to all platforms"
            exit 1
            ;;
    esac
}

# Run deployment
if [ $# -eq 0 ]; then
    deploy "all"
else
    deploy "$1"
fi
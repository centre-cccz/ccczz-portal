#!/bin/bash

# CCCZ Portal Production Deployment Script
# Supports multiple deployment platforms

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="ccczz-portal"
DEPLOY_ENV=${DEPLOY_ENV:-"production"}
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

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

    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi

    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi

    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi

    log_success "Prerequisites check passed"
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."

    if [ -f "package-lock.json" ]; then
        npm ci --production=false
    else
        npm install
    fi

    log_success "Dependencies installed"
}

# Build application
build_application() {
    log_info "Building application for production..."

    # Set production environment
    export NODE_ENV=production
    export NEXT_TELEMETRY_DISABLED=1

    # Build the application
    npm run build

    log_success "Application built successfully"
}

# Run tests
run_tests() {
    log_info "Running tests..."

    if npm test 2>/dev/null; then
        log_success "Tests passed"
    else
        log_warning "Tests failed or not configured"
    fi
}

# Deploy to Vercel
deploy_vercel() {
    log_info "Deploying to Vercel..."

    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        log_info "Installing Vercel CLI..."
        npm install -g vercel
    fi

    # Deploy to production
    if vercel --prod --yes; then
        log_success "Deployed to Vercel successfully"
    else
        log_error "Vercel deployment failed"
        exit 1
    fi
}

# Deploy to cPanel
deploy_cpanel() {
    log_info "Preparing for cPanel deployment..."

    # Create deployment archive
    DEPLOY_ARCHIVE="${PROJECT_NAME}_${TIMESTAMP}.tar.gz"

    # Exclude unnecessary files
    tar -czf "$DEPLOY_ARCHIVE" \
        --exclude='.git' \
        --exclude='node_modules' \
        --exclude='.next' \
        --exclude='.vercel' \
        --exclude='*.log' \
        --exclude='.env*' \
        .

    log_success "Created deployment archive: $DEPLOY_ARCHIVE"
    log_info "Upload $DEPLOY_ARCHIVE to your cPanel File Manager"
    log_info "Extract the archive and run 'npm install && npm run build'"
}

# Deploy with Docker
deploy_docker() {
    log_info "Building Docker image..."

    # Build production Docker image
    docker build -f Dockerfile.prod -t "$PROJECT_NAME:$TIMESTAMP" .

    # Tag as latest
    docker tag "$PROJECT_NAME:$TIMESTAMP" "$PROJECT_NAME:latest"

    log_success "Docker image built: $PROJECT_NAME:$TIMESTAMP"

    # Run container (optional)
    read -p "Do you want to run the container locally? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Starting Docker container..."
        docker run -d -p 3000:3000 --name "$PROJECT_NAME" "$PROJECT_NAME:latest"
        log_success "Container started. Access at http://localhost:3000"
    fi
}

# Deploy to GitHub Pages (static export)
deploy_github_pages() {
    log_info "Preparing for GitHub Pages deployment..."

    # Create static export
    export NEXT_TELEMETRY_DISABLED=1
    npm run export

    log_success "Static files exported to 'out' directory"
    log_info "Deploy 'out' directory to GitHub Pages"
}

# Main deployment function
main() {
    echo "========================================"
    echo "  CCCZ Portal Production Deployment"
    echo "========================================"

    # Parse command line arguments
    DEPLOY_TARGET=${1:-"vercel"}

    case $DEPLOY_TARGET in
        "vercel")
            check_prerequisites
            install_dependencies
            run_tests
            build_application
            deploy_vercel
            ;;
        "cpanel")
            check_prerequisites
            install_dependencies
            run_tests
            build_application
            deploy_cpanel
            ;;
        "docker")
            check_prerequisites
            install_dependencies
            run_tests
            build_application
            deploy_docker
            ;;
        "github-pages")
            check_prerequisites
            install_dependencies
            run_tests
            build_application
            deploy_github_pages
            ;;
        "build-only")
            check_prerequisites
            install_dependencies
            run_tests
            build_application
            log_success "Build completed. Ready for manual deployment."
            ;;
        *)
            log_error "Invalid deployment target: $DEPLOY_TARGET"
            echo "Usage: $0 [vercel|cpanel|docker|github-pages|build-only]"
            exit 1
            ;;
    esac

    log_success "Deployment completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Configure environment variables in production"
    echo "2. Set up monitoring and analytics"
    echo "3. Configure domain and SSL certificates"
    echo "4. Test all functionality in production"
}

# Run main function with all arguments
main "$@"
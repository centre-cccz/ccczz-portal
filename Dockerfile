# Multi-stage Dockerfile for Next.js production - Secure & Optimized

# ============================================================================
# STAGE 1: Build Dependencies
# ============================================================================
FROM node:18-alpine AS deps
WORKDIR /app

# Install security updates
RUN apk add --no-cache --update \
    dumb-init \
    curl \
    ca-certificates

# Copy package files
COPY package*.json ./

# Install dependencies (clean cache)
RUN npm ci --production && \
    npm cache clean --force

# ============================================================================
# STAGE 2: Builder
# ============================================================================
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from stage 1
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build Next.js application
RUN npm run build && \
    # Remove dev dependencies
    npm prune --production

# ============================================================================
# STAGE 3: Runtime (Production)
# ============================================================================
FROM node:18-alpine AS runner
WORKDIR /app

# Install security updates and runtime dependencies
RUN apk add --no-cache --update \
    dumb-init \
    curl \
    ca-certificates && \
    # Create non-root user
    addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    # Remove unnecessary packages
    apk del apk-tools

# Set environment to production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy built application and dependencies from builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Install dumb-init as PID 1
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Run as non-root user
USER nextjs

# Start application
CMD ["node", "server.js"]

# Multi-stage Dockerfile for FinCore Bank Application
# Stage 1: Build React UI
# Stage 2: Production Node.js API + Built UI

# ============================================================================
# Stage 1: Build React Frontend
# ============================================================================
FROM node:20-alpine AS ui-builder

WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy client source
COPY client/ ./

# Build React app
RUN npm run build

# ============================================================================
# Stage 2: Production Node.js API
# ============================================================================
FROM node:20-alpine

# Install Python and Java for PySpark pipeline
RUN apk add --no-cache \
    python3 \
    py3-pip \
    openjdk17-jre \
    postgresql-client \
    bash \
    curl

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --only=production

# Copy application source
COPY src/ ./src/
COPY db/ ./db/

# Copy built React UI from Stage 1
COPY --from=ui-builder /app/client/build ./client/build

# Copy pipeline files
COPY pipeline/ ./pipeline/

# Install Python dependencies for pipeline
RUN pip3 install --no-cache-dir -r pipeline/requirements.txt

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Create logs directory
RUN mkdir -p /app/pipeline/logs && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose ports
EXPOSE 3000 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:4000/api/v1/health || exit 1

# Start the application
CMD ["node", "src/server.js"]

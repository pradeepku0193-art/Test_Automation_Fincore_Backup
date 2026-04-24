#!/bin/bash
# FinCore Bank - Unified Application Startup Script (Linux/macOS)
# Starts both Backend API and Frontend UI concurrently

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Icons
ROCKET="🚀"
CHECK="✓"
CROSS="✗"
GEAR="⚙️"
GLOBE="🌐"
DATABASE="🗄️"
WRENCH="🔧"

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  ${ROCKET} FinCore Bank - Application Startup${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}[1/4] ${GEAR} Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}  ${CROSS} Node.js not found. Please install Node.js 20+${NC}"
    exit 1
fi
echo -e "${GREEN}  ${CHECK} Node.js: $(node --version)${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}  ${CROSS} npm not found${NC}"
    exit 1
fi
echo -e "${GREEN}  ${CHECK} npm: $(npm --version)${NC}"

# Setup Backend API
echo ""
echo -e "${YELLOW}[2/4] ${WRENCH} Setting up Backend API...${NC}"
cd app

if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}  Installing backend dependencies...${NC}"
    npm install --silent
fi

if [ ! -f ".env" ]; then
    echo -e "${BLUE}  Creating .env from template...${NC}"
    cp .env.example .env
fi

echo -e "${GREEN}  ${CHECK} Backend ready${NC}"

# Setup Frontend UI
echo ""
echo -e "${YELLOW}[3/4] ${WRENCH} Setting up Frontend UI...${NC}"
cd client

if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}  Installing frontend dependencies...${NC}"
    npm install --silent
fi

if [ ! -f ".env" ]; then
    echo -e "${BLUE}  Creating .env from template...${NC}"
    cp .env.example .env
fi

echo -e "${GREEN}  ${CHECK} Frontend ready${NC}"

cd ../..

# Start services
echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  ${ROCKET} Starting Services${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

echo -e "${GREEN}${GLOBE} Backend API:${NC}      http://localhost:4000/api/v1"
echo -e "${GREEN}${GLOBE} Swagger Docs:${NC}    http://localhost:4000/api/docs"
echo -e "${GREEN}${GLOBE} Frontend UI:${NC}     http://localhost:3000"
echo ""
echo -e "${YELLOW}${DATABASE} Database:${NC}        localhost:5432 (ensure PostgreSQL is running)"
echo ""
echo -e "${BLUE}Press Ctrl+C to stop all services${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Stopping services...${NC}"
    kill $(jobs -p) 2>/dev/null
    echo -e "${GREEN}${CHECK} Services stopped${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start Backend API in background
cd app
echo -e "${CYAN}[Backend API] Starting on port 4000...${NC}"
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start Frontend UI in background
cd client
echo -e "${CYAN}[Frontend UI] Starting on port 3000...${NC}"
npm run dev > ../../logs/frontend.log 2>&1 &
FRONTEND_PID=$!

cd ../..

# Create logs directory if it doesn't exist
mkdir -p logs

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ${CHECK} All services started!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Logs:${NC}"
echo -e "  Backend:  logs/backend.log"
echo -e "  Frontend: logs/frontend.log"
echo ""
echo -e "${YELLOW}Tailing logs (Ctrl+C to stop)...${NC}"
echo ""

# Tail both logs
tail -f logs/backend.log logs/frontend.log

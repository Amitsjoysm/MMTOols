#!/bin/bash

# MarketMindAI - Quick Start Script
# Starts the complete application stack

set -e  # Exit on error

echo "=========================================="
echo "🚀 MarketMindAI Quick Start"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print success
success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Function to print error
error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to print info
info() {
    echo -e "${YELLOW}→${NC} $1"
}

echo "Step 1: Checking PostgreSQL..."
if pg_isready > /dev/null 2>&1; then
    success "PostgreSQL is running"
else
    info "Starting PostgreSQL..."
    pg_ctlcluster 15 main start > /dev/null 2>&1 || {
        error "PostgreSQL not installed. Installing..."
        apt-get update > /dev/null 2>&1
        apt-get install -y postgresql postgresql-contrib > /dev/null 2>&1
        pg_ctlcluster 15 main start > /dev/null 2>&1
    }
    sleep 2
    if pg_isready > /dev/null 2>&1; then
        success "PostgreSQL started"
    else
        error "Failed to start PostgreSQL"
        exit 1
    fi
fi

echo ""
echo "Step 2: Checking Database..."
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw marketmindai; then
    success "Database exists"
else
    info "Creating database..."
    sudo -u postgres psql -c "CREATE DATABASE marketmindai;" > /dev/null 2>&1
    sudo -u postgres psql -c "CREATE USER marketmind WITH PASSWORD 'marketmind_secure_2024';" > /dev/null 2>&1
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE marketmindai TO marketmind;" > /dev/null 2>&1
    sudo -u postgres psql -d marketmindai -c "GRANT ALL ON SCHEMA public TO marketmind;" > /dev/null 2>&1
    success "Database created"
    
    info "Creating tables..."
    cd /app/backend
    python -c "from database import engine; from models import Base; Base.metadata.create_all(engine)" > /dev/null 2>&1
    success "Tables created"
    
    info "Seeding data (this may take a moment)..."
    python seed_data.py --force > /dev/null 2>&1
    success "Data seeded (7 users, 10 tools, 5 blogs)"
    
    info "Adding indexes..."
    python optimize_database.py > /dev/null 2>&1
    success "Database optimized (43 indexes)"
fi

echo ""
echo "Step 3: Checking Services..."
if sudo supervisorctl status backend | grep -q RUNNING; then
    success "Backend is running"
else
    info "Starting backend..."
    sudo supervisorctl start backend > /dev/null 2>&1
    sleep 3
    success "Backend started"
fi

if sudo supervisorctl status frontend | grep -q RUNNING; then
    success "Frontend is running"
else
    info "Starting frontend..."
    sudo supervisorctl start frontend > /dev/null 2>&1
    sleep 3
    success "Frontend started"
fi

echo ""
echo "Step 4: Verifying Application..."
sleep 2

# Check backend health
if curl -s http://localhost:8001/api/health | grep -q "healthy"; then
    success "Backend API is healthy"
else
    error "Backend API is not responding"
    error "Check logs: tail -f /var/log/supervisor/backend.err.log"
    exit 1
fi

# Check frontend
if curl -s http://localhost:3000 | grep -q "<!DOCTYPE html"; then
    success "Frontend is serving pages"
else
    error "Frontend is not responding"
    error "Check logs: tail -f /var/log/supervisor/frontend.err.log"
    exit 1
fi

# Check database data
USER_COUNT=$(sudo -u postgres psql -d marketmindai -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | xargs)
TOOL_COUNT=$(sudo -u postgres psql -d marketmindai -t -c "SELECT COUNT(*) FROM tools;" 2>/dev/null | xargs)
BLOG_COUNT=$(sudo -u postgres psql -d marketmindai -t -c "SELECT COUNT(*) FROM blogs;" 2>/dev/null | xargs)

if [ "$USER_COUNT" -gt 0 ] && [ "$TOOL_COUNT" -gt 0 ]; then
    success "Database has data: $USER_COUNT users, $TOOL_COUNT tools, $BLOG_COUNT blogs"
else
    error "Database is empty or not accessible"
    exit 1
fi

echo ""
echo "=========================================="
echo -e "${GREEN}✓ Application is ready!${NC}"
echo "=========================================="
echo ""
echo "📌 Access URLs:"
echo "   🌐 Frontend:  http://localhost:3000"
echo "   🔌 Backend:   http://localhost:8001"
echo "   📚 API Docs:  http://localhost:8001/docs"
echo ""
echo "🔑 Test Accounts:"
echo "   👤 User:       john.doe@example.com / password123"
echo "   👨‍💼 Admin:      editor@marketmindai.com / editor123"
echo "   👑 SuperAdmin: admin@marketmindai.com / admin123"
echo ""
echo "📊 Service Status:"
sudo supervisorctl status | grep -E "backend|frontend|mongodb"
echo ""
echo "📝 View Logs:"
echo "   Backend:  tail -f /var/log/supervisor/backend.err.log"
echo "   Frontend: tail -f /var/log/supervisor/frontend.err.log"
echo ""
echo "🛠️  Manage Services:"
echo "   Restart:  sudo supervisorctl restart all"
echo "   Stop:     sudo supervisorctl stop all"
echo "   Status:   sudo supervisorctl status"
echo ""
echo "=========================================="

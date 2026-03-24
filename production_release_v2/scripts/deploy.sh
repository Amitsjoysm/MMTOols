#!/bin/bash
# =============================================================================
# MarketMindAI Automated Deployment Script
# Run as: sudo bash deploy.sh
# Tested on: Ubuntu 22.04 LTS / Debian 12
# =============================================================================

set -e  # Exit on any error

DOMAIN=${1:-marketmindai.com}
APP_DIR=/var/www/marketmindai
DB_NAME=marketmindai
DB_USER=marketmind
DB_PASS=$(openssl rand -hex 16)
SECRET_KEY=$(openssl rand -hex 32)

echo "============================================="
echo " MarketMindAI Production Deployment Script"
echo "============================================="
echo "Domain: $DOMAIN"
echo "App Dir: $APP_DIR"
echo ""

# ── Step 1: System updates & dependencies ────────────────────────────────────
echo ">>> [1/10] Installing system dependencies..."
apt-get update -qq
apt-get install -y -qq \
    nginx \
    postgresql postgresql-contrib \
    python3 python3-pip python3-venv \
    nodejs npm \
    certbot python3-certbot-nginx \
    git curl wget unzip \
    build-essential libpq-dev \
    supervisor

# Install yarn
npm install -g yarn --quiet

echo "    ✓ System dependencies installed"

# ── Step 2: Setup PostgreSQL ──────────────────────────────────────────────────
echo ">>> [2/10] Setting up PostgreSQL database..."
service postgresql start || systemctl start postgresql

# Create DB user and database
sudo -u postgres psql <<EOF 2>/dev/null || true
CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';
CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
EOF

echo "    ✓ PostgreSQL configured (DB: ${DB_NAME}, User: ${DB_USER})"

# ── Step 3: Create app directory ─────────────────────────────────────────────
echo ">>> [3/10] Setting up application directory..."
mkdir -p ${APP_DIR}/{backend,frontend,uploads}
mkdir -p ${APP_DIR}/backend/uploads/{logos,blog-images}

# Copy application files
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cp -r ${SCRIPT_DIR}/backend/* ${APP_DIR}/backend/
cp -r ${SCRIPT_DIR}/frontend/dist ${APP_DIR}/frontend/dist
if [ -d "${SCRIPT_DIR}/data_files" ]; then
    cp -r ${SCRIPT_DIR}/data_files ${APP_DIR}/
fi
if [ -d "${SCRIPT_DIR}/images" ]; then
    mkdir -p ${APP_DIR}/frontend/dist/client/images
    cp ${SCRIPT_DIR}/images/*.png ${APP_DIR}/frontend/dist/client/images/ 2>/dev/null || true
    cp ${SCRIPT_DIR}/images/*.ico ${APP_DIR}/frontend/dist/client/ 2>/dev/null || true
fi

echo "    ✓ Application files copied"

# ── Step 4: Configure backend environment ─────────────────────────────────────
echo ">>> [4/10] Configuring backend environment..."
cat > ${APP_DIR}/backend/.env <<EOF
DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}
SECRET_KEY=${SECRET_KEY}
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
GROQ_API_KEY=${GROQ_API_KEY:-YOUR_GROQ_API_KEY_HERE}
CORS_ORIGINS=https://${DOMAIN},https://www.${DOMAIN}
SMTP_HOST=${SMTP_HOST:-smtp.gmail.com}
SMTP_PORT=${SMTP_PORT:-587}
SMTP_USERNAME=${SMTP_USERNAME:-}
SMTP_PASSWORD=${SMTP_PASSWORD:-}
FROM_EMAIL=${FROM_EMAIL:-noreply@${DOMAIN}}
ALLOWED_IPS=
APP_NAME=MarketMindAI
ENVIRONMENT=production
DEBUG=false
EOF
echo "    ✓ Backend .env created"

# ── Step 5: Configure frontend environment ─────────────────────────────────────
echo ">>> [5/10] Configuring frontend environment..."
cat > ${APP_DIR}/frontend/.env <<EOF
PUBLIC_API_URL=https://${DOMAIN}
PUBLIC_SITE_URL=https://${DOMAIN}
BACKEND_URL=http://localhost:8001
PUBLIC_SITE_NAME=MarketMindAI
EOF
echo "    ✓ Frontend .env created"

# ── Step 6: Setup Python virtual environment & install deps ───────────────────
echo ">>> [6/10] Installing Python dependencies..."
python3 -m venv ${APP_DIR}/venv
${APP_DIR}/venv/bin/pip install --quiet --upgrade pip
${APP_DIR}/venv/bin/pip install --quiet -r ${APP_DIR}/backend/requirements.txt
echo "    ✓ Python dependencies installed"

# ── Step 7: Initialize database schema and seed data ─────────────────────────
echo ">>> [7/10] Initializing database and seeding data..."
cd ${APP_DIR}/backend
${APP_DIR}/venv/bin/python -c "from database import engine; from models import Base; Base.metadata.create_all(bind=engine); print('Schema created')"

# Extract blog posts if zip exists
if [ -f "${APP_DIR}/data_files/blog_posts.zip" ]; then
    mkdir -p ${APP_DIR}/data_files/blog_posts
    unzip -q -o ${APP_DIR}/data_files/blog_posts.zip -d ${APP_DIR}/data_files/blog_posts/ 2>/dev/null || true
fi
if [ -f "${APP_DIR}/data_files/images.zip" ]; then
    mkdir -p ${APP_DIR}/data_files/images
    unzip -q -o ${APP_DIR}/data_files/images.zip -d ${APP_DIR}/data_files/images/ 2>/dev/null || true
fi

# Run seed script (in background, it takes ~5-10 mins for 10k+ tools)
echo "    Starting database seeding (runs in background)..."
${APP_DIR}/venv/bin/python ${APP_DIR}/backend/seed_complete.py > /var/log/marketmindai-seed.log 2>&1 &
SEED_PID=$!
echo "    Seed PID: ${SEED_PID} - Check progress: tail -f /var/log/marketmindai-seed.log"

# ── Step 8: Setup systemd services ───────────────────────────────────────────
echo ">>> [8/10] Setting up system services..."
cp ${SCRIPT_DIR}/systemd/marketmindai-backend.service /etc/systemd/system/
cp ${SCRIPT_DIR}/systemd/marketmindai-frontend.service /etc/systemd/system/

# Update paths in service files
sed -i "s|/var/www/marketmindai|${APP_DIR}|g" /etc/systemd/system/marketmindai-backend.service
sed -i "s|/var/www/marketmindai|${APP_DIR}|g" /etc/systemd/system/marketmindai-frontend.service

# Set ownership
chown -R www-data:www-data ${APP_DIR}
find ${APP_DIR}/backend/uploads -type d -exec chmod 775 {} \;

systemctl daemon-reload
systemctl enable marketmindai-backend marketmindai-frontend
systemctl start marketmindai-backend
sleep 3
systemctl start marketmindai-frontend

echo "    ✓ Services started"

# ── Step 9: Configure Nginx ───────────────────────────────────────────────────
echo ">>> [9/10] Configuring Nginx..."
cp ${SCRIPT_DIR}/nginx/marketmindai.conf /etc/nginx/sites-available/${DOMAIN}
sed -i "s/marketmindai.com/${DOMAIN}/g" /etc/nginx/sites-available/${DOMAIN}
ln -sf /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

nginx -t && systemctl reload nginx
echo "    ✓ Nginx configured"

# ── Step 10: SSL Certificate ──────────────────────────────────────────────────
echo ">>> [10/10] Obtaining SSL certificate..."
echo "    Running certbot for ${DOMAIN} and www.${DOMAIN}..."
certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos --email admin@${DOMAIN} 2>/dev/null || {
    echo "    ⚠ SSL setup failed (DNS may not be pointing to this server yet)"
    echo "    Run manually: sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
}

# ── Final Status ──────────────────────────────────────────────────────────────
echo ""
echo "============================================="
echo " Deployment Complete!"
echo "============================================="
echo ""
echo " Site URL:     https://${DOMAIN}"
echo " Backend API:  https://${DOMAIN}/api"
echo " Admin Panel:  https://${DOMAIN}/admin"
echo ""
echo " SuperAdmin Credentials:"
echo "   Email:    superadmin@marketmindai.com"
echo "   Password: SuperAdmin@2024!"
echo ""
echo " Service Status:"
systemctl is-active marketmindai-backend && echo "   Backend:  RUNNING" || echo "   Backend:  FAILED"
systemctl is-active marketmindai-frontend && echo "   Frontend: RUNNING" || echo "   Frontend: FAILED"
nginx -t 2>/dev/null && echo "   Nginx:    OK" || echo "   Nginx:    ERROR"
echo ""
echo " Database: postgresql://localhost:5432/${DB_NAME}"
echo "   DB User: ${DB_USER}"
echo "   DB Pass: ${DB_PASS}"
echo ""
echo " IMPORTANT: Save these credentials securely!"
echo " Seed progress: tail -f /var/log/marketmindai-seed.log"
echo ""
echo " Next Steps:"
echo "   1. Wait for seeding to complete (~10 mins): tail -f /var/log/marketmindai-seed.log"
echo "   2. Update GROQ_API_KEY in: ${APP_DIR}/backend/.env"
echo "   3. Update SMTP settings in: ${APP_DIR}/backend/.env"
echo "   4. Login as SuperAdmin and upload your logo at: /admin"
echo "============================================="

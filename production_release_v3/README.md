# MarketMindAI — Production Deployment Guide

> Full-stack AI Tools Directory: ~10,700 tools, 389 blogs, 582 categories  
> Stack: Astro (SSR) + FastAPI + PostgreSQL + Nginx + Groq AI

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Deploy (Automated)](#quick-deploy-automated)
3. [Manual Step-by-Step Deploy](#manual-step-by-step-deploy)
4. [Post-Deployment Configuration](#post-deployment-configuration)
5. [Updating the Site Logo & Favicon](#updating-the-site-logo--favicon)
6. [AI Features Setup (Groq)](#ai-features-setup-groq)
7. [SuperAdmin Guide](#superadmin-guide)
8. [Maintenance & Backups](#maintenance--backups)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Ubuntu/Debian | 22.04+ / 12+ | Clean VPS recommended |
| RAM | 4 GB minimum | 8 GB recommended |
| Disk | 20 GB minimum | 40 GB recommended |
| CPU | 2 cores minimum | 4 cores recommended |
| Domain | Any domain | DNS A record must point to server IP |
| Node.js | 18+ | Installed by deploy script |
| Python | 3.10+ | Installed by deploy script |

### Recommended VPS Providers
- **DigitalOcean** – Droplet 4GB ($24/mo) — [Link](https://digitalocean.com)
- **Hetzner** – CX21 ($6/mo) — [Link](https://hetzner.com)
- **Vultr** – 4GB RAM ($20/mo) — [Link](https://vultr.com)

---

## Quick Deploy (Automated)

```bash
# 1. Upload this package to your server
scp -r marketmindai-production/ root@YOUR_SERVER_IP:/tmp/

# 2. SSH into your server
ssh root@YOUR_SERVER_IP

# 3. Set your Groq API key (get from https://console.groq.com)
export GROQ_API_KEY=gsk_your_key_here

# 4. Run the deploy script
cd /tmp/marketmindai-production/scripts
sudo bash deploy.sh marketmindai.com

# 5. Watch seed progress
tail -f /var/log/marketmindai-seed.log
```

The script takes ~5 minutes (excluding seeding).

---

## Manual Step-by-Step Deploy

### Step 1: Initial Server Setup

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install dependencies
sudo apt-get install -y \
    nginx postgresql postgresql-contrib \
    python3 python3-pip python3-venv \
    nodejs npm git curl wget unzip \
    build-essential libpq-dev certbot python3-certbot-nginx

# Install Node.js 20 LTS (recommended)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g yarn
```

### Step 2: Setup PostgreSQL

```bash
# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql << 'EOF'
CREATE USER marketmind WITH PASSWORD 'your_secure_password_here';
CREATE DATABASE marketmindai OWNER marketmind;
GRANT ALL PRIVILEGES ON DATABASE marketmindai TO marketmind;
EOF
```

### Step 3: Deploy Application Files

```bash
# Create application directory
sudo mkdir -p /var/www/marketmindai/{backend,frontend,data_files}
sudo mkdir -p /var/www/marketmindai/backend/uploads/{logos,blog-images}

# Copy backend files
sudo cp -r backend/* /var/www/marketmindai/backend/

# Copy frontend built files
sudo cp -r frontend/dist /var/www/marketmindai/frontend/

# Copy logo and favicon images
sudo mkdir -p /var/www/marketmindai/frontend/dist/client/images
sudo cp images/*.png /var/www/marketmindai/frontend/dist/client/images/
sudo cp images/favicon.ico /var/www/marketmindai/frontend/dist/client/

# Copy data files
sudo cp -r data_files/* /var/www/marketmindai/data_files/
```

### Step 4: Configure Backend

```bash
# Create Python virtual environment
cd /var/www/marketmindai
sudo python3 -m venv venv
sudo venv/bin/pip install --upgrade pip
sudo venv/bin/pip install -r backend/requirements.txt

# Create backend .env file
sudo nano /var/www/marketmindai/backend/.env
```

**Paste this into .env (fill in your values):**
```env
DATABASE_URL=postgresql://marketmind:YOUR_DB_PASSWORD@localhost:5432/marketmindai
SECRET_KEY=your-64-char-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
GROQ_API_KEY=gsk_your_groq_key_here
CORS_ORIGINS=https://marketmindai.com,https://www.marketmindai.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@marketmindai.com
ALLOWED_IPS=
ENVIRONMENT=production
DEBUG=false
```

### Step 5: Configure Frontend

```bash
sudo nano /var/www/marketmindai/frontend/.env
```

**Content:**
```env
PUBLIC_API_URL=https://marketmindai.com
PUBLIC_SITE_URL=https://marketmindai.com
BACKEND_URL=http://localhost:8001
```

### Step 6: Initialize Database Schema

```bash
cd /var/www/marketmindai/backend

# Create all tables
sudo /var/www/marketmindai/venv/bin/python -c "
from database import engine
from models import Base
Base.metadata.create_all(bind=engine)
print('All tables created successfully!')
"
```

### Step 7: Seed the Database

```bash
# Extract blog posts first
cd /var/www/marketmindai/data_files
sudo unzip -q blog_posts.zip -d blog_posts/ 2>/dev/null || true
sudo unzip -q images.zip -d images/ 2>/dev/null || true

# Run seed script (takes 5-15 minutes)
cd /var/www/marketmindai/backend
sudo nohup /var/www/marketmindai/venv/bin/python seed_complete.py > /var/log/marketmindai-seed.log 2>&1 &

# Monitor progress
tail -f /var/log/marketmindai-seed.log
```

**Expected output after seeding:**
```
✓ Tools seeded: ~10,700
✓ Blogs seeded: 389
✓ Categories seeded: 582
✓ SuperAdmin created
```

### Step 8: Create System Services

```bash
# Backend service
sudo cp systemd/marketmindai-backend.service /etc/systemd/system/
sudo nano /etc/systemd/system/marketmindai-backend.service
# Update APP_DIR path if different from /var/www/marketmindai

# Frontend service
sudo cp systemd/marketmindai-frontend.service /etc/systemd/system/

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable marketmindai-backend marketmindai-frontend
sudo systemctl start marketmindai-backend
sleep 5
sudo systemctl start marketmindai-frontend

# Verify
sudo systemctl status marketmindai-backend
sudo systemctl status marketmindai-frontend
```

### Step 9: Configure Nginx

```bash
# Copy Nginx config
sudo cp nginx/marketmindai.conf /etc/nginx/sites-available/marketmindai.com
sudo ln -sf /etc/nginx/sites-available/marketmindai.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 10: Setup SSL Certificate

```bash
# Make sure DNS is pointing to your server first!
# Check: nslookup marketmindai.com

sudo certbot --nginx -d marketmindai.com -d www.marketmindai.com

# Auto-renewal is set up automatically
```

---

## Post-Deployment Configuration

### Verify Everything is Working

```bash
# Check all services
sudo systemctl status marketmindai-backend marketmindai-frontend nginx postgresql

# Test backend API
curl https://marketmindai.com/api/health

# Test tool count
curl "https://marketmindai.com/api/tools?limit=1" | python3 -c "import sys,json; print(json.load(sys.stdin))"

# Check logs
sudo journalctl -u marketmindai-backend -f
sudo journalctl -u marketmindai-frontend -f
```

### SuperAdmin Login

1. Go to `https://marketmindai.com/auth/login`
2. Email: `superadmin@marketmindai.com`
3. Password: `SuperAdmin@2024!`
4. **Change password immediately** after first login

---

## Updating the Site Logo & Favicon

### Method 1: Via SuperAdmin Panel (Recommended)

1. Login as SuperAdmin → Go to `/admin`
2. Click **Site Settings** in the sidebar
3. Upload your logo (PNG/SVG, recommended: 300×60px for navbar)
4. The logo **instantly reflects** across:
   - Navbar (all public pages)
   - Footer
   - Login/Register pages
   - Admin dashboard
   - Browser favicon/tab icon
5. No restart required — SSR renders the new logo immediately

### Method 2: Direct File Replacement

```bash
# Replace logo files
sudo cp your-horizontal-logo.png /var/www/marketmindai/frontend/dist/client/images/logo-horizontal.png
sudo cp your-square-logo.png /var/www/marketmindai/frontend/dist/client/images/logo-square.png

# Generate favicon.ico from PNG
python3 -c "
from PIL import Image
img = Image.open('your-square-logo.png')
img.save('/var/www/marketmindai/frontend/dist/client/favicon.ico', format='ICO', sizes=[(16,16),(32,32),(48,48)])
"

# Update database setting
cd /var/www/marketmindai/backend
python3 -c "
from database import SessionLocal
from models import SiteSettings
db = SessionLocal()
setting = db.query(SiteSettings).filter(SiteSettings.key=='site_logo_url').first()
if setting:
    setting.value = '/images/logo-horizontal.png'
    db.commit()
    print('Logo URL updated')
db.close()
"
```

---

## AI Features Setup (Groq)

The AI comparison and recommendation features require a Groq API key.

1. Sign up at [https://console.groq.com](https://console.groq.com)
2. Create an API key
3. Update your backend `.env`:
   ```env
   GROQ_API_KEY=gsk_your_actual_key_here
   ```
4. Restart backend: `sudo systemctl restart marketmindai-backend`

**AI Features available:**
- `/tools/compare` — AI-powered tool comparison with winner declaration
- `/tools/recommend` — AI tool recommender based on user needs

---

## SuperAdmin Guide

### Default Credentials (CHANGE IMMEDIATELY!)
| Field | Value |
|-------|-------|
| Email | superadmin@marketmindai.com |
| Password | SuperAdmin@2024! |
| URL | /auth/login |

### Admin Capabilities

| Feature | Location |
|---------|----------|
| Manage Users | /admin/users |
| Manage Tools (CRUD) | /admin/tools |
| Manage Blogs (CRUD) | /admin/blogs |
| Manage Categories | /admin/categories |
| Bulk Upload Tools (CSV) | /admin/tools → Bulk Upload |
| Assign Tools to Admins | /admin/tools → Assign |
| Update Logo/Favicon | /admin → Site Settings |
| View Analytics | /admin |

### CSV Bulk Upload Format
Download sample: `/sample_tools_upload.csv`

Required columns: `name, description, url, pricing_type, category`  
Optional: `logo_url, features, pros, cons, seo_title, seo_description`

---

## Maintenance & Backups

### Database Backup

```bash
# Backup
pg_dump -U marketmind -h localhost marketmindai | gzip > marketmindai_backup_$(date +%Y%m%d).sql.gz

# Restore
gunzip < marketmindai_backup_YYYYMMDD.sql.gz | psql -U marketmind -h localhost marketmindai
```

### Automated Daily Backup (cron)

```bash
# Edit crontab
crontab -e

# Add this line (backs up at 3 AM daily)
0 3 * * * pg_dump -U marketmind marketmindai | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz 2>&1
```

### Service Management

```bash
# Restart services
sudo systemctl restart marketmindai-backend
sudo systemctl restart marketmindai-frontend

# View logs
sudo journalctl -u marketmindai-backend -n 100
sudo journalctl -u marketmindai-frontend -n 100
sudo tail -f /var/log/nginx/marketmindai.error.log

# Update application (after git pull/new deploy)
sudo systemctl restart marketmindai-backend marketmindai-frontend
```

---

## Troubleshooting

| Problem | Likely Cause | Fix |
|---------|-------------|-----|
| 502 Bad Gateway | Backend not running | `sudo systemctl restart marketmindai-backend` |
| 404 on /api/* | Nginx not routing properly | Check nginx config, `sudo nginx -t` |
| DB connection error | PostgreSQL not running | `sudo systemctl start postgresql` |
| Logo not showing | Wrong logo URL in DB | Update via SuperAdmin panel or direct DB |
| SSL error | Certificate expired | `sudo certbot renew` |
| Seeding failed | Permission/path issue | Check `/var/log/marketmindai-seed.log` |
| AI features not working | Invalid Groq API key | Update `GROQ_API_KEY` in backend `.env` |

### Check Service Health

```bash
# Full health check
curl https://marketmindai.com/api/health | python3 -m json.tool

# Expected response:
# {
#   "status": "healthy",
#   "database": "connected",
#   "scheduler": "running"
# }
```

### Reset SuperAdmin Password

```bash
cd /var/www/marketmindai/backend
python3 -c "
from database import SessionLocal
from models import User
from passlib.context import CryptContext
pwd = CryptContext(schemes=['bcrypt'])
db = SessionLocal()
u = db.query(User).filter(User.email=='superadmin@marketmindai.com').first()
if u:
    u.password_hash = pwd.hash('NewPassword@2024!')
    db.commit()
    print('Password reset!')
db.close()
"
```

---

## Architecture Overview

```
                    Internet
                        │
                    Nginx (443/80)
                        │
           ┌────────────┴────────────┐
           │                         │
    /api/* routes              All other routes
           │                         │
   FastAPI Backend           Astro SSR Frontend
   (127.0.0.1:8001)         (127.0.0.1:4321)
           │
     PostgreSQL DB
     (127.0.0.1:5432)
```

**Data Flow:**
- Public pages (tools, blogs) are SSR-rendered on each request with fresh data
- SEO metadata (H1, JSON-LD, meta tags) injected server-side
- Admin panel uses client-side JS with JWT authentication
- AI features call Groq API server-side (never exposed to browser)

---

*Generated: March 2026 | Version: 1.0.0 | MarketMindAI Production Package*

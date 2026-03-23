# MarketMindAI - aaPanel Deployment Guide

## Architecture Overview
- **Frontend**: Astro.js v5 (SSR mode) — Node.js server on port 3000
- **Backend**: FastAPI (Python) — Uvicorn on port 8001
- **Database**: PostgreSQL 15
- **Web Server**: Nginx (reverse proxy)

---

## 1. Prerequisites on aaPanel Server

```bash
# Install required software in aaPanel:
# - Nginx 1.24+
# - Node.js 20.x (via Node Manager)
# - Python 3.11 (via Python Manager)
# - PostgreSQL 15 (via Database Manager)
```

---

## 2. Database Setup

In aaPanel → Database → PostgreSQL:
```sql
CREATE USER marketmind WITH PASSWORD 'YOUR_SECURE_PASSWORD';
CREATE DATABASE marketmindai OWNER marketmind;
GRANT ALL PRIVILEGES ON DATABASE marketmindai TO marketmind;
```

---

## 3. Backend Deployment

```bash
# Upload backend/ folder to /www/wwwroot/marketmindai/backend/

cd /www/wwwroot/marketmindai/backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env .env.production
# Edit .env.production:
nano .env.production
```

### .env.production content:
```env
ENVIRONMENT=production
DATABASE_URL=postgresql://marketmind:YOUR_PASSWORD@localhost:5432/marketmindai
PRODUCTION_DATABASE_URL=postgresql://marketmind:YOUR_PASSWORD@localhost:5432/marketmindai
SECRET_KEY=YOUR_SECURE_SECRET_KEY_HERE
SUPERADMIN_ALLOWED_IPS=127.0.0.1,YOUR_OFFICE_IP
RATE_LIMIT_REQUESTS_PER_MINUTE=200
MAX_REQUEST_SIZE_MB=10
GROQ_API_KEY=YOUR_GROQ_API_KEY
CORS_ORIGINS=https://marketmindai.com,https://www.marketmindai.com
FRONTEND_URL=https://marketmindai.com
API_URL=https://marketmindai.com
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your@email.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=noreply@marketmindai.com
```

```bash
# Run database migrations & seed data
source venv/bin/activate
python seed_production.py  # Only run once on fresh install!

# Start backend with PM2 or Supervisor
# Using supervisor:
```

### /etc/supervisor/conf.d/marketmindai-backend.conf:
```ini
[program:marketmindai-backend]
command=/www/wwwroot/marketmindai/backend/venv/bin/uvicorn server:app --host 127.0.0.1 --port 8001 --workers 4
directory=/www/wwwroot/marketmindai/backend
autostart=true
autorestart=true
environment=APP_ENV="production"
stderr_logfile=/var/log/supervisor/marketmindai-backend.err.log
stdout_logfile=/var/log/supervisor/marketmindai-backend.out.log
```

---

## 4. Frontend Deployment

```bash
# Upload frontend/ folder to /www/wwwroot/marketmindai/frontend/

cd /www/wwwroot/marketmindai/frontend

# Install dependencies
yarn install --ignore-engines

# Set production environment
echo "PUBLIC_API_URL=https://marketmindai.com
PUBLIC_SITE_URL=https://marketmindai.com" > .env.production

# Build for production
yarn build
```

### Start frontend with PM2:
```bash
# Install PM2
npm install -g pm2

# Start the Astro SSR server
pm2 start dist/server/entry.mjs --name marketmindai-frontend --env production

# Or use the node adapter directly:
node dist/server/entry.mjs
```

### PM2 Ecosystem (pm2.config.js):
```javascript
module.exports = {
  apps: [{
    name: 'marketmindai-frontend',
    script: '/www/wwwroot/marketmindai/frontend/dist/server/entry.mjs',
    env: {
      NODE_ENV: 'production',
      HOST: '127.0.0.1',
      PORT: '3000',
      PUBLIC_API_URL: 'https://marketmindai.com',
      PUBLIC_SITE_URL: 'https://marketmindai.com'
    }
  }]
};
```

---

## 5. Nginx Configuration

In aaPanel → Website → Add Site → marketmindai.com

Then edit Nginx config:

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name marketmindai.com www.marketmindai.com;

    # SSL (configure via aaPanel Let's Encrypt)
    ssl_certificate /www/server/panel/vhost/cert/marketmindai.com/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/marketmindai.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    # Static assets from Astro build
    location /_astro/ {
        alias /www/wwwroot/marketmindai/frontend/dist/client/_astro/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Tool favicons/logos
    location /uploads/ {
        alias /www/wwwroot/marketmindai/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public";
    }

    # API routes → FastAPI backend
    location /api/ {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        client_max_body_size 20M;
    }

    # All other routes → Astro SSR frontend
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }

    # Sitemap & robots
    location = /robots.txt {
        alias /www/wwwroot/marketmindai/frontend/dist/client/robots.txt;
    }

    location = /sitemap-index.xml {
        proxy_pass http://127.0.0.1:3000/sitemap-index.xml;
    }

    location = /sitemap-dynamic.xml {
        proxy_pass http://127.0.0.1:3000/sitemap-dynamic.xml;
    }
}
```

---

## 6. Data Summary (What's Imported)

| Data | Count |
|------|-------|
| AI Tools | 10,687 |
| Categories | 100 parent + 483 sub |
| Blog Posts | 387 |
| Tool Favicons | 10,616 (local) |

### Superadmin Login:
- URL: `https://marketmindai.com/admin`
- Email: `superadmin@marketmindai.com`
- Password: `SuperAdmin@2024!`

**Change this password immediately after first login!**

---

## 7. SEO Features Implemented

### For Each Tool Page (`/tools/{slug}`):
- ✅ **SoftwareApplication** schema with name, description, pricing, rating
- ✅ **FAQPage** schema (from tool FAQs data)
- ✅ **BreadcrumbList** schema
- ✅ **AggregateRating** schema
- ✅ Open Graph meta tags
- ✅ Twitter Card meta tags
- ✅ Canonical URLs

### For Each Blog Page (`/blogs/{slug}`):
- ✅ **Article** schema with author, datePublished, dateModified
- ✅ **FAQPage** schema (extracted from blog content)
- ✅ **BreadcrumbList** schema
- ✅ Open Graph meta tags (og:article)
- ✅ Twitter Card meta tags
- ✅ Canonical URLs

### Global SEO:
- ✅ Dynamic sitemap at `/sitemap-dynamic.xml` (all 10K+ tools + 387 blogs)
- ✅ Static sitemap at `/sitemap-index.xml`
- ✅ `robots.txt` with LLM crawlers allowed (GPTBot, ClaudeBot, Google-Extended)
- ✅ Structured Organization + WebSite schema on every page
- ✅ SSR (Server-Side Rendering) for all tool/blog pages — fully crawlable

---

## 8. SuperAdmin Capabilities

Via `/admin` panel (superadmin login required):

### Tools:
- Edit name, description, URL, pricing, categories
- Edit platform, best_for, free_trial, rating
- Edit SEO title, SEO description, SEO keywords
- Edit FAQs (JSON array) — affects Google FAQ rich results
- Edit Alternatives list
- Override JSON-LD structured data
- Bulk CSV upload
- Activate/Deactivate tools

### Blogs:
- Edit title, content (HTML), excerpt
- Edit SEO title, SEO description, SEO keywords
- Edit JSON-LD (Article + FAQPage schema)
- Publish/Unpublish/Archive

---

## 9. Maintenance Commands

```bash
# Check service status
supervisorctl status

# Restart backend
supervisorctl restart marketmindai-backend

# Restart frontend (via PM2)
pm2 restart marketmindai-frontend

# View backend logs
tail -f /var/log/supervisor/marketmindai-backend.err.log

# Database backup
pg_dump -U marketmind marketmindai > backup_$(date +%Y%m%d).sql
```

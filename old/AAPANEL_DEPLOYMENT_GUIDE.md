# 🚀 MarketMindAI - Complete aaPanel Deployment Guide

## 📋 Overview

This guide will help you deploy the **MarketMindAI** application on aaPanel. The application consists of:
- **Backend**: FastAPI (Python) - runs on port 8001
- **Frontend**: Astro SSR (Node.js) - runs on port 3000
- **Database**: SQLite (or can be upgraded to PostgreSQL/MySQL)

---

## 📂 Understanding the Build Structure

After building the frontend with `npm run build` or `yarn build`, you'll get:

```
/app/frontend/dist/
├── client/          # Static assets (CSS, JS, images, HTML)
│   ├── _astro/     # Compiled CSS and JS files
│   ├── about/      # Static HTML pages
│   ├── admin/      # Admin dashboard pages
│   ├── blog/       # Blog pages
│   ├── index.html  # Homepage
│   └── robots.txt  # SEO file
│
└── server/          # Node.js server for SSR
    ├── entry.mjs   # Main server entry point (START THIS!)
    ├── manifest_*.mjs
    ├── chunks/     # Server-side code chunks
    └── pages/      # Server-side rendered pages
```

**IMPORTANT:**
- **`client/` folder**: Contains static assets that are served by the Node.js server
- **`server/` folder**: Contains the Node.js SSR application (THIS IS WHAT YOU RUN!)
- **You must run**: `node dist/server/entry.mjs` from the frontend directory

---

## 🎯 Prerequisites

Before starting, ensure you have:

1. **aaPanel installed** and accessible
2. **Root or sudo access** to your server
3. **Domain name** pointed to your server IP (optional but recommended)
4. **Basic knowledge** of Linux commands

---

## 📦 Step 1: Install Required Software in aaPanel

### 1.1 Install Python 3.11+ (for Backend)

```bash
# SSH into your server
ssh root@your-server-ip

# Install Python 3.11 (if not already installed)
aaPanel → App Store → Search "Python Project Manager" → Install

# Or via command line:
yum install python3.11 python3.11-pip -y  # CentOS/RHEL
apt install python3.11 python3.11-pip -y  # Ubuntu/Debian
```

### 1.2 Install Node.js 18+ (for Frontend)

```bash
# In aaPanel:
aaPanel → App Store → Search "Node.js" → Install Node.js 18 or 20

# Or via command line:
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -  # CentOS
apt-get install -y nodejs  # Will install Node.js 20
```

### 1.3 Install Nginx (Reverse Proxy)

```bash
# In aaPanel:
aaPanel → App Store → Search "Nginx" → Install
```

### 1.4 Install PM2 (Process Manager for Node.js)

```bash
npm install -g pm2
```

---

## 🔧 Step 2: Prepare Your Application Files

### 2.1 Upload Files to Server

Option A: Using aaPanel File Manager
1. Go to **aaPanel → Files**
2. Navigate to `/www/wwwroot/`
3. Create a new folder: `marketmindai`
4. Upload your entire `/app` directory contents to `/www/wwwroot/marketmindai/`

Option B: Using SCP/SFTP
```bash
# From your local machine
scp -r /app root@your-server-ip:/www/wwwroot/marketmindai/
```

Option C: Using Git
```bash
# SSH into server
cd /www/wwwroot/
git clone https://your-repository-url.git marketmindai
```

Your structure should now be:
```
/www/wwwroot/marketmindai/
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   ├── .env
│   └── ...
└── frontend/
    ├── dist/
    │   ├── client/  # Static assets
    │   └── server/  # Node.js SSR app
    ├── package.json
    ├── .env
    └── ...
```

---

## 🐍 Step 3: Setup Backend (FastAPI)

### 3.1 Navigate to Backend Directory

```bash
cd /www/wwwroot/marketmindai/backend
```

### 3.2 Create Python Virtual Environment

```bash
python3.11 -m venv venv
source venv/bin/activate  # Activate virtual environment
```

### 3.3 Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 3.4 Configure Backend Environment Variables

Edit the `.env` file:
```bash
nano /www/wwwroot/marketmindai/backend/.env
```

Update the following:
```env
ENVIRONMENT=production
DATABASE_URL="sqlite:///./marketmind.db"
SECRET_KEY="your-strong-secret-key-change-this-123456789"
CORS_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
FRONTEND_URL="https://yourdomain.com"
API_URL="https://yourdomain.com/api"

# Email Configuration (if using email features)
SMTP_SERVER="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USERNAME="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
FROM_EMAIL="your-email@gmail.com"

# AI Features (Optional)
GROQ_API_KEY="your-groq-api-key-if-needed"
```

**IMPORTANT:** 
- Change `SECRET_KEY` to a random strong string
- Update `CORS_ORIGINS` with your actual domain
- Update `FRONTEND_URL` with your actual domain

### 3.5 Test Backend Manually (Optional)

```bash
# Still in the backend directory with venv activated
uvicorn server:app --host 0.0.0.0 --port 8001

# Open another terminal and test:
curl http://localhost:8001/docs  # Should show API documentation
# Press Ctrl+C to stop
```

### 3.6 Setup Backend with PM2

```bash
# Create PM2 ecosystem file
cat > /www/wwwroot/marketmindai/backend/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'marketmindai-backend',
    script: 'venv/bin/uvicorn',
    args: 'server:app --host 0.0.0.0 --port 8001 --workers 4',
    cwd: '/www/wwwroot/marketmindai/backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
EOF

# Start backend with PM2
cd /www/wwwroot/marketmindai/backend
pm2 start ecosystem.config.js
pm2 save  # Save PM2 process list
pm2 startup  # Enable PM2 on system startup
```

---

## 🎨 Step 4: Setup Frontend (Astro SSR)

### 4.1 Navigate to Frontend Directory

```bash
cd /www/wwwroot/marketmindai/frontend
```

### 4.2 Install Node.js Dependencies

**IMPORTANT:** If you already have a `dist/` folder from previous build, you can skip the build step!

```bash
# Only if you need to rebuild
npm install  # or yarn install

# Build the application (only if needed)
npm run build  # or yarn build
```

### 4.3 Configure Frontend Environment Variables

Edit the `.env` file:
```bash
nano /www/wwwroot/marketmindai/frontend/.env
```

Update with your production values:
```env
PUBLIC_API_URL=https://yourdomain.com/api
PUBLIC_SITE_URL=https://yourdomain.com
```

**IMPORTANT:**
- `PUBLIC_API_URL` should point to your backend API URL
- Use `/api` path which will be proxied by Nginx to port 8001

### 4.4 Verify the Build Structure

```bash
ls -la /www/wwwroot/marketmindai/frontend/dist/
# You should see:
# - client/ (static assets)
# - server/ (Node.js SSR application)
```

### 4.5 Test Frontend Manually (Optional)

```bash
cd /www/wwwroot/marketmindai/frontend
node dist/server/entry.mjs

# Open another terminal and test:
curl http://localhost:3000  # Should return HTML
# Press Ctrl+C to stop
```

### 4.6 Setup Frontend with PM2

```bash
# Create PM2 ecosystem file
cat > /www/wwwroot/marketmindai/frontend/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'marketmindai-frontend',
    script: 'dist/server/entry.mjs',
    cwd: '/www/wwwroot/marketmindai/frontend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      HOST: '0.0.0.0',
      PORT: 3000,
      NODE_ENV: 'production'
    }
  }]
};
EOF

# Start frontend with PM2
cd /www/wwwroot/marketmindai/frontend
pm2 start ecosystem.config.js
pm2 save  # Save PM2 process list
```

---

## 🌐 Step 5: Configure Nginx Reverse Proxy

### 5.1 Create Nginx Configuration

In aaPanel:
1. Go to **Website** → **Add Site**
2. Enter your domain name (e.g., `yourdomain.com`)
3. Select PHP version: **Static** (we don't need PHP)
4. Create site

### 5.2 Edit Nginx Configuration

Go to **Website** → Find your site → **Settings** → **Configuration File**

Replace the configuration with:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS (after SSL is setup)
    # return 301 https://$server_name$request_uri;
    
    # For now, use HTTP:
    
    # Backend API Proxy
    location /api {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Frontend (Astro SSR)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Error pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # Logs
    access_log  /www/wwwlogs/marketmindai.access.log;
    error_log  /www/wwwlogs/marketmindai.error.log;
}
```

**Important:** Replace `yourdomain.com` with your actual domain!

### 5.3 Test and Reload Nginx

```bash
# Test configuration
nginx -t

# If OK, reload Nginx
nginx -s reload

# Or via aaPanel:
# Website → Settings → Service → Reload Nginx
```

---

## 🔒 Step 6: Setup SSL Certificate (HTTPS)

### 6.1 Using aaPanel SSL Manager

1. Go to **Website** → Find your site → **SSL**
2. Click **Let's Encrypt**
3. Enter your email
4. Check both domain names (with and without www)
5. Click **Apply**

### 6.2 Update Nginx for HTTPS

After SSL is installed, aaPanel will automatically update the configuration. Verify it includes:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;
    
    # ... rest of your configuration (API and Frontend proxies)
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### 6.3 Update Environment Variables for HTTPS

Update backend `.env`:
```env
FRONTEND_URL="https://yourdomain.com"
API_URL="https://yourdomain.com/api"
CORS_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
```

Update frontend `.env`:
```env
PUBLIC_API_URL=https://yourdomain.com/api
PUBLIC_SITE_URL=https://yourdomain.com
```

### 6.4 Restart Services

```bash
pm2 restart all
```

---

## ✅ Step 7: Verify Deployment

### 7.1 Check PM2 Processes

```bash
pm2 list
# Should show both:
# - marketmindai-backend (online)
# - marketmindai-frontend (online)

pm2 logs  # View logs from both services
```

### 7.2 Test Backend API

```bash
curl https://yourdomain.com/api/docs
# Should return API documentation
```

### 7.3 Test Frontend

Open your browser and visit:
- `https://yourdomain.com` - Homepage
- `https://yourdomain.com/admin` - Admin dashboard
- `https://yourdomain.com/blog` - Blog page

### 7.4 Test Login

Use the default credentials:
- **Email:** admin@marketmindai.com
- **Password:** admin123

---

## 🔧 Step 8: Ongoing Maintenance

### 8.1 View Logs

```bash
# PM2 logs
pm2 logs marketmindai-backend
pm2 logs marketmindai-frontend

# Nginx logs
tail -f /www/wwwlogs/marketmindai.access.log
tail -f /www/wwwlogs/marketmindai.error.log
```

### 8.2 Restart Services

```bash
# Restart both
pm2 restart all

# Restart specific service
pm2 restart marketmindai-backend
pm2 restart marketmindai-frontend

# Reload Nginx
nginx -s reload
```

### 8.3 Update Application

```bash
# Pull latest code
cd /www/wwwroot/marketmindai
git pull  # If using git

# Update backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
pm2 restart marketmindai-backend

# Update frontend
cd ../frontend
npm install  # or yarn install
npm run build  # or yarn build
pm2 restart marketmindai-frontend
```

### 8.4 Database Backup

```bash
# Backup SQLite database
cp /www/wwwroot/marketmindai/backend/marketmind.db \
   /www/backup/marketmind_$(date +%Y%m%d).db

# Create automated backup script
cat > /root/backup-marketmind.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/www/backup/marketmind"
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)
cp /www/wwwroot/marketmindai/backend/marketmind.db $BACKUP_DIR/marketmind_$DATE.db
# Keep only last 7 days
find $BACKUP_DIR -name "marketmind_*.db" -mtime +7 -delete
EOF

chmod +x /root/backup-marketmind.sh

# Add to crontab for daily backup at 2 AM
crontab -e
# Add this line:
# 0 2 * * * /root/backup-marketmind.sh
```

---

## 🐛 Troubleshooting

### Issue 1: Backend not starting

```bash
# Check logs
pm2 logs marketmindai-backend

# Common fixes:
# 1. Check Python virtual environment
cd /www/wwwroot/marketmindai/backend
source venv/bin/activate
python --version  # Should be 3.11+

# 2. Reinstall dependencies
pip install -r requirements.txt

# 3. Check database permissions
ls -la marketmind.db
chmod 644 marketmind.db
```

### Issue 2: Frontend not starting

```bash
# Check logs
pm2 logs marketmindai-frontend

# Common fixes:
# 1. Verify dist/ folder exists
ls -la /www/wwwroot/marketmindai/frontend/dist/

# 2. Rebuild if needed
cd /www/wwwroot/marketmindai/frontend
npm run build

# 3. Check Node version
node --version  # Should be 18+
```

### Issue 3: 502 Bad Gateway

```bash
# Check if services are running
pm2 status

# Check Nginx configuration
nginx -t

# Restart everything
pm2 restart all
nginx -s reload
```

### Issue 4: CORS Errors

```bash
# Update backend .env
nano /www/wwwroot/marketmindai/backend/.env

# Ensure CORS_ORIGINS includes your domain:
CORS_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"

# Restart backend
pm2 restart marketmindai-backend
```

### Issue 5: Database Locked Error

```bash
# SQLite doesn't handle high concurrency well
# Solution 1: Restart backend
pm2 restart marketmindai-backend

# Solution 2: Migrate to PostgreSQL (recommended for production)
# Install PostgreSQL via aaPanel
# Update DATABASE_URL in .env
```

---

## 📊 Performance Optimization

### 1. Enable Gzip Compression in Nginx

Add to your Nginx configuration:
```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript 
           application/json application/javascript application/xml+rss 
           application/rss+xml font/truetype font/opentype 
           application/vnd.ms-fontobject image/svg+xml;
```

### 2. Enable Caching

Add to Nginx:
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Increase PM2 Instances

For better performance, use cluster mode:
```bash
# Edit ecosystem.config.js
instances: 'max',  # Use all CPU cores
exec_mode: 'cluster',
```

### 4. Upgrade to PostgreSQL

For production with high traffic:
```bash
# Install PostgreSQL in aaPanel
# Create database
# Update DATABASE_URL in backend/.env
DATABASE_URL="postgresql://user:password@localhost/marketmindai"
```

---

## 🎯 Quick Reference Commands

```bash
# PM2 Management
pm2 list              # List all processes
pm2 restart all       # Restart all services
pm2 stop all          # Stop all services
pm2 logs              # View all logs
pm2 monit             # Monitor resources

# Nginx Management
nginx -t              # Test configuration
nginx -s reload       # Reload configuration
systemctl restart nginx  # Restart Nginx

# Database
sqlite3 /www/wwwroot/marketmindai/backend/marketmind.db  # Access database

# File Permissions
chown -R www:www /www/wwwroot/marketmindai/  # Fix ownership
chmod -R 755 /www/wwwroot/marketmindai/       # Fix permissions
```

---

## 📞 Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs`
2. Check Nginx logs: `tail -f /www/wwwlogs/marketmindai.error.log`
3. Verify all services are running: `pm2 status`
4. Test API directly: `curl http://localhost:8001/docs`
5. Test frontend directly: `curl http://localhost:3000`

---

## 🎉 Congratulations!

Your MarketMindAI application should now be live and accessible at `https://yourdomain.com`!

**Default Login:**
- Email: admin@marketmindai.com
- Password: admin123

**Remember to:**
- ✅ Change default passwords
- ✅ Update SECRET_KEY in .env
- ✅ Setup automated backups
- ✅ Monitor logs regularly
- ✅ Keep dependencies updated

---

**Version:** 1.0
**Last Updated:** January 2026
**Application:** MarketMindAI
**Stack:** FastAPI + Astro SSR + SQLite

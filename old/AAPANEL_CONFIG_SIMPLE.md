# 🔧 aaPanel Hosting Configuration Guide for FastAPI + Astro SSR

## 📋 Overview

Your app has:
- **Backend:** FastAPI (Python) - Port 8001
- **Frontend:** Astro SSR with 2 folders:
  - `client/` - Static assets (auto-served)
  - `server/` - Node.js application (YOU RUN THIS!)

---

## 🎯 SIMPLE ANSWER: What to Configure

### For Backend (FastAPI):
1. ✅ Create Python virtual environment
2. ✅ Install dependencies
3. ✅ Configure `.env` file
4. ✅ Run with PM2

### For Frontend (Astro):
1. ✅ Configure `.env` file
2. ✅ Run `server/entry.mjs` with PM2
3. ✅ **DON'T** touch the `client/` folder - it's auto-served!

### For Nginx:
1. ✅ Proxy `/api/*` → Backend (port 8001)
2. ✅ Proxy `/*` → Frontend (port 3000)

---

## 🐍 BACKEND Configuration (FastAPI)

### Step 1: Upload Files

Upload your entire project to:
```
/www/wwwroot/marketmindai/backend/
```

### Step 2: Create Virtual Environment

```bash
cd /www/wwwroot/marketmindai/backend
python3.11 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables

**Edit:** `/www/wwwroot/marketmindai/backend/.env`

```env
# Environment
ENVIRONMENT=production

# Database
DATABASE_URL="sqlite:///./marketmind.db"
PRODUCTION_DATABASE_URL="sqlite:///./marketmind.db"

# Security - CHANGE THIS!
SECRET_KEY="your-random-secret-key-min-32-characters-long"

# CORS - UPDATE WITH YOUR DOMAIN!
CORS_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"

# URLs - UPDATE WITH YOUR DOMAIN!
FRONTEND_URL="https://yourdomain.com"
API_URL="https://yourdomain.com/api"

# Email (Optional)
SMTP_SERVER="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USERNAME="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
FROM_EMAIL="your-email@gmail.com"

# AI (Optional)
GROQ_API_KEY="your-groq-api-key-if-needed"
```

**MUST CHANGE:**
- ✅ `SECRET_KEY` - Generate random 32+ character string
- ✅ `CORS_ORIGINS` - Your actual domain
- ✅ `FRONTEND_URL` - Your actual domain
- ✅ `API_URL` - Your actual domain + `/api`

### Step 5: Start Backend with PM2

```bash
cd /www/wwwroot/marketmindai/backend

# Start the FastAPI server
pm2 start "venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001 --workers 4" --name marketmindai-backend

# Save PM2 configuration
pm2 save
pm2 startup
```

### Step 6: Test Backend

```bash
curl http://localhost:8001/docs
# Should return API documentation HTML
```

✅ **Backend is DONE!**

---

## 🎨 FRONTEND Configuration (Astro SSR)

### Understanding Your Frontend Structure

After building (`npm run build`), you have:

```
/www/wwwroot/marketmindai/frontend/
├── dist/
│   ├── server/           ← Node.js APP (RUN THIS!)
│   │   └── entry.mjs    ← 🎯 START POINT
│   └── client/           ← Static files (AUTO-SERVED!)
│       ├── _astro/      ← CSS, JS, fonts
│       └── *.html       ← Pre-rendered pages
├── package.json
└── .env
```

### Step 1: Upload Files

Upload your entire frontend to:
```
/www/wwwroot/marketmindai/frontend/
```

**IMPORTANT:** Make sure the `dist/` folder is included with both `server/` and `client/` subfolders!

### Step 2: Configure Environment Variables

**Edit:** `/www/wwwroot/marketmindai/frontend/.env`

```env
# Backend API URL - UPDATE WITH YOUR DOMAIN!
PUBLIC_API_URL=https://yourdomain.com/api

# Frontend Site URL - UPDATE WITH YOUR DOMAIN!
PUBLIC_SITE_URL=https://yourdomain.com
```

**MUST CHANGE:**
- ✅ `PUBLIC_API_URL` - Your domain + `/api` (this connects to backend)
- ✅ `PUBLIC_SITE_URL` - Your actual domain

### Step 3: Start Frontend with PM2

```bash
cd /www/wwwroot/marketmindai/frontend

# Run the Node.js server from server/entry.mjs
pm2 start dist/server/entry.mjs --name marketmindai-frontend \
  -- --host 0.0.0.0 --port 3000

# Or create ecosystem config:
cat > ecosystem.config.js << 'EOF'
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

pm2 start ecosystem.config.js
pm2 save
```

### Step 4: Test Frontend

```bash
curl http://localhost:3000
# Should return HTML homepage
```

✅ **Frontend is DONE!**

---

## 🌐 NGINX Configuration

### In aaPanel:

1. Go to **Website** → **Add Site**
2. Domain: `yourdomain.com`
3. Click **Settings** → **Configuration File**

### Replace with this configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Change to your domain above ↑
    
    # Backend API Routes
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
        
        # CORS headers (already handled by FastAPI, but good to have)
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
        
        # Timeouts for API
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
        
        # Timeout for SSR
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # Logs
    access_log /www/wwwlogs/marketmindai.access.log;
    error_log /www/wwwlogs/marketmindai.error.log;
}
```

### Test and Reload Nginx

```bash
nginx -t
nginx -s reload
```

✅ **Nginx is DONE!**

---

## 🔒 SSL Configuration (HTTPS)

### In aaPanel:

1. Go to **Website** → Your site → **SSL**
2. Click **Let's Encrypt**
3. Enter your email
4. Select both domains (with/without www)
5. Click **Apply**

aaPanel will automatically update your Nginx config to use HTTPS.

### After SSL is installed, update your .env files:

**Backend `.env`:**
```env
CORS_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
FRONTEND_URL="https://yourdomain.com"
API_URL="https://yourdomain.com/api"
```

**Frontend `.env`:**
```env
PUBLIC_API_URL=https://yourdomain.com/api
PUBLIC_SITE_URL=https://yourdomain.com
```

### Restart Services

```bash
pm2 restart all
```

✅ **SSL is DONE!**

---

## 📂 What About client/ and server/ Folders?

### ❌ COMMON MISTAKES:

**DON'T do this:**
```bash
# ❌ WRONG - Don't serve client/ with Nginx
location / {
    root /www/wwwroot/marketmindai/frontend/dist/client;
}

# ❌ WRONG - Don't try to run client/ folder
cd dist/client
python -m http.server 3000

# ❌ WRONG - Don't delete client/ folder
rm -rf dist/client
```

### ✅ CORRECT APPROACH:

**What the folders are:**

```
dist/
├── server/              ← This IS your app
│   └── entry.mjs       ← Run this with Node.js
│
└── client/              ← Static files served BY the server
    ├── _astro/         ← CSS, JS bundles
    └── *.html          ← Pre-rendered pages
```

**What happens when you run `node dist/server/entry.mjs`:**

1. ✅ Starts Node.js web server on port 3000
2. ✅ Automatically serves files from `client/` folder
3. ✅ Handles server-side rendering (SSR)
4. ✅ Manages all routes
5. ✅ Everything works!

**You ONLY need to:**
- ✅ Run: `pm2 start dist/server/entry.mjs`
- ✅ Keep both folders in `dist/`
- ✅ Proxy Nginx to port 3000

**The Node server automatically handles everything else!**

---

## 🎯 Configuration Checklist

### ✅ Backend Configuration

```bash
[ ] Uploaded backend files to /www/wwwroot/marketmindai/backend/
[ ] Created Python virtual environment
[ ] Installed requirements.txt
[ ] Updated .env file:
    [ ] Changed SECRET_KEY
    [ ] Updated CORS_ORIGINS with domain
    [ ] Updated FRONTEND_URL with domain
    [ ] Updated API_URL with domain
[ ] Started with PM2
[ ] Tested: curl http://localhost:8001/docs
```

### ✅ Frontend Configuration

```bash
[ ] Uploaded frontend files to /www/wwwroot/marketmindai/frontend/
[ ] Verified dist/server/ folder exists
[ ] Verified dist/client/ folder exists
[ ] Updated .env file:
    [ ] Updated PUBLIC_API_URL with domain
    [ ] Updated PUBLIC_SITE_URL with domain
[ ] Started with PM2: pm2 start dist/server/entry.mjs
[ ] Tested: curl http://localhost:3000
```

### ✅ Nginx Configuration

```bash
[ ] Created website in aaPanel
[ ] Updated nginx config:
    [ ] /api → http://127.0.0.1:8001
    [ ] / → http://127.0.0.1:3000
    [ ] Updated server_name with domain
[ ] Tested: nginx -t
[ ] Reloaded: nginx -s reload
[ ] Installed SSL certificate
[ ] Updated .env files to use https://
[ ] Restarted services: pm2 restart all
```

---

## 🔍 Quick Verification

### Check Services Running

```bash
pm2 list

# Should show:
# marketmindai-backend    online
# marketmindai-frontend   online
```

### Test Backend

```bash
curl http://localhost:8001/docs
# Returns HTML ✅

curl https://yourdomain.com/api/docs
# Returns HTML ✅
```

### Test Frontend

```bash
curl http://localhost:3000
# Returns HTML ✅

curl https://yourdomain.com
# Returns HTML ✅
```

### Check Logs

```bash
# Backend logs
pm2 logs marketmindai-backend

# Frontend logs
pm2 logs marketmindai-frontend

# Nginx logs
tail -f /www/wwwlogs/marketmindai.error.log
```

---

## 🐛 Troubleshooting Configuration

### Backend not starting?

```bash
# Check logs
pm2 logs marketmindai-backend

# Common issues:
# 1. Virtual environment not activated
cd /www/wwwroot/marketmindai/backend
source venv/bin/activate
pip install -r requirements.txt

# 2. Port already in use
lsof -i :8001
kill -9 <PID>

# 3. Database permissions
chmod 644 marketmind.db
```

### Frontend not starting?

```bash
# Check logs
pm2 logs marketmindai-frontend

# Common issues:
# 1. entry.mjs not found
ls -la dist/server/entry.mjs  # Should exist!

# 2. Node version too old
node --version  # Should be 18+

# 3. Port already in use
lsof -i :3000
kill -9 <PID>
```

### Site not accessible?

```bash
# Check Nginx
nginx -t  # Should pass
systemctl status nginx  # Should be running

# Check firewall
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check DNS
ping yourdomain.com  # Should resolve to your server IP
```

### CORS errors?

```bash
# Update backend .env
nano /www/wwwroot/marketmindai/backend/.env

# Make sure CORS_ORIGINS includes your domain:
CORS_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"

# Restart backend
pm2 restart marketmindai-backend
```

---

## 📝 Summary: Required Changes

### 1️⃣ Backend `.env` Changes:
```env
SECRET_KEY="change-this-to-random-string"          # REQUIRED
CORS_ORIGINS="https://yourdomain.com"              # REQUIRED
FRONTEND_URL="https://yourdomain.com"              # REQUIRED
API_URL="https://yourdomain.com/api"               # REQUIRED
```

### 2️⃣ Frontend `.env` Changes:
```env
PUBLIC_API_URL=https://yourdomain.com/api          # REQUIRED
PUBLIC_SITE_URL=https://yourdomain.com             # REQUIRED
```

### 3️⃣ Nginx Config Changes:
```nginx
server_name yourdomain.com www.yourdomain.com;     # REQUIRED

location /api {
    proxy_pass http://127.0.0.1:8001;              # REQUIRED
}

location / {
    proxy_pass http://127.0.0.1:3000;              # REQUIRED
}
```

### 4️⃣ Run Commands:
```bash
# Backend
pm2 start "venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001"

# Frontend  
pm2 start dist/server/entry.mjs

# Save
pm2 save
```

---

## 🎉 That's It!

**You DON'T need to:**
- ❌ Configure client/ folder separately
- ❌ Set up two different web servers
- ❌ Manually serve static files
- ❌ Do anything special with client/

**You ONLY need to:**
- ✅ Run `server/entry.mjs` with PM2
- ✅ Update `.env` files with your domain
- ✅ Configure Nginx to proxy to ports 8001 and 3000

**The Node.js server handles everything automatically!**

---

**Questions?** 
- The server automatically serves client/ folder
- You never touch or configure client/ directly
- Just run the server and it works! 🚀

**Read more:** `/app/CLIENT_SERVER_EXPLAINED.md` for detailed explanation

# 🎯 Quick Start: aaPanel Deployment Summary

## ✅ System Status - All Services Running!

```
✅ Backend  (Port 8001) - RUNNING
✅ Frontend (Port 3000) - RUNNING  
✅ MongoDB             - RUNNING
✅ Nginx               - RUNNING
```

---

## 📂 Your Application Structure

```
/www/wwwroot/marketmindai/
│
├── 🐍 backend/                    ← Python FastAPI Backend
│   ├── server.py                  → Main API server
│   ├── requirements.txt           → Python dependencies
│   ├── .env                       → Backend config (UPDATE THIS!)
│   ├── venv/                      → Python virtual environment
│   └── marketmind.db             → SQLite database
│
└── 🎨 frontend/                   ← Astro SSR Frontend
    ├── dist/                      → Built application
    │   ├── server/                → Node.js app (RUN THIS!)
    │   │   └── entry.mjs         → 🎯 START POINT!
    │   └── client/                → Static files (auto-served)
    │       ├── _astro/           → CSS, JS bundles
    │       └── *.html            → Pre-rendered pages
    ├── package.json               → Node dependencies
    └── .env                       → Frontend config (UPDATE THIS!)
```

---

## 🚀 The 3-Step Deployment Process

### Step 1️⃣: Setup Backend (Python/FastAPI)

```bash
# Navigate to backend
cd /www/wwwroot/marketmindai/backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Update .env file (IMPORTANT!)
nano .env
# Change: SECRET_KEY, CORS_ORIGINS, FRONTEND_URL

# Start with PM2
pm2 start "venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001" --name backend
pm2 save
```

✅ **Backend Test:** `curl http://localhost:8001/docs`

---

### Step 2️⃣: Setup Frontend (Node.js/Astro)

```bash
# Navigate to frontend
cd /www/wwwroot/marketmindai/frontend

# Update .env file
nano .env
# Change: PUBLIC_API_URL, PUBLIC_SITE_URL

# Start with PM2 (Run the server/entry.mjs file!)
pm2 start dist/server/entry.mjs --name frontend
pm2 save
```

✅ **Frontend Test:** `curl http://localhost:3000`

---

### Step 3️⃣: Configure Nginx Reverse Proxy

```nginx
# In aaPanel: Website → Your Domain → Configuration File

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Backend API (all /api requests)
    location /api {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # Frontend (all other requests)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Test and reload
nginx -t
nginx -s reload
```

✅ **Website Test:** Visit `http://yourdomain.com`

---

## 🎯 THE KEY CONCEPT: Understanding dist/ Folder

After building, Astro creates TWO folders:

```
dist/
├── server/       ← This is your Node.js APPLICATION
│   └── entry.mjs ← RUN THIS FILE! 🎯
│
└── client/       ← These are STATIC ASSETS
    ├── _astro/   ← CSS & JS files
    └── *.html    ← Pre-rendered HTML pages
```

**What happens when you run `node dist/server/entry.mjs`?**

1. Starts a Node.js web server on port 3000
2. Automatically serves static files from `client/` folder
3. Handles dynamic page rendering (SSR)
4. Responds to all HTTP requests

**You DON'T need to:**
- ❌ Run anything from `client/` folder
- ❌ Configure Nginx to serve `client/` directly
- ❌ Copy files from `client/` anywhere

**You ONLY need to:**
- ✅ Run `node dist/server/entry.mjs`
- ✅ Proxy Nginx to port 3000
- ✅ Keep both folders in `dist/`

---

## 📋 Essential PM2 Commands

```bash
# View all processes
pm2 list

# View logs
pm2 logs                    # All logs
pm2 logs backend           # Backend only
pm2 logs frontend          # Frontend only

# Restart services
pm2 restart all            # Restart everything
pm2 restart backend        # Restart backend only
pm2 restart frontend       # Restart frontend only

# Stop services
pm2 stop all               # Stop all
pm2 delete all             # Remove all processes

# Monitor resources
pm2 monit                  # Real-time monitoring

# Save process list (important!)
pm2 save                   # Save current processes
pm2 startup                # Auto-start on boot
```

---

## 🔐 Security Checklist Before Going Live

```bash
# 1. Update Backend .env
cd /www/wwwroot/marketmindai/backend
nano .env
```

Update these:
```env
SECRET_KEY="your-random-secret-key-min-32-chars"  # CHANGE THIS!
CORS_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
FRONTEND_URL="https://yourdomain.com"
API_URL="https://yourdomain.com/api"
```

```bash
# 2. Update Frontend .env
cd /www/wwwroot/marketmindai/frontend
nano .env
```

Update these:
```env
PUBLIC_API_URL=https://yourdomain.com/api
PUBLIC_SITE_URL=https://yourdomain.com
```

```bash
# 3. Change Default Passwords
# Login at: https://yourdomain.com/admin
# Default: admin@marketmindai.com / admin123
# Change this immediately!

# 4. Setup SSL Certificate
# In aaPanel: Website → SSL → Let's Encrypt → Apply

# 5. Restart all services
pm2 restart all
```

---

## 🐛 Quick Troubleshooting

### ❌ Issue: Backend not starting

```bash
# Check logs
pm2 logs backend

# Common fix:
cd /www/wwwroot/marketmindai/backend
source venv/bin/activate
pip install -r requirements.txt
pm2 restart backend
```

### ❌ Issue: Frontend showing errors

```bash
# Check logs
pm2 logs frontend

# Verify build exists:
ls -la dist/server/entry.mjs  # Should exist!
ls -la dist/client/           # Should have files!

# Rebuild if needed:
npm run build  # or: yarn build
pm2 restart frontend
```

### ❌ Issue: 502 Bad Gateway

```bash
# Check if services are running
pm2 status

# All should show "online"
# If not, restart:
pm2 restart all

# Check Nginx
nginx -t
nginx -s reload
```

### ❌ Issue: Can't login / CORS errors

```bash
# Update CORS_ORIGINS in backend .env
nano /www/wwwroot/marketmindai/backend/.env

# Add your domain:
CORS_ORIGINS="https://yourdomain.com,https://www.yourdomain.com,http://localhost:3000"

# Restart backend
pm2 restart backend
```

---

## 📊 Performance Tips

### 1. Use More PM2 Instances (Cluster Mode)

```bash
# Edit backend PM2 config
pm2 delete backend
pm2 start "venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001 --workers 4" --name backend

# For frontend, use cluster mode:
pm2 start dist/server/entry.mjs --name frontend -i max
```

### 2. Enable Nginx Caching

Add to Nginx config:
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Enable Gzip Compression

Add to Nginx config:
```nginx
gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

---

## 📞 Support Checklist

Before asking for help, check:

```bash
# 1. Are services running?
pm2 status
# All should be "online"

# 2. Check logs for errors
pm2 logs

# 3. Test backend directly
curl http://localhost:8001/docs
# Should return HTML

# 4. Test frontend directly
curl http://localhost:3000
# Should return HTML

# 5. Check Nginx config
nginx -t
# Should say "syntax is ok"

# 6. Check firewall
sudo ufw status
# Ports 80 and 443 should be allowed
```

---

## 📚 Full Documentation

For detailed guides, see:

- 📄 **`/app/AAPANEL_DEPLOYMENT_GUIDE.md`** - Complete deployment guide
- 📄 **`/app/CLIENT_SERVER_EXPLAINED.md`** - Understanding client vs server folders
- 📄 **`/app/PRODUCTION_DEPLOYMENT.md`** - General production guide

---

## 🎉 Your Application is Ready!

**Access your app at:** `https://yourdomain.com`

**Default Login:**
- Email: `admin@marketmindai.com`
- Password: `admin123`

**Key URLs:**
- Homepage: `/`
- Admin Dashboard: `/admin`
- Blog: `/blog`
- API Docs: `/api/docs`

---

## 🔄 Updating Your App

```bash
# Pull latest code
cd /www/wwwroot/marketmindai
git pull  # If using git

# Update backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
pm2 restart backend

# Update frontend
cd ../frontend
npm install
npm run build
pm2 restart frontend

# Done!
```

---

**Need Help?** Check logs first: `pm2 logs`

**Questions about client/server folders?** Read `/app/CLIENT_SERVER_EXPLAINED.md`

**Ready to deploy?** Follow `/app/AAPANEL_DEPLOYMENT_GUIDE.md`

---

**Version:** 2.0  
**Last Updated:** January 2026  
**Status:** ✅ Production Ready

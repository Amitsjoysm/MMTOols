# 🔧 Nginx Configuration Changes Required

## ❌ Problem with Your Current Config

Your current Nginx configuration is set up to serve **STATIC Astro files**, but your application uses **Astro SSR (Server-Side Rendering)** which requires a **Node.js server**.

### Current Setup (WRONG):
```nginx
root /www/wwwroot/MarketAutoMailer.mj.publicvm.com;
location / {
    try_files $uri $uri/index.html =404;  # ❌ Serves static files
}
```

This tries to serve files directly from a directory, which won't work for SSR.

### What You Actually Have:
```
/www/wwwroot/marketmindai/frontend/
└── dist/
    ├── server/         ← Node.js app (needs to run on port 3000)
    └── client/         ← Static assets (served BY the Node app)
```

---

## ✅ Required Changes

### Change #1: Frontend Location Block

**REMOVE:**
```nginx
root /www/wwwroot/MarketAutoMailer.mj.publicvm.com;
index index.html index.htm;

location / {
    try_files $uri $uri/index.html =404;
}
```

**REPLACE WITH:**
```nginx
location / {
    proxy_pass http://127.0.0.1:3000;              # Proxy to Node.js server
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # Timeouts for SSR
    proxy_connect_timeout 30s;
    proxy_send_timeout 30s;
    proxy_read_timeout 30s;
}
```

**Why:** Your Astro app runs as a Node.js server on port 3000, not as static files.

---

### Change #2: Backend Port

**CURRENT:**
```nginx
location /api/ {
    proxy_pass http://127.0.0.1:9000/;  # ❌ Wrong port
}
```

**CHANGE TO:**
```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8001/;  # ✅ Correct port for FastAPI
}
```

**Why:** Your FastAPI backend runs on port 8001, not 9000.

---

### Change #3: Remove Static Asset Caching Rules (Optional)

**REMOVE these blocks** (or keep them - they'll still work through the proxy):
```nginx
location /_astro/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
}

location ~* \.(gif|jpg|jpeg|png|bmp|swf|ico|webp|avif)$ {
    expires 30d;
    add_header Cache-Control "public";
    access_log off;
    error_log off;
}

location ~* \.(js|css|woff|woff2|ttf|svg|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
    error_log off;
}
```

**Why:** These rules won't work when proxying to Node.js. The Node server handles these files directly. However, keeping them won't hurt - Nginx just won't match them since everything goes through the proxy.

**Better approach:** Let the Node server handle caching or add caching at the proxy level:
```nginx
# Optional: Cache at proxy level
location /_astro/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_cache_valid 200 1y;
    add_header X-Cache-Status $upstream_cache_status;
}
```

---

## 📋 Complete Corrected Configuration

Here's your complete corrected config:

```nginx
server {
    listen 80;
    server_name marketautomailer.mj.publicvm.com;

    # ---------------------------
    # 🎨 FRONTEND (Astro SSR via Node.js)
    # MAJOR CHANGE: Proxy to Node server, not static files
    # ---------------------------
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
        
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # ---------------------------
    # 🚀 BACKEND (FastAPI)
    # CHANGE: Port 8001 instead of 9000
    # ---------------------------
    location /api/ {
        proxy_pass http://127.0.0.1:8001/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_read_timeout 120s;
    }

    # ---------------------------
    # 🔒 SECURITY
    # ---------------------------
    location ~ ^/(\.user.ini|\.htaccess|\.git|\.env|\.svn|\.project|LICENSE|README.md) {
        return 404;
    }

    location ~ /\.well-known {
        allow all;
    }

    if ($uri ~ "^/\.well-known/.*\.(php|jsp|py|js|css|lua|ts|go|zip|tar\.gz|rar|7z|sql|bak)$") {
        return 403;
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # ---------------------------
    # ⚙️ LOGS
    # ---------------------------
    access_log /www/wwwlogs/marketautomailer.mj.publicvm.com.log;
    error_log  /www/wwwlogs/marketautomailer.mj.publicvm.com.error.log;

    include /www/server/panel/vhost/nginx/extension/marketautomailer.mj.publicvm.com/*.conf;
}
```

---

## 🔍 Key Differences Summary

| Aspect | Current (Wrong) | Required (Correct) |
|--------|----------------|-------------------|
| **Frontend** | Serves static files with `try_files` | Proxies to Node.js on port 3000 |
| **Backend Port** | Port 9000 | Port 8001 |
| **Root Directory** | Has `root` directive | No `root` needed (proxying) |
| **Static Caching** | Direct file caching | Through proxy (optional) |

---

## 🚀 Steps to Apply Changes

### Step 1: Verify Services Are Running

```bash
pm2 list

# Should show:
# marketmindai-backend    online    (port 8001)
# marketmindai-frontend   online    (port 3000)
```

If not running:
```bash
# Start backend
cd /www/wwwroot/marketmindai/backend
pm2 start "venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001" --name marketmindai-backend

# Start frontend
cd /www/wwwroot/marketmindai/frontend
pm2 start dist/server/entry.mjs --name marketmindai-frontend

pm2 save
```

### Step 2: Test Locally First

```bash
# Test backend
curl http://127.0.0.1:8001/docs
# Should return HTML

# Test frontend
curl http://127.0.0.1:3000
# Should return HTML
```

### Step 3: Update Nginx Config

In aaPanel:
1. Go to **Website** → Find your site
2. Click **Settings** → **Configuration File**
3. Replace the entire content with the corrected config above
4. Click **Save**

Or via command line:
```bash
nano /www/server/panel/vhost/nginx/marketautomailer.mj.publicvm.com.conf
# Paste the corrected config
# Save and exit
```

### Step 4: Test Nginx Configuration

```bash
nginx -t

# Should output:
# nginx: the configuration file /www/server/nginx/conf/nginx.conf syntax is ok
# nginx: configuration file /www/server/nginx/conf/nginx.conf test is successful
```

### Step 5: Reload Nginx

```bash
nginx -s reload

# Or via aaPanel:
# Website → Settings → Service → Reload
```

### Step 6: Test Your Site

```bash
# Test via domain
curl http://marketautomailer.mj.publicvm.com
# Should return HTML

# Test API
curl http://marketautomailer.mj.publicvm.com/api/docs
# Should return API docs
```

Open in browser:
- Homepage: `http://marketautomailer.mj.publicvm.com`
- API Docs: `http://marketautomailer.mj.publicvm.com/api/docs`

---

## 🐛 Troubleshooting

### Issue: 502 Bad Gateway

**Cause:** Services not running

**Fix:**
```bash
pm2 list  # Check if services are online
pm2 restart all  # Restart if needed
```

### Issue: "Connection refused"

**Cause:** Wrong ports or services not listening

**Fix:**
```bash
# Check what's running on ports
lsof -i :3000  # Should show node
lsof -i :8001  # Should show python/uvicorn

# If nothing:
pm2 logs  # Check for errors
pm2 restart all
```

### Issue: Static files not loading (CSS/JS missing)

**Cause:** Node server not serving client/ folder properly

**Fix:**
```bash
# Verify dist structure
ls -la /www/wwwroot/marketmindai/frontend/dist/
# Should have both server/ and client/

# Restart frontend
pm2 restart marketmindai-frontend

# Check logs
pm2 logs marketmindai-frontend
```

### Issue: CORS errors

**Cause:** Backend CORS config doesn't include your domain

**Fix:**
```bash
# Edit backend .env
nano /www/wwwroot/marketmindai/backend/.env

# Update CORS_ORIGINS:
CORS_ORIGINS="http://marketautomailer.mj.publicvm.com,https://marketautomailer.mj.publicvm.com"

# Restart backend
pm2 restart marketmindai-backend
```

---

## 📝 Why These Changes Are Needed

### Your Application Architecture:

```
User Request
     ↓
   Nginx (Port 80)
     ↓
     ├──→ /api/* → FastAPI (Port 8001)
     └──→ /*     → Node.js Astro SSR (Port 3000)
                      ↓
                   Serves client/ folder automatically
```

### What Happens:

1. **User visits** `http://marketautomailer.mj.publicvm.com/`
2. **Nginx receives** request on port 80
3. **Nginx proxies** to Node.js on port 3000
4. **Node.js (Astro SSR):**
   - Renders the page server-side
   - Serves static files from `client/` folder
   - Returns complete HTML
5. **Nginx forwards** response to user

### Why Static Serving Doesn't Work:

Your current config tries to serve files from a directory, but:
- ❌ The `client/` folder has pre-rendered HTML but needs SSR for dynamic content
- ❌ Astro SSR requires the Node server to handle routing
- ❌ API calls from frontend to backend won't work without proper proxy
- ❌ Dynamic pages won't render

---

## ✅ After Changes Checklist

```bash
# 1. Services running?
[ ] pm2 list shows both services online

# 2. Nginx config valid?
[ ] nginx -t passes

# 3. Nginx reloaded?
[ ] nginx -s reload executed

# 4. Backend accessible?
[ ] curl http://127.0.0.1:8001/docs works
[ ] curl http://marketautomailer.mj.publicvm.com/api/docs works

# 5. Frontend accessible?
[ ] curl http://127.0.0.1:3000 works
[ ] curl http://marketautomailer.mj.publicvm.com works

# 6. Website loads in browser?
[ ] Homepage displays correctly
[ ] Login works
[ ] Admin panel accessible

# 7. No errors in logs?
[ ] pm2 logs shows no errors
[ ] tail -f /www/wwwlogs/marketautomailer.*.error.log shows no errors
```

---

## 🎉 Summary

**MUST CHANGE:**
1. ✅ Remove `root` and `try_files` - Use proxy instead
2. ✅ Change frontend location to proxy to `http://127.0.0.1:3000`
3. ✅ Change backend location to proxy to `http://127.0.0.1:8001`
4. ✅ Ensure both PM2 services are running

**OPTIONAL:**
1. Remove or keep static caching rules (won't hurt)
2. Add proxy-level caching if needed
3. Add additional security headers

**After changes, your site will work correctly with Astro SSR + FastAPI!** 🚀

---

**Files Created:**
- `/app/NGINX_CONFIG_CORRECTED.conf` - Complete corrected config
- `/app/NGINX_CHANGES_EXPLANATION.md` - This document

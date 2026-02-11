# 🎨 Visual Guide: How Everything Works Together

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        YOUR USERS                                │
│                  (Browser / Mobile / App)                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS/HTTP Request
                         │ (https://yourdomain.com)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      🌐 NGINX REVERSE PROXY                      │
│                         (Port 80/443)                            │
│                                                                  │
│  Rules:                                                          │
│  - /api/*  → Forward to Backend (Port 8001)                    │
│  - /*      → Forward to Frontend (Port 3000)                    │
└────────────┬───────────────────────────────┬────────────────────┘
             │                                │
             │ /api/...                       │ / (everything else)
             ▼                                ▼
┌────────────────────────────┐   ┌──────────────────────────────┐
│  🐍 BACKEND (FastAPI)      │   │  🎨 FRONTEND (Astro SSR)     │
│     Port 8001              │   │     Port 3000                │
│                            │   │                              │
│  What it does:             │   │  What it does:               │
│  ✅ API Endpoints          │   │  ✅ Serves web pages         │
│  ✅ Database operations    │   │  ✅ Server-side rendering    │
│  ✅ Authentication         │   │  ✅ Static file serving      │
│  ✅ Business logic         │   │  ✅ Dynamic routing          │
│                            │   │                              │
│  Runs:                     │   │  Runs:                       │
│  uvicorn server:app        │   │  node dist/server/entry.mjs  │
│                            │   │                              │
│  Files:                    │   │  Files:                      │
│  /backend/                 │   │  /frontend/                  │
│  ├── server.py            │   │  └── dist/                   │
│  ├── .env                 │   │      ├── server/             │
│  ├── requirements.txt     │   │      │   └── entry.mjs ⭐    │
│  └── marketmind.db        │   │      └── client/             │
│                            │   │          ├── _astro/         │
│                            │   │          └── *.html          │
└────────────┬───────────────┘   └───────────┬──────────────────┘
             │                                │
             │                                │
             ▼                                │
┌────────────────────────────┐              │
│   💾 DATABASE (SQLite)     │              │
│      marketmind.db         │              │
│                            │◀──────────────┘
│  Contains:                 │   (Fetches data via API calls
│  - Users                   │    to backend)
│  - Tools                   │
│  - Blogs                   │
│  - SEO data                │
│  - Categories              │
└────────────────────────────┘
```

---

## 🔄 Request Flow Example

### Example 1: User Visits Homepage

```
User types: https://yourdomain.com
                    │
                    ▼
            ┌─────────────┐
            │   Nginx     │ Receives request on port 80/443
            └──────┬──────┘
                   │ Sees "/" path (not /api)
                   │ Routes to Frontend (port 3000)
                   ▼
         ┌──────────────────┐
         │ Frontend Server  │ Receives "/" request
         │ (entry.mjs)      │
         └────────┬─────────┘
                  │
                  ├─→ Loads page from server/pages/
                  ├─→ Renders HTML with SSR
                  ├─→ Includes CSS/JS from client/_astro/
                  │
                  ▼
         ┌──────────────────┐
         │  Generated HTML  │
         │  + CSS + JS      │
         └────────┬─────────┘
                  │
                  ▼
            ┌─────────────┐
            │   Nginx     │ Returns response
            └──────┬──────┘
                   │
                   ▼
            ┌─────────────┐
            │   User's    │ Sees beautiful homepage!
            │   Browser   │
            └─────────────┘
```

### Example 2: User Logs In (API Call)

```
User clicks "Login" button
                    │
                    ▼
    Frontend JavaScript makes API call:
    POST https://yourdomain.com/api/auth/login
                    │
                    ▼
            ┌─────────────┐
            │   Nginx     │ Sees "/api" path
            └──────┬──────┘
                   │ Routes to Backend (port 8001)
                   ▼
         ┌──────────────────┐
         │  Backend API     │ POST /auth/login
         │  (FastAPI)       │
         └────────┬─────────┘
                  │
                  ├─→ Validates credentials
                  ├─→ Queries database
                  │   (SELECT * FROM users WHERE...)
                  │
                  ▼
         ┌──────────────────┐
         │   Database       │ Returns user data
         │   (SQLite)       │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │  Backend API     │ Creates JWT token
         │  (FastAPI)       │ Returns: {token: "...", user: {...}}
         └────────┬─────────┘
                  │
                  ▼
            ┌─────────────┐
            │   Nginx     │ Returns response
            └──────┬──────┘
                   │
                   ▼
         ┌──────────────────┐
         │  Frontend        │ Receives token
         │  JavaScript      │ Stores in localStorage
         └────────┬─────────┘
                  │
                  ▼
            ┌─────────────┐
            │   User's    │ "Login successful!"
            │   Browser   │ Redirected to dashboard
            └─────────────┘
```

---

## 📂 The Mysterious dist/ Folder Explained

When you run `npm run build` or `yarn build` in the frontend:

```
                    ┌─────────────────────┐
                    │   Frontend Source   │
                    │   (src/ folder)     │
                    │                     │
                    │   - App.astro       │
                    │   - pages/*.astro   │
                    │   - components/     │
                    │   - styles/         │
                    └──────────┬──────────┘
                               │
                               │ npm run build
                               │ (Astro compiler)
                               ▼
                    ┌─────────────────────┐
                    │    dist/ folder     │
                    │                     │
                    │   Gets created!     │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
    ┌────────────────────────┐   ┌──────────────────────────┐
    │   server/ folder       │   │    client/ folder        │
    │                        │   │                          │
    │   Node.js Application  │   │    Static Assets         │
    │                        │   │                          │
    │   entry.mjs ⭐         │   │    _astro/               │
    │   (Main server file)   │   │    ├── styles.hash.css   │
    │                        │   │    └── scripts.hash.js   │
    │   manifest.mjs         │   │                          │
    │   (App manifest)       │   │    index.html            │
    │                        │   │    about/index.html      │
    │   pages/               │   │    blog/index.html       │
    │   (SSR handlers)       │   │    robots.txt            │
    │                        │   │                          │
    └────────────┬───────────┘   └────────┬─────────────────┘
                 │                        │
                 │                        │
                 └────────┬───────────────┘
                          │
                          │ How they work together:
                          │
                          ▼
            ┌──────────────────────────────┐
            │  You start: entry.mjs        │
            │                              │
            │  It creates a web server     │
            │  that:                       │
            │                              │
            │  1. Listens on port 3000     │
            │  2. Serves files from        │
            │     client/ folder           │
            │  3. Handles dynamic pages    │
            │     using SSR                │
            │  4. Routes all requests      │
            │                              │
            └──────────────────────────────┘
```

### What Each Folder Contains

```
dist/
│
├── 🖥️ server/              ← THE APPLICATION
│   │
│   ├── entry.mjs          ← 🎯 THIS IS WHAT YOU RUN!
│   │                         • Starts HTTP server
│   │                         • Listens on port 3000
│   │                         • Handles all requests
│   │
│   ├── manifest_*.mjs     ← App configuration
│   │                         • Routes mapping
│   │                         • Asset references
│   │
│   ├── chunks/            ← Server-side code
│   │   ├── index_abc.mjs     • Shared utilities
│   │   └── preload_xyz.mjs   • Code splitting
│   │
│   └── pages/             ← Page handlers
│       ├── index.mjs         • SSR logic for each page
│       ├── about.mjs         • Renders dynamic content
│       └── blog.mjs          • Fetches data
│
└── 📦 client/              ← STATIC ASSETS (Auto-served!)
    │
    ├── _astro/            ← Compiled assets
    │   ├── index.abc123.js   • JavaScript bundles
    │   ├── about.xyz789.js   • Code splitting
    │   ├── styles.hash.css   • Compiled CSS
    │   └── fonts.woff2       • Web fonts
    │
    ├── about/
    │   └── index.html     ← Pre-rendered HTML pages
    │                         (for faster loading)
    │
    ├── blog/
    │   └── index.html
    │
    ├── index.html         ← Homepage HTML
    └── robots.txt         ← SEO files
```

---

## 🎯 What You Actually Do

### ❌ WRONG: Trying to serve client/ folder

```bash
# Some people try this:
cd /www/wwwroot/marketmindai/frontend/dist/client
python -m http.server 3000  # ❌ WRONG!

# Or this:
nginx → root /www/wwwroot/.../dist/client  # ❌ WRONG!

# Why wrong?
# - client/ is just static files
# - No server-side rendering
# - No API calls handling
# - No dynamic routes
# - The app won't work properly!
```

### ✅ CORRECT: Run the Node.js server

```bash
# This is the right way:
cd /www/wwwroot/marketmindai/frontend
node dist/server/entry.mjs  # ✅ CORRECT!

# What happens:
# ✅ Starts Node.js web server on port 3000
# ✅ Automatically serves static files from client/
# ✅ Handles server-side rendering (SSR)
# ✅ Manages dynamic routes
# ✅ Everything works perfectly!
```

---

## 🔌 Port Configuration

```
┌────────────────────────────────────────────┐
│           Internet                         │
│           (Port 80/443)                    │
└───────────────┬────────────────────────────┘
                │
                ▼
┌────────────────────────────────────────────┐
│  Nginx Reverse Proxy                       │
│  Listens: 0.0.0.0:80 and 0.0.0.0:443      │
│                                            │
│  When request comes in:                    │
│  - Check the path                          │
│  - Route to appropriate service            │
└─────┬──────────────────────┬───────────────┘
      │                      │
      │ /api/*              │ /*
      │                      │
      ▼                      ▼
┌─────────────────┐   ┌─────────────────┐
│   Backend       │   │   Frontend      │
│   Port: 8001    │   │   Port: 3000    │
│                 │   │                 │
│   Binds to:     │   │   Binds to:     │
│   127.0.0.1     │   │   127.0.0.1     │
│   (localhost)   │   │   (localhost)   │
│                 │   │                 │
│   Only Nginx    │   │   Only Nginx    │
│   can access!   │   │   can access!   │
└─────────────────┘   └─────────────────┘

Security Note:
- Backend and Frontend bind to localhost (127.0.0.1)
- Not directly accessible from internet
- Only Nginx can proxy to them
- This is secure by design!
```

---

## 🎬 Deployment Timeline

```
Step 1: Upload Files
├── /www/wwwroot/marketmindai/backend/
└── /www/wwwroot/marketmindai/frontend/

Step 2: Setup Backend
├── Create virtual environment
├── Install Python packages
├── Configure .env
└── Start with PM2 → http://localhost:8001 ✅

Step 3: Setup Frontend  
├── Configure .env
└── Start with PM2 → http://localhost:3000 ✅
   (No need to install or build - dist/ already exists!)

Step 4: Configure Nginx
├── Create site in aaPanel
├── Add reverse proxy rules
└── Reload Nginx → http://yourdomain.com ✅

Step 5: Add SSL
├── Install Let's Encrypt certificate
└── Force HTTPS → https://yourdomain.com ✅

Step 6: Test Everything
├── Visit homepage → ✅
├── Try login → ✅
├── Check admin panel → ✅
└── Test API calls → ✅

🎉 DONE! Your app is live!
```

---

## 🧩 How PM2 Manages Everything

```
┌────────────────────────────────────────────────────┐
│                    PM2 Process Manager             │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │  Process: marketmindai-backend              │ │
│  │  Status:  ● online                           │ │
│  │  PID:     12345                              │ │
│  │  CPU:     5%                                 │ │
│  │  Memory:  150MB                              │ │
│  │  Command: venv/bin/uvicorn server:app       │ │
│  │  Port:    8001                               │ │
│  │  Logs:    /root/.pm2/logs/backend-out.log   │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │  Process: marketmindai-frontend             │ │
│  │  Status:  ● online                           │ │
│  │  PID:     12346                              │ │
│  │  CPU:     3%                                 │ │
│  │  Memory:  200MB                              │ │
│  │  Command: node dist/server/entry.mjs        │ │
│  │  Port:    3000                               │ │
│  │  Logs:    /root/.pm2/logs/frontend-out.log  │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  Commands:                                        │
│  - pm2 list      → See all processes             │
│  - pm2 restart   → Restart processes             │
│  - pm2 logs      → View logs                     │
│  - pm2 monit     → Monitor resources             │
└────────────────────────────────────────────────────┘
```

---

## 📝 Final Checklist

```
Before Going Live:

Backend (.env):
  ✅ SECRET_KEY          → Changed to random string
  ✅ CORS_ORIGINS        → Set to your domain
  ✅ FRONTEND_URL        → Set to https://yourdomain.com
  ✅ API_URL             → Set to https://yourdomain.com/api

Frontend (.env):
  ✅ PUBLIC_API_URL      → Set to https://yourdomain.com/api
  ✅ PUBLIC_SITE_URL     → Set to https://yourdomain.com

Services:
  ✅ Backend running     → pm2 list (should show online)
  ✅ Frontend running    → pm2 list (should show online)
  ✅ Nginx configured    → nginx -t (should pass)
  ✅ SSL installed       → Website shows 🔒 in browser

Security:
  ✅ Default passwords changed
  ✅ Firewall configured
  ✅ HTTPS enforced
  ✅ Database backed up

Testing:
  ✅ Homepage loads
  ✅ Login works
  ✅ Admin panel accessible
  ✅ API calls working
  ✅ Blog pages loading

🎉 Ready to launch!
```

---

## 💡 Pro Tips

1. **Always use PM2** for process management (not systemd, not supervisord)
2. **Run `node dist/server/entry.mjs`** for frontend (not anything from client/)
3. **Keep both client/ and server/** folders in dist/ (don't delete either!)
4. **Use Nginx** as reverse proxy (don't expose Node/Python directly)
5. **Backup your database** regularly (especially marketmind.db)
6. **Monitor logs** with `pm2 logs` to catch issues early
7. **Test locally** first before updating production

---

**Questions?** Check the detailed guides:
- `/app/AAPANEL_DEPLOYMENT_GUIDE.md` - Full deployment instructions
- `/app/CLIENT_SERVER_EXPLAINED.md` - Deep dive into dist/ structure
- `/app/QUICK_START_AAPANEL.md` - Quick reference guide

**Need help?** Run: `pm2 logs` to see what's happening!

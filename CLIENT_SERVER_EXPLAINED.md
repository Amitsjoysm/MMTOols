# 🔍 Understanding Client & Server Folders in Astro Build

## ❓ The Confusion: What are `client/` and `server/` folders?

After running `yarn build` or `npm run build` in the frontend directory, you'll see:

```
/app/frontend/dist/
├── client/         ← Static assets (HTML, CSS, JS, images)
└── server/         ← Node.js SSR application (THE MAIN APP!)
```

Many people get confused about which one to use. Let me clarify:

---

## 📂 What is the `client/` folder?

The `client/` folder contains **static assets** that are served to the browser:

```
client/
├── _astro/              # Compiled CSS and JavaScript bundles
│   ├── about.abc123.css
│   ├── index.xyz789.js
│   └── ...
├── about/
│   └── index.html      # Pre-rendered about page
├── admin/
│   └── index.html      # Admin dashboard page
├── blog/
│   └── index.html      # Blog listing page
├── index.html          # Homepage HTML
└── robots.txt          # SEO file
```

**Key Points:**
- Contains **pre-built HTML files** for faster loading
- Contains **CSS/JS bundles** optimized for production
- Contains **images and other static assets**
- **NOT executable on its own** - needs the server to serve it!

**You DO NOT run anything from the `client/` folder directly!**

---

## 🚀 What is the `server/` folder?

The `server/` folder contains the **Node.js application** that powers your Astro SSR site:

```
server/
├── entry.mjs           ← THIS IS WHAT YOU RUN! 🎯
├── manifest_*.mjs      # App manifest
├── chunks/             # Server-side code
│   └── ...
├── pages/              # Server-side page handlers
│   ├── index.mjs
│   ├── about.mjs
│   └── ...
└── renderers.mjs       # Rendering engine
```

**Key Points:**
- **`entry.mjs`** is the main entry point - **THIS IS YOUR APPLICATION!**
- This is a **Node.js server** that runs on port 3000 by default
- It **serves the static files** from the `client/` folder
- It **handles server-side rendering (SSR)** for dynamic pages
- It **handles API routes** if you have any in Astro

**This is what you need to run!**

---

## 🎯 How They Work Together

Think of it like this:

```
┌─────────────────────────────────────────┐
│  User visits: https://yourdomain.com    │
└────────────────┬────────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │  Nginx Proxy  │ (Port 80/443)
         └───────┬───────┘
                 │
                 ▼
    ┌────────────────────────┐
    │  Node Server           │ (Port 3000)
    │  (server/entry.mjs)    │ ← YOU RUN THIS!
    └────────┬───────────────┘
             │
             │ Serves static files ──────┐
             │                            │
             ▼                            ▼
    ┌─────────────────┐         ┌──────────────┐
    │  Dynamic Pages  │         │ Static Files │
    │  (SSR)          │         │ (client/)    │
    │  Rendered by    │         │ HTML/CSS/JS  │
    │  server/pages/  │         │              │
    └─────────────────┘         └──────────────┘
             │                            │
             └──────────┬─────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │  Browser         │
              │  (User sees page)│
              └──────────────────┘
```

**The Flow:**
1. User visits your website
2. Nginx forwards request to Node server (port 3000)
3. Node server (`server/entry.mjs`) processes the request
4. For static files → serves from `client/` folder
5. For dynamic pages → renders using SSR and serves HTML
6. User receives the complete page

---

## 💡 What Do I Do on aaPanel?

### ❌ WRONG Approach:

```bash
# DON'T do this:
cd /www/wwwroot/marketmindai/frontend/dist/client
# There's nothing to run here!

# This won't work:
node client/index.html  # ❌ Can't run HTML files with Node!
```

### ✅ CORRECT Approach:

```bash
# DO this:
cd /www/wwwroot/marketmindai/frontend

# Run the Node server from the server folder:
node dist/server/entry.mjs  # ✅ This starts your application!

# Or with PM2 (recommended):
pm2 start dist/server/entry.mjs --name marketmindai-frontend
```

---

## 🔑 Key Takeaways

| Folder | Purpose | Do You Run It? |
|--------|---------|----------------|
| **`client/`** | Static assets (HTML, CSS, JS, images) | ❌ NO - Just files |
| **`server/`** | Node.js SSR application | ✅ YES - Run `entry.mjs` |

**Remember:**
- The `server/` folder **contains your application**
- The `client/` folder **contains static files served by the application**
- You **only run** `server/entry.mjs`
- The Node server **automatically serves** files from `client/`

---

## 📝 Complete Example for aaPanel

Here's exactly what you need to do:

### Step 1: Navigate to Frontend Directory
```bash
cd /www/wwwroot/marketmindai/frontend
```

### Step 2: Verify Build Exists
```bash
ls -la dist/
# You should see both:
# - client/ 
# - server/

ls -la dist/server/entry.mjs
# This file should exist!
```

### Step 3: Test the Server Manually
```bash
# Set environment variables
export HOST=0.0.0.0
export PORT=3000

# Run the server
node dist/server/entry.mjs

# Open another terminal and test:
curl http://localhost:3000
# You should see HTML output!

# Press Ctrl+C to stop
```

### Step 4: Setup with PM2 (Production)
```bash
# Create PM2 config
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'marketmindai-frontend',
    script: 'dist/server/entry.mjs',
    cwd: '/www/wwwroot/marketmindai/frontend',
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      HOST: '0.0.0.0',
      PORT: 3000,
      NODE_ENV: 'production'
    }
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
```

### Step 5: Configure Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://127.0.0.1:3000;  # Points to Node server
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 6: Access Your Site
```bash
# Your site should now be live at:
http://yourdomain.com

# The Node server (port 3000) will:
# 1. Handle all requests
# 2. Serve static files from client/
# 3. Render dynamic pages using SSR
# 4. Send the complete HTML to users
```

---

## 🔍 Debugging

### Check if Node Server is Running
```bash
pm2 list
# Should show: marketmindai-frontend (online)

pm2 logs marketmindai-frontend
# Should show: Server running on http://0.0.0.0:3000
```

### Test Directly
```bash
# Test the Node server directly:
curl http://localhost:3000
# Should return HTML

# If it works locally but not through domain:
# Check Nginx configuration
nginx -t
nginx -s reload
```

### Common Errors

**Error:** `Cannot find module 'entry.mjs'`
```bash
# Solution: Make sure you're in the correct directory
cd /www/wwwroot/marketmindai/frontend
ls -la dist/server/entry.mjs  # File should exist
```

**Error:** `Port 3000 already in use`
```bash
# Solution: Find and kill the process
lsof -i :3000
kill -9 <PID>

# Or use a different port:
PORT=3001 node dist/server/entry.mjs
```

**Error:** Page shows but no styles/scripts
```bash
# Solution: Check that client/ folder exists
ls -la dist/client/_astro/
# Should contain CSS and JS files

# The Node server needs access to client/ folder
# Make sure the entire dist/ folder is accessible
```

---

## 🎓 Summary

**Q: What do I run on aaPanel?**
**A:** Run `node dist/server/entry.mjs` from the `/www/wwwroot/marketmindai/frontend` directory

**Q: What about the client/ folder?**
**A:** Don't worry about it! The Node server automatically serves those files.

**Q: Do I need to configure anything for client/?**
**A:** No! Just make sure both `client/` and `server/` folders exist in `dist/`. The server handles everything.

**Q: Can I serve client/ with Nginx directly?**
**A:** Not recommended for Astro SSR apps! The `server/` app handles dynamic rendering. If you just serve `client/` with Nginx, dynamic features won't work.

---

**Remember:** 
- **Build produces TWO folders**: `client/` (static assets) + `server/` (Node app)
- **You only RUN**: `server/entry.mjs`
- **The Node server SERVES**: Everything from `client/` automatically
- **Nginx PROXIES**: All traffic to the Node server

**It's that simple!** 🚀

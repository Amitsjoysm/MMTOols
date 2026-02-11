# 🚀 Do I Need to Start Node.js Server Manually?

## 📋 Short Answer:

**No, you don't need to start it manually every time!**

You start it **ONCE** using PM2, and then PM2 manages it automatically forever.

---

## ✅ What You Need to Do (ONE TIME SETUP)

### Step 1: Start the Node.js Server with PM2

```bash
cd /www/wwwroot/marketmindai/frontend

# Start the server with PM2
pm2 start dist/server/entry.mjs --name marketmindai-frontend

# Save the PM2 process list (important!)
pm2 save

# Enable PM2 to start on system boot
pm2 startup
# Follow the command it shows (usually something like):
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
```

**That's it! You're done!** 🎉

---

## 🔄 What Happens After This?

### PM2 Will Automatically:

✅ **Keep the server running** 24/7  
✅ **Restart if it crashes** (automatic recovery)  
✅ **Start on server reboot** (after `pm2 startup`)  
✅ **Monitor CPU and memory usage**  
✅ **Maintain logs** for debugging  

**You never need to start it manually again!**

---

## 🖥️ How to Manage the Server

### View Status
```bash
pm2 list
# Shows all running processes
```

### View Logs
```bash
pm2 logs marketmindai-frontend
# Shows real-time logs

pm2 logs --lines 100
# Shows last 100 lines
```

### Restart Server (if you make changes)
```bash
pm2 restart marketmindai-frontend
# Restarts the Node.js server

# Or restart everything:
pm2 restart all
```

### Stop Server (if needed)
```bash
pm2 stop marketmindai-frontend
# Stops the server (but keeps it in PM2)

pm2 delete marketmindai-frontend
# Removes it from PM2 completely
```

### Monitor Resources
```bash
pm2 monit
# Real-time monitoring dashboard
```

---

## 🎯 Complete Setup Example

Here's the complete one-time setup for both backend and frontend:

```bash
# ================================
# BACKEND (FastAPI)
# ================================
cd /www/wwwroot/marketmindai/backend

# Create virtual environment (if not exists)
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start with PM2
pm2 start "venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001 --workers 4" \
  --name marketmindai-backend

# ================================
# FRONTEND (Node.js Astro SSR)
# ================================
cd /www/wwwroot/marketmindai/frontend

# Start with PM2
pm2 start dist/server/entry.mjs --name marketmindai-frontend

# ================================
# SAVE & ENABLE AUTO-START
# ================================
pm2 save
pm2 startup

# Run the command shown by pm2 startup (example):
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
```

---

## 🔍 How to Verify It's Running

### Check PM2 Status
```bash
pm2 list

# Should show:
┌────┬────────────────────────┬─────────┬─────────┬───────┬────────┐
│ id │ name                   │ status  │ cpu     │ mem   │ uptime │
├────┼────────────────────────┼─────────┼─────────┼───────┼────────┤
│ 0  │ marketmindai-backend   │ online  │ 0%      │ 150MB │ 2h     │
│ 1  │ marketmindai-frontend  │ online  │ 0%      │ 200MB │ 2h     │
└────┴────────────────────────┴─────────┴─────────┴───────┴────────┘
```

### Test the Server Directly
```bash
# Test frontend
curl http://localhost:3000
# Should return HTML

# Test backend
curl http://localhost:8001/docs
# Should return API docs HTML
```

### Test Through Domain
```bash
curl http://yourdomain.com
# Should return HTML
```

---

## 🔄 When Do You Need to Restart?

You only need to restart in these situations:

### 1. After Code Changes
```bash
# If you modify frontend code and rebuild:
cd /www/wwwroot/marketmindai/frontend
npm run build
pm2 restart marketmindai-frontend
```

### 2. After Configuration Changes
```bash
# If you modify .env files:
pm2 restart all
```

### 3. After Installing New Dependencies
```bash
# Backend:
cd /www/wwwroot/marketmindai/backend
source venv/bin/activate
pip install -r requirements.txt
pm2 restart marketmindai-backend

# Frontend:
cd /www/wwwroot/marketmindai/frontend
npm install
pm2 restart marketmindai-frontend
```

### 4. If Something Goes Wrong
```bash
# Check logs first:
pm2 logs

# Then restart:
pm2 restart all
```

**But for normal operation, you don't touch it at all!**

---

## ❌ DON'T Do This (Manual Start)

**Wrong way (manual, won't persist):**
```bash
# ❌ DON'T do this:
cd /www/wwwroot/marketmindai/frontend
node dist/server/entry.mjs
# This runs in foreground, stops when you close terminal
```

**Right way (with PM2, runs forever):**
```bash
# ✅ DO this:
cd /www/wwwroot/marketmindai/frontend
pm2 start dist/server/entry.mjs --name marketmindai-frontend
pm2 save
# Runs in background, survives terminal closure and reboots
```

---

## 🎯 Quick Reference: PM2 Commands

```bash
# View all processes
pm2 list

# View logs
pm2 logs [name]

# Restart specific process
pm2 restart [name]

# Restart all processes
pm2 restart all

# Stop specific process
pm2 stop [name]

# Delete process from PM2
pm2 delete [name]

# Monitor resources
pm2 monit

# Show detailed info
pm2 show [name]

# Save current process list
pm2 save

# Restore saved process list
pm2 resurrect

# Clear logs
pm2 flush
```

---

## 🆘 Troubleshooting

### Server Not Starting?

```bash
# Check if PM2 process exists
pm2 list

# If not listed, start it:
cd /www/wwwroot/marketmindai/frontend
pm2 start dist/server/entry.mjs --name marketmindai-frontend
pm2 save

# If listed but errored, check logs:
pm2 logs marketmindai-frontend

# Common fixes:
# 1. Wrong directory
cd /www/wwwroot/marketmindai/frontend
ls -la dist/server/entry.mjs  # Should exist

# 2. Port already in use
lsof -i :3000
kill -9 <PID>

# 3. Missing dependencies
npm install
```

### Server Stops After Reboot?

```bash
# Enable PM2 startup
pm2 startup

# Run the command it shows (example):
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root

# Save processes
pm2 save

# Test by rebooting:
sudo reboot

# After reboot, check:
pm2 list  # Should show your processes
```

### Server Crashes Frequently?

```bash
# Check logs for errors
pm2 logs marketmindai-frontend --lines 200

# Check memory usage
pm2 list
# If memory is too high, restart:
pm2 restart marketmindai-frontend

# Set max memory restart
pm2 start dist/server/entry.mjs --name marketmindai-frontend \
  --max-memory-restart 500M
pm2 save
```

---

## 📊 PM2 vs Manual Start Comparison

| Feature | Manual Start (`node entry.mjs`) | PM2 Start |
|---------|--------------------------------|-----------|
| **Runs in background** | ❌ No (blocks terminal) | ✅ Yes |
| **Survives terminal close** | ❌ No | ✅ Yes |
| **Auto-restart on crash** | ❌ No | ✅ Yes |
| **Start on system boot** | ❌ No | ✅ Yes (with startup) |
| **Easy log viewing** | ❌ No | ✅ Yes (`pm2 logs`) |
| **Resource monitoring** | ❌ No | ✅ Yes (`pm2 monit`) |
| **Multiple instances** | ❌ Difficult | ✅ Easy |
| **Zero-downtime reload** | ❌ No | ✅ Yes (cluster mode) |

**PM2 is the professional way to run Node.js in production!**

---

## 🎉 Summary

### One-Time Setup:
```bash
# Start both services with PM2
pm2 start dist/server/entry.mjs --name marketmindai-frontend
pm2 start "venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001" --name marketmindai-backend

# Save and enable auto-start
pm2 save
pm2 startup
```

### After That:
- ✅ Servers run automatically forever
- ✅ Auto-restart on crash
- ✅ Auto-start on server reboot
- ✅ You never manually start them again

### You Only Touch Them:
- 🔄 When you deploy new code (`pm2 restart`)
- 📝 When checking logs (`pm2 logs`)
- 🐛 When debugging issues (`pm2 monit`)

**That's it! PM2 does all the heavy lifting!** 🚀

---

## 💡 Pro Tips

1. **Always use PM2 in production** - never run `node` commands directly
2. **Run `pm2 save` after any changes** - saves your process list
3. **Setup `pm2 startup` on new servers** - enables auto-start
4. **Use `pm2 logs` for debugging** - shows real-time logs
5. **Monitor with `pm2 monit`** - catch issues early

**Your Node.js server will now run reliably 24/7 without manual intervention!** ✨

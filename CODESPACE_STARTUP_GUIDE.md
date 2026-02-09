# 🚀 MarketMindAI - Codespace Startup Guide

Complete step-by-step guide to start the MarketMindAI application in GitHub Codespaces or any Linux environment.

---

## 📋 Prerequisites

- Linux environment (Debian/Ubuntu)
- Root or sudo access
- Internet connection

---

## 🔧 STEP 1: Install System Dependencies

### 1.1 Update Package Lists
```bash
apt-get update
```

### 1.2 Install PostgreSQL
```bash
apt-get install -y postgresql postgresql-contrib
```

### 1.3 Verify Installation
```bash
psql --version
# Expected output: psql (PostgreSQL) 15.x
```

---

## 💾 STEP 2: Start PostgreSQL Database

### 2.1 Start PostgreSQL Service
```bash
pg_ctlcluster 15 main start
```

### 2.2 Verify PostgreSQL is Running
```bash
pg_isready
# Expected output: /var/run/postgresql:5432 - accepting connections
```

### 2.3 Check PostgreSQL Status
```bash
ps aux | grep postgres
# Should show multiple postgres processes
```

---

## 🗄️ STEP 3: Create Database and User

### 3.1 Create Database
```bash
sudo -u postgres psql -c "CREATE DATABASE marketmindai;"
```

### 3.2 Create User
```bash
sudo -u postgres psql -c "CREATE USER marketmind WITH PASSWORD 'marketmind_secure_2024';"
```

### 3.3 Grant Permissions
```bash
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE marketmindai TO marketmind;"
sudo -u postgres psql -d marketmindai -c "GRANT ALL ON SCHEMA public TO marketmind;"
```

### 3.4 Verify Database Creation
```bash
sudo -u postgres psql -c "\l" | grep marketmindai
# Should show: marketmindai | marketmind | ...
```

---

## 🐍 STEP 4: Setup Backend (Python/FastAPI)

### 4.1 Navigate to Backend Directory
```bash
cd /app/backend
```

### 4.2 Check Python Version
```bash
python --version
# Expected: Python 3.11.x or higher
```

### 4.3 Install Python Dependencies (if needed)
```bash
pip install -r requirements.txt
```

### 4.4 Create Database Tables
```bash
python -c "from database import engine; from models import Base; Base.metadata.create_all(engine); print('✓ Tables created')"
```

### 4.5 Seed Database with Initial Data
```bash
python seed_data.py --force
```
Expected output:
```
🌱 Starting seed data creation...
✓ 7 users created
✓ 10 categories created
✓ 10 tools created
✓ 5 blogs created
✓ 15 reviews created
```

### 4.6 Add Database Indexes for Performance
```bash
python optimize_database.py
```
Expected output:
```
✓ 43 indexes created
✓ Database optimization complete
```

---

## ⚛️ STEP 5: Setup Frontend (Node/Astro)

### 5.1 Navigate to Frontend Directory
```bash
cd /app/frontend
```

### 5.2 Check Node Version
```bash
node --version
# Expected: v18.x or higher
```

### 5.3 Install Node Dependencies (if needed)
```bash
yarn install
```

---

## 🎯 STEP 6: Start Services with Supervisor

### 6.1 Check Supervisor Configuration
```bash
ls -la /etc/supervisor/conf.d/
# Should show: backend.conf, frontend.conf, mongodb.conf
```

### 6.2 Restart All Services
```bash
sudo supervisorctl restart all
```

Expected output:
```
backend: stopped
frontend: stopped
mongodb: stopped
backend: started
frontend: started
mongodb: started
```

### 6.3 Check Services Status
```bash
sudo supervisorctl status
```

Expected output:
```
backend     RUNNING   pid 1234, uptime 0:00:10
frontend    RUNNING   pid 1235, uptime 0:00:10
mongodb     RUNNING   pid 1236, uptime 0:00:10
```

### 6.4 Alternative: Start Services Individually

**Start Backend:**
```bash
sudo supervisorctl start backend
```

**Start Frontend:**
```bash
sudo supervisorctl start frontend
```

**Start MongoDB (optional):**
```bash
sudo supervisorctl start mongodb
```

---

## ✅ STEP 7: Verify Application is Running

### 7.1 Check Backend Health
```bash
curl -s http://localhost:8001/api/health | jq
```

Expected output:
```json
{
  "status": "healthy",
  "app": "MarketMindAI",
  "version": "2.0.0",
  "timestamp": "2026-02-09T...",
  "details": {
    "api": "healthy",
    "database": "connected",
    "scheduler": "running"
  }
}
```

### 7.2 Check Backend API
```bash
curl -s http://localhost:8001/api/tools | jq 'length'
```
Expected output: `10` (number of tools)

### 7.3 Check Frontend
```bash
curl -s http://localhost:3000 | head -10
```
Should return HTML starting with `<!DOCTYPE html>`

### 7.4 Check PostgreSQL Connection
```bash
sudo -u postgres psql -d marketmindai -c "SELECT COUNT(*) FROM users;"
```
Expected output: `7` (number of users)

---

## 🌐 STEP 8: Access the Application

### 8.1 Open in Browser

**Frontend (Public Site):**
```
http://localhost:3000
```

**Backend API Documentation:**
```
http://localhost:8001/docs
```

### 8.2 Test Login

**Regular User:**
- URL: http://localhost:3000/auth/login
- Email: `john.doe@example.com`
- Password: `password123`

**Admin:**
- URL: http://localhost:3000/admin/login
- Email: `editor@marketmindai.com`
- Password: `editor123`

**SuperAdmin:**
- URL: http://localhost:3000/admin/login
- Email: `admin@marketmindai.com`
- Password: `admin123`
- ⚠️ Only works from localhost

---

## 🔍 STEP 9: Monitor Services

### 9.1 View Backend Logs
```bash
tail -f /var/log/supervisor/backend.err.log
```

### 9.2 View Frontend Logs
```bash
tail -f /var/log/supervisor/frontend.err.log
```

### 9.3 View All Supervisor Logs
```bash
tail -f /var/log/supervisor/*.log
```

### 9.4 Check Service Status Continuously
```bash
watch -n 2 'sudo supervisorctl status'
```

---

## 🛠️ STEP 10: Common Service Management Commands

### 10.1 Restart Services
```bash
# Restart all services
sudo supervisorctl restart all

# Restart individual service
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
```

### 10.2 Stop Services
```bash
# Stop all services
sudo supervisorctl stop all

# Stop individual service
sudo supervisorctl stop backend
sudo supervisorctl stop frontend
```

### 10.3 Start Services
```bash
# Start all services
sudo supervisorctl start all

# Start individual service
sudo supervisorctl start backend
sudo supervisorctl start frontend
```

### 10.4 Reload Supervisor Configuration
```bash
sudo supervisorctl reread
sudo supervisorctl update
```

---

## 🐛 TROUBLESHOOTING

### Issue 1: PostgreSQL Not Running

**Check if PostgreSQL is running:**
```bash
pg_isready
```

**If not running, start it:**
```bash
pg_ctlcluster 15 main start
```

**If PostgreSQL is not installed:**
```bash
apt-get update && apt-get install -y postgresql postgresql-contrib
```

---

### Issue 2: Backend Not Starting

**Check backend logs:**
```bash
tail -n 50 /var/log/supervisor/backend.err.log
```

**Common issues:**

**a) Database connection error:**
```bash
# Verify PostgreSQL is running
pg_isready

# Check database exists
sudo -u postgres psql -c "\l" | grep marketmindai
```

**b) Missing Python packages:**
```bash
cd /app/backend
pip install -r requirements.txt
sudo supervisorctl restart backend
```

**c) Port already in use:**
```bash
# Check what's using port 8001
lsof -i :8001

# Kill the process if needed
kill -9 <PID>
sudo supervisorctl restart backend
```

---

### Issue 3: Frontend Not Starting

**Check frontend logs:**
```bash
tail -n 50 /var/log/supervisor/frontend.err.log
```

**Common issues:**

**a) Node modules missing:**
```bash
cd /app/frontend
yarn install
sudo supervisorctl restart frontend
```

**b) Port already in use:**
```bash
# Check what's using port 3000
lsof -i :3000

# Kill the process if needed
kill -9 <PID>
sudo supervisorctl restart frontend
```

---

### Issue 4: Database Connection Failed

**Test database connection:**
```bash
sudo -u postgres psql -d marketmindai -c "SELECT 1;"
```

**If fails, recreate database:**
```bash
sudo -u postgres psql -c "DROP DATABASE IF EXISTS marketmindai;"
sudo -u postgres psql -c "CREATE DATABASE marketmindai;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE marketmindai TO marketmind;"
sudo -u postgres psql -d marketmindai -c "GRANT ALL ON SCHEMA public TO marketmind;"

# Recreate tables
cd /app/backend
python -c "from database import engine; from models import Base; Base.metadata.create_all(engine)"

# Reseed data
python seed_data.py --force
```

---

### Issue 5: Services Keep Crashing

**Check system resources:**
```bash
# Check memory usage
free -h

# Check disk space
df -h

# Check CPU usage
top
```

**Restart all services:**
```bash
sudo supervisorctl stop all
sleep 5
sudo supervisorctl start all
```

---

## 📊 VERIFICATION CHECKLIST

Run these commands to verify everything is working:

### ✅ Checklist Commands
```bash
# 1. PostgreSQL Running
pg_isready
# ✓ Expected: /var/run/postgresql:5432 - accepting connections

# 2. Database Exists
sudo -u postgres psql -c "\l" | grep marketmindai
# ✓ Expected: marketmindai | marketmind | ...

# 3. Backend Running
curl -s http://localhost:8001/api/health | jq '.status'
# ✓ Expected: "healthy"

# 4. Frontend Running
curl -s http://localhost:3000 | grep "<!DOCTYPE html"
# ✓ Expected: HTML content

# 5. Services Status
sudo supervisorctl status
# ✓ Expected: All RUNNING

# 6. Database Has Data
sudo -u postgres psql -d marketmindai -c "SELECT COUNT(*) FROM users;"
# ✓ Expected: 7

# 7. Tools API Working
curl -s http://localhost:8001/api/tools | jq 'length'
# ✓ Expected: 10

# 8. Blogs API Working
curl -s http://localhost:8001/api/blogs | jq 'length'
# ✓ Expected: 5
```

---

## 🎯 QUICK START (All Commands in Sequence)

For a fresh start, run these commands in order:

```bash
# Step 1: Install PostgreSQL
apt-get update && apt-get install -y postgresql postgresql-contrib

# Step 2: Start PostgreSQL
pg_ctlcluster 15 main start && pg_isready

# Step 3: Create Database
sudo -u postgres psql -c "CREATE DATABASE marketmindai;"
sudo -u postgres psql -c "CREATE USER marketmind WITH PASSWORD 'marketmind_secure_2024';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE marketmindai TO marketmind;"
sudo -u postgres psql -d marketmindai -c "GRANT ALL ON SCHEMA public TO marketmind;"

# Step 4: Setup Backend
cd /app/backend
python -c "from database import engine; from models import Base; Base.metadata.create_all(engine)"
python seed_data.py --force
python optimize_database.py

# Step 5: Restart Services
sudo supervisorctl restart all

# Step 6: Wait for services to start
sleep 10

# Step 7: Verify
sudo supervisorctl status
curl -s http://localhost:8001/api/health | jq
curl -s http://localhost:3000 | head -5

# ✓ Done! Application is running
```

---

## 🔐 SECURITY NOTES

### Environment Variables
Check `.env` files are configured:

**Backend (.env):**
```bash
cat /app/backend/.env
```

Should contain:
```
DATABASE_URL="postgresql://marketmind:marketmind_secure_2024@localhost:5432/marketmindai"
SECRET_KEY="<strong-secret-key>"
SUPERADMIN_ALLOWED_IPS="127.0.0.1,::1,localhost"
```

**Frontend (.env):**
```bash
cat /app/frontend/.env
```

Should contain:
```
PUBLIC_API_URL="http://localhost:8001"
```

---

## 📞 SUPPORT COMMANDS

### Get Application Info
```bash
# Backend version
curl -s http://localhost:8001/api/health | jq '.version'

# Database version
sudo -u postgres psql --version

# Node version
node --version

# Python version
python --version
```

### Check Ports
```bash
# Check if ports are open
netstat -tuln | grep -E '3000|8001|5432'

# Or using lsof
lsof -i :3000  # Frontend
lsof -i :8001  # Backend
lsof -i :5432  # PostgreSQL
```

### System Resources
```bash
# Memory usage
free -h

# Disk usage
df -h /app

# CPU usage
top -bn1 | head -20
```

---

## 🎉 SUCCESS!

If all commands executed successfully, your MarketMindAI application is now running!

**Access URLs:**
- 🌐 Frontend: http://localhost:3000
- 🔌 Backend API: http://localhost:8001
- 📚 API Docs: http://localhost:8001/docs
- 🔄 Alternative Docs: http://localhost:8001/redoc

**Test Accounts:**
- 👤 User: john.doe@example.com / password123
- 👨‍💼 Admin: editor@marketmindai.com / editor123
- 👑 SuperAdmin: admin@marketmindai.com / admin123

---

## 📝 NOTES

- Services are managed by Supervisor
- PostgreSQL must be running for backend to work
- Frontend runs on port 3000, Backend on port 8001
- Logs are in `/var/log/supervisor/`
- Database is PostgreSQL (not SQLite in production)
- All data is seeded automatically

---

**Created:** February 9, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅

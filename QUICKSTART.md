# 🚀 Quick Start Guide - MarketMindAI

## Current Status: ✅ Running & Production Ready

All services are currently running and ready to use!

---

## 🔐 Access the Application

### Admin Dashboard
**URL:** http://localhost:3000/auth/login

**Superadmin Login:**
- Email: `admin@marketmindai.com`
- Password: `admin123`

**Admin Login:**
- Email: `editor@marketmindai.com`
- Password: `editor123`

**Regular User Login:**
- Email: `john.doe@example.com`
- Password: `password123`

### Backend API
**URL:** http://localhost:8001
**API Docs:** http://localhost:8001/docs
**Health Check:** http://localhost:8001/api/health

---

## 🎯 What You Can Do Now

### As Superadmin (admin@marketmindai.com)

1. **Manage Tools**
   - Navigate to: Dashboard → Tools
   - Add, edit, delete tools
   - Manage categories and pricing

2. **Manage Blogs**
   - Navigate to: Dashboard → Blogs
   - Create, edit, publish blogs
   - Moderate user content

3. **Manage Users**
   - Navigate to: Dashboard → Users
   - Create new users
   - Assign roles (user, admin, superadmin)
   - Manage user status

4. **SEO Management**
   - Navigate to: Dashboard → SEO
   - View SEO health score (currently 31.3%)
   - Generate JSON-LD for content
   - Analyze and fix SEO issues

5. **Categories & Free Tools**
   - Manage tool categories
   - Add free tools to the directory

---

## 📊 Current Database Content

The database is pre-loaded with:
- 👥 **7 Users** (1 superadmin, 1 admin, 5 regular users)
- 🔧 **11 Tools** (ChatGPT, Notion, Figma, Slack, and more)
- 📝 **5 Blogs** (AI trends, productivity, design systems, etc.)
- 📁 **10 Categories** (AI, Productivity, Marketing, Design, etc.)
- ⭐ **15 Reviews**
- 📧 **5 Newsletter Subscribers**
- 🆓 **3 Free Tools**

---

## 🛠️ Service Management

### Check Service Status
```bash
sudo supervisorctl status
```

### Restart All Services
```bash
sudo supervisorctl restart all
```

### Restart Individual Services
```bash
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
```

### View Logs
```bash
# Backend logs
tail -f /var/log/supervisor/backend.*.log

# Frontend logs  
tail -f /var/log/supervisor/frontend.*.log

# Or all logs
tail -f /var/log/supervisor/*.log
```

---

## 🧪 Testing the Application

### Test Backend API
```bash
# Health check
curl http://localhost:8001/api/health

# Login test
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@marketmindai.com", "password": "admin123"}'

# Get tools (requires auth token from login)
curl http://localhost:8001/api/tools
```

### Test Frontend
1. Open browser: http://localhost:3000
2. Navigate to: http://localhost:3000/auth/login
3. Login with any credentials above
4. Explore the admin dashboard

---

## 🔄 Resetting the Database

If you need to reset the database:

```bash
cd /app/backend
rm marketmind.db
python seed_data.py --force
sudo supervisorctl restart backend
```

---

## 📦 Production Build Location

**Frontend Build:**
- Location: `/app/frontend/dist/`
- Size: 6.5MB
- Status: ✅ Ready for deployment

**Backend:**
- Location: `/app/backend/`
- Database: `/app/backend/marketmind.db`
- Status: ✅ Ready for deployment

---

## 🚀 Next Steps for Production

1. **Security First**
   ```bash
   # Change SECRET_KEY in /app/backend/.env
   # Update CORS_ORIGINS for your domain
   # Change all default passwords
   ```

2. **Configure Domain**
   - Update `FRONTEND_URL` in backend/.env
   - Update `PUBLIC_API_URL` in frontend/.env
   - Set up SSL/TLS certificates

3. **Database Migration (Recommended)**
   - Move from SQLite to PostgreSQL
   - Update `DATABASE_URL` in backend/.env

4. **Deploy**
   - Use Docker containers (recommended)
   - Or deploy to your preferred hosting platform
   - See `PRODUCTION_DEPLOYMENT.md` for detailed instructions

---

## 💡 Useful Links

- **Production Guide:** `/app/PRODUCTION_DEPLOYMENT.md`
- **Readiness Report:** `/app/PRODUCTION_READINESS_REPORT.md`
- **Backend Code:** `/app/backend/`
- **Frontend Code:** `/app/frontend/`
- **Database:** `/app/backend/marketmind.db`

---

## 🆘 Common Issues

### Issue: Can't login
**Solution:** 
- Check backend is running: `curl http://localhost:8001/api/health`
- Verify credentials are correct
- Check browser console for errors

### Issue: Page not loading
**Solution:**
- Check frontend is running: `sudo supervisorctl status frontend`
- Clear browser cache
- Check browser console for errors

### Issue: API errors
**Solution:**
- Check backend logs: `tail -f /var/log/supervisor/backend.*.log`
- Verify database exists: `ls -la /app/backend/marketmind.db`
- Restart backend: `sudo supervisorctl restart backend`

---

## 📞 Need Help?

1. Check the logs (see Service Management section above)
2. Review `/app/PRODUCTION_DEPLOYMENT.md` for detailed guidance
3. Check `/app/PRODUCTION_READINESS_REPORT.md` for test results

---

**Application Version:** 2.0.0
**Status:** ✅ Production Ready
**Last Updated:** January 26, 2026

**Happy Building! 🚀**

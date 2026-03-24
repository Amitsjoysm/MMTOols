# MarketMindAI - Product Requirements Document

## Original Problem Statement
Build a full-featured web application named "MarketMindAI" - a comprehensive directory for discovering, comparing, and reviewing AI tools and business solutions.

## Core Requirements
1. **Public Pages:** All published blogs and tools should have publicly accessible pages.
2. **User Authentication:** Users must be able to Sign in, Sign up, and use forgot/reset password functionalities.
3. **User Features:** Authenticated users should be able to:
   - Create, manage, and publish their own blogs with SEO and JSON-LD generation.
   - Compare up to 5 tools.
   - Access an AI tools comparison/recommender.
   - Rate, review, and like tools and blogs.
4. **Admin Features:** Users with an 'admin' role should be able to claim listed tools from a pending queue and manage their content pages.
5. **SuperAdmin Features:** Users with a 'superadmin' role should have full CRUD capabilities over Users, Roles, Tools, Blogs, and Categories. **They can also manage site branding including logo.**
6. **Access Control:** All pages, except for public tool/blog listings, should require authentication. SuperAdmin access must be restricted by IP.
7. **Scalability:** The application should be designed to handle up to 2 million users.

## Technical Stack
- **Frontend:** Astro (with React), Tailwind CSS, Shadcn/UI components
- **Backend:** FastAPI, Python
- **Database:** PostgreSQL (migrated from SQLite)
- **ORM:** SQLAlchemy
- **Authentication:** JWT with Role-Based Access Control (RBAC)

## Key Data Models
- **users:** {id, email, hashed_password, full_name, role, is_active}
- **tools:** {id, name, slug, claim_status, claimed_by_id}
- **blogs:** {id, title, slug, content, author_id, is_published, json_ld}
- **reviews:** {id, tool_id, blog_id, user_id, rating, comment}
- **likes:** {id, tool_id, blog_id, user_id}
- **site_settings:** {id, key, value, description} - For logo and branding

## What's Been Implemented (as of March 2026)

### Completed Features
- [x] Database Migration: Migrated from SQLite to PostgreSQL
- [x] SuperAdmin IP Whitelisting: Middleware to restrict SuperAdmin access by IP
- [x] Tool Claiming Feature: Full backend API and frontend admin UI
- [x] Security Hardening: Strong SECRET_KEY, rate limiting, security headers
- [x] Database Optimization: Added necessary indexes for query performance
- [x] Separated Auth Flows: Distinct frontend pages for user and admin authentication
- [x] User Blog Management: Complete backend API and frontend UI for user blogs with JSON-LD generation
- [x] **Access Control Fixes**
- [x] **Branding Update**
- [x] **Data Seeding (March 2026):** 10,687 tools, 389 blogs, 582 categories via `seed_complete.py`
- [x] **SuperAdmin CRUD:** Full management of users, tools, blogs, categories, site settings
- [x] **Bulk Tool Upload:** CSV upload with sample template
- [x] **Dynamic Logo/Favicon:** SuperAdmin can update logo/favicon
- [x] **AI Tool Comparison:** `/api/ai/quick-compare` - winner banner + per-tool analysis cards + ratings visualization
- [x] **AI Tool Recommendations:** `/api/ai/recommend-tools` - rich cards with logo, rating, Visit Tool button
- [x] **Blog Interactions (March 2026):**
  - [x] Like/unlike blogs with real-time count updates
  - [x] Bookmark/unbookmark blogs with status check on page load
  - [x] Comment on blogs
  - [x] User bookmarks list: `GET /api/user/bookmarks`
  - [x] Like-status endpoint: `GET /api/blogs/{slug}/like-status`
  - [x] Bookmark-status endpoint: `GET /api/blogs/{slug}/bookmark-status`
  - [x] "Bookmarked" tab in user blogs dashboard
- [x] **Tool Interactions (March 2026):**
  - [x] Like/unlike tools with real-time count updates
  - [x] Review/rate tools with rating selection
  - [x] Comment on tools
  - [x] Toast notifications replace alert() for all interactions
- [x] **Blog Create/Edit Bug Fix (March 2026):** Tags now sent as array (not string)
- [x] **AI JSON Parsing Fix:** Code block stripping in compare_tools()
- [x] **AI Recommendations Fix:** Added url field for Visit Tool button
  - [x] Replaced "TechResona" branding with "MarketMindAI" across the site
  - [x] Created SuperAdmin endpoint for logo management (`/api/superadmin/site-settings/logo`)
  - [x] Created Admin UI for site settings (`/admin/site-settings`)
  - [x] Dynamic logo loading in navbar via `/api/site-settings/logo` public endpoint

### Test Credentials
- **Superadmin:** `superadmin@marketmindai.com` / `superadmin123`
- **Admin:** `admin@marketmindai.com` / `admin123`
- **User:** `john.doe@example.com` / `password123`

## Pending/Upcoming Tasks

### P1 - Important (Next Sprint)
- [ ] Frontend for User Interactions: UI for users to rate, review, and like tools/blogs
- [ ] Frontend for Tool Comparison: Build the interface for tool comparison feature
- [ ] Fix Scheduled SEO Task: Backend error with hardcoded path `/www/wwwroot/marketmindai.com/index.html`

### P2 - Future Tasks
- [ ] Advanced SEO Management: UI for SuperAdmins to manage SEO for individual pages
- [ ] Dynamic Field Management: UI for SuperAdmins to manage data fields for tools/blogs
- [ ] Scalability Enhancements: Redis caching, advanced database query optimization

## Known Issues
- Backend warning: `WARNING: GROQ_API_KEY not configured` (potential AI integration)
- Admin API endpoints return 403 in preview environment due to IP whitelisting (expected behavior)

## Architecture

```
/app/
├── backend/
│   ├── server.py             # Main FastAPI app
│   ├── models.py             # SQLAlchemy DB models
│   ├── database.py           # PostgreSQL connection
│   ├── auth.py               # JWT and role-based dependencies
│   ├── user_routes.py        # API for user blog management
│   ├── superadmin_routes.py  # API for SuperAdmin actions
│   ├── admin_routes.py       # API for Admin actions
│   ├── tool_claim_routes.py  # API for tool claiming
│   ├── site_settings_routes.py # API for logo and site settings
│   └── user_interaction_routes.py # API for likes/reviews
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── common/
│       │   │   ├── AuthButton.astro       # Dynamic login/dashboard button + My Account dropdown
│       │   │   └── AdminProtection.astro  # Backend API-based admin route guard
│       │   ├── Logo.astro                 # Dynamic logo component
│       ├── layouts/
│       │   ├── PageLayout.astro      # General page layout
│       │   └── AdminLayout.astro     # Admin section layout
│       ├── pages/
│       │   ├── index.astro           # Home page
│       │   ├── auth/                 # User login/register pages
│       │   ├── admin/                # Admin login/claims/site-settings pages
│       │   ├── tools/compare.astro   # Tool comparison with login gate
│       │   └── user/                 # User blog management pages
│       ├── utils/
│       │   └── api.ts              # Central API utility with dynamic URL detection
│       └── navigation.ts           # Header/footer link definitions
└── start.sh                      # Application startup script
```

## Key API Endpoints
- `/api/auth/login`: Authenticates all user roles
- `/api/auth/register`: Creates a new user with 'user' role
- `/api/auth/me`: Returns current authenticated user (used for admin validation)
- `/api/user/blogs`: CRUD API for user blog management
- `/api/admin/claims`: API for admins to manage tool claim requests
- `/api/superadmin/users`: API for superadmins to manage all users
- `/api/site-settings/logo`: Public endpoint to get site logo
- `/api/superadmin/site-settings/logo`: SuperAdmin endpoint to update/upload logo
- `/api/superadmin/site-settings/name`: SuperAdmin endpoint to update site name

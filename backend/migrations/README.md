# Database Migrations for MarketMindAI

This directory contains database migration scripts for the MarketMindAI platform.

## Prerequisites

1. **PostgreSQL** must be installed and running
2. **Database** `marketmindai` must be created
3. **Environment variables** must be configured in `backend/.env`:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/marketmindai
   ```

## Migration Scripts

### 001_initial_schema.py
Creates the complete database schema including:
- **User Management**: users table with authentication fields
- **Content Management**: blogs, blog_comments, blog_likes, blog_bookmarks
- **Tools Directory**: tools, tool_categories, tool_comments, tool_likes
- **Categories**: Hierarchical category system
- **Reviews**: User reviews for tools
- **SEO**: seo_pages, sitemap_entries, locations
- **Communication**: contact_submissions, newsletter_subscriptions
- **Settings**: site_settings
- **Free Tools**: free_tools table

**Performance Indexes**: Creates 40+ indexes for optimal query performance

## Running Migrations

### Step 1: Create PostgreSQL Database

```bash
# Login to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE marketmindai;
CREATE USER marketmind WITH PASSWORD 'marketmind_secure_2024';
GRANT ALL PRIVILEGES ON DATABASE marketmindai TO marketmind;
\q
```

### Step 2: Run Initial Schema Migration

```bash
cd /app/backend
python migrations/001_initial_schema.py
```

**Options:**
- `--auto`: Auto-confirm table recreation (useful for automation)

**Interactive mode**: The script will ask for confirmation if tables already exist.

### Step 3: Seed Sample Data (Optional)

```bash
cd /app/backend
python seed_data.py
```

**Options:**
- `--force`: Force reseed (clears existing data)

**Default credentials after seeding:**
- Superadmin: `admin@marketmindai.com` / `admin123`
- Admin: `editor@marketmindai.com` / `editor123`
- Users: `john.doe@example.com` / `password123` (and 4 more)

## Migration Order

Always run migrations in numerical order:
1. `001_initial_schema.py` - Base schema
2. Future migrations will be numbered sequentially

## Verification

After running migrations, verify the setup:

```bash
# Check tables
sudo -u postgres psql marketmindai -c "\dt"

# Check indexes
sudo -u postgres psql marketmindai -c "\di"

# Count records (after seeding)
sudo -u postgres psql marketmindai -c "SELECT 'users' as table, COUNT(*) FROM users UNION ALL SELECT 'tools', COUNT(*) FROM tools;"
```

## Rollback

To rollback the migration (drops all tables):

```python
from database import engine
from models import Base
Base.metadata.drop_all(bind=engine)
```

## Troubleshooting

### Connection Errors
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check DATABASE_URL in `.env` file
- Ensure database exists: `sudo -u postgres psql -l | grep marketmindai`

### Permission Errors
- Grant privileges: `GRANT ALL PRIVILEGES ON DATABASE marketmindai TO marketmind;`
- For all tables: `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO marketmind;`

### Import Errors
- Run from backend directory: `cd /app/backend`
- Ensure virtual environment is activated (if using one)
- Install dependencies: `pip install -r requirements.txt`

## Notes

- **UUID Primary Keys**: All tables use UUID strings for primary keys (not MongoDB ObjectID)
- **PostgreSQL Optimized**: Indexes and queries optimized for PostgreSQL
- **No Emergent Dependencies**: All emergent-specific code has been removed
- **Production Ready**: Includes proper foreign keys, indexes, and constraints

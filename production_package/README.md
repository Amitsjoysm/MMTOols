# MarketMindAI Production Seed Package

## Overview

This package contains everything needed to populate the MarketMindAI PostgreSQL database with:
- **10,707 AI Tools** with full SEO data, JSON-LD, FAQs, features, and alternatives
- **582 Categories** (94 parent + 488 subcategories) with SEO metadata
- **387 Blog Posts** with H1/H2 structure, meta tags, and JSON-LD
- **10,614 Tool Logos** (webp format)
- **Default Users** (SuperAdmin, Admin, Editor)
- **Site Settings** and **SEO Pages** configuration

## Package Contents

```
production_package/
├── seed_complete.py           # Main seed script
└── seed_data/
    ├── ai_tools_classified_final.csv   # Tools data (10,707 tools)
    ├── Categories_List.csv              # Categories hierarchy
    ├── blog_posts/                      # 387 HTML blog files
    └── logos.tar.gz                     # 10,614 tool logos
```

## Installation on aaPanel (marketmindai.com)

### 1. Prerequisites

Ensure you have:
- Python 3.10+ installed
- PostgreSQL 15+ running
- The MarketMindAI backend deployed

### 2. Upload Files

Upload the entire `production_package` folder to your server:
```bash
scp -r production_package/ user@marketmindai.com:/opt/marketmindai/
```

### 3. Extract Logos

```bash
cd /opt/marketmindai/backend/uploads
tar -xzf /opt/marketmindai/production_package/seed_data/logos.tar.gz
```

### 4. Configure Paths

Edit `seed_complete.py` and update the file paths:
```python
DATA_DIR = "/opt/marketmindai/production_package/seed_data"
TOOLS_CSV = f"{DATA_DIR}/ai_tools_classified_final.csv"
CATEGORIES_CSV = f"{DATA_DIR}/Categories_List.csv"
BLOGS_DIR = f"{DATA_DIR}/blog_posts"
LOGOS_DIR = "/opt/marketmindai/backend/uploads/logos"
```

### 5. Set Environment Variables

Ensure these are set in your backend `.env`:
```bash
DATABASE_URL=postgresql://marketmind:YOUR_PASSWORD@localhost:5432/marketmindai
```

### 6. Run Seed Script

```bash
cd /opt/marketmindai/backend
source venv/bin/activate

# Clear existing and reimport all data
python seed_complete.py --clear

# Or just add new data (skip duplicates)
python seed_complete.py
```

## SuperAdmin Credentials

After seeding, you can login with:
- **Email**: superadmin@marketmindai.com
- **Password**: SuperAdmin@2024!

⚠️ **IMPORTANT**: Change this password immediately in production!

## SEO Features Included

### Tool Pages (`/tools/{slug}`)
- JSON-LD SoftwareApplication schema
- JSON-LD FAQPage for tools with FAQs
- JSON-LD BreadcrumbList navigation
- H1: Tool name
- Meta title: `{Tool Name} Review, Pricing & Alternatives 2026 | MarketMindAI`
- Meta description: Tool description excerpt
- Canonical URL
- Open Graph tags

### Blog Pages (`/blogs/{slug}`)
- JSON-LD Article schema
- JSON-LD BreadcrumbList
- H1: Blog title
- Meta title from original HTML
- Meta description from original HTML
- Keywords from original HTML
- Reading time calculated

### Category Pages (`/categories/{slug}`)
- JSON-LD CollectionPage schema
- JSON-LD BreadcrumbList
- H1: Category name
- SEO title/description

## Data Structure

### Tools CSV Columns
| Column | Description |
|--------|-------------|
| Name | Tool name |
| Category | Original category |
| Platform | Web, iOS, Android, etc. |
| Best_For | Target audience |
| Free_Trial | Trial availability |
| Rating | 1-5 rating |
| Paid_Plans_Details | Pricing info |
| Website | Tool URL |
| Description | Full description |
| Features | Pipe-separated features |
| Alternatives_with_Ratings | Similar tools |
| FAQs_JSON | JSON array of Q&A |
| Icon_URL | Remote logo URL |
| New_Category | Main category |
| New_Subcategory | Subcategory |

### Categories CSV Columns
| Column | Description |
|--------|-------------|
| Category | Parent category name |
| Sub Category | Subcategory name |
| Solution Tool | Solution type |
| SEO Slug | URL-friendly slug |
| SEO Title | SEO title template |

## Verification

After seeding, verify the data:

```bash
# Check database counts
psql -U marketmind -d marketmindai -c "
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'categories', COUNT(*) FROM categories
UNION ALL SELECT 'tools', COUNT(*) FROM tools
UNION ALL SELECT 'blogs', COUNT(*) FROM blogs;
"
```

Expected output:
```
 table_name  | count  
-------------+--------
 users       |      3
 categories  |    582
 tools       | 10707
 blogs       |    387
```

## Rebuilding Frontend

After seeding, rebuild the frontend to generate static pages:

```bash
cd /opt/marketmindai/frontend
yarn build
```

Then restart the frontend service:
```bash
# Using aaPanel or systemctl
systemctl restart marketmindai-frontend
```

## Support

For issues, contact the development team or check the backend logs:
```bash
tail -f /var/log/marketmindai/backend.log
```

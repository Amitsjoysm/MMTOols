#!/usr/bin/env python3
"""
Complete Seed Script for MarketMindAI
Imports all data from CSV/HTML files into PostgreSQL database.
Covers ALL models: Users, Categories, Tools, Blogs, SeoPages, SiteSettings, Locations

Run: python seed_complete.py [--clear]
  --clear: Clears existing data before import
"""

import csv
import json
import os
import re
import sys
import uuid
import argparse
from datetime import datetime
from html.parser import HTMLParser
from pathlib import Path
from typing import Dict, List, Optional, Tuple

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Load environment
load_dotenv()

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

from models import (
    Base, User, Category, Tool, Blog, Review, SeoPage, 
    BlogComment, BlogLike, BlogBookmark, ToolComment, ToolLike,
    ContactSubmission, NewsletterSubscription, SiteSettings,
    Location, SitemapEntry, FreeTool, tool_categories
)
from auth import get_password_hash

# ══════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ══════════════════════════════════════════════════════════════════════════════

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://marketmind:marketmind_secure_2024@localhost:5432/marketmindai")
engine = create_engine(DATABASE_URL, pool_pre_ping=True, echo=False)
Session = sessionmaker(bind=engine)

# File paths
DATA_DIR = "/app/data_files"
TOOLS_CSV = f"{DATA_DIR}/ai_tools_classified_final.csv"
CATEGORIES_CSV = f"{DATA_DIR}/Categories_List.csv"
BLOGS_DIR = f"{DATA_DIR}/blog_posts"
LOGOS_DIR = "/app/backend/uploads/logos"

SITE_URL = "https://marketmindai.com"
SITE_NAME = "MarketMindAI"

# ══════════════════════════════════════════════════════════════════════════════
# UTILITY FUNCTIONS
# ══════════════════════════════════════════════════════════════════════════════

def slugify(text: str) -> str:
    """Convert text to URL-friendly slug."""
    if not text:
        return ""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")[:100]


def domain_to_filename(url: str) -> str:
    """Convert https://example.com → example_com"""
    if not url:
        return ""
    url = re.sub(r"^https?://", "", url)
    url = url.rstrip("/").split("/")[0]
    url = re.sub(r"\.", "_", url)
    url = re.sub(r"[^a-zA-Z0-9_]", "", url)
    return url.lower()


def get_local_logo_url(website: str, icon_url: str = "") -> str:
    """Return local logo path if exists, else remote URL."""
    if website:
        fname = domain_to_filename(website) + ".webp"
        if os.path.exists(os.path.join(LOGOS_DIR, fname)):
            return f"/uploads/logos/{fname}"
    return icon_url or ""


def parse_alternatives(alt_str: str) -> List[dict]:
    """Parse 'BankGPT (4.6); Nora AI (4.6)' → [{name, rating}]"""
    if not alt_str:
        return []
    result = []
    for part in alt_str.split(";"):
        part = part.strip()
        m = re.match(r"^(.+?)\s*\((\d+\.?\d*)\)$", part)
        if m:
            result.append({"name": m.group(1).strip(), "rating": float(m.group(2))})
        elif part:
            result.append({"name": part, "rating": 0.0})
    return result[:10]  # Limit to 10 alternatives


def parse_features(feat_str: str) -> List[str]:
    """Parse 'Feature1|Feature2|Feature3' → ['Feature1', 'Feature2', 'Feature3']"""
    if not feat_str:
        return []
    return [f.strip() for f in feat_str.split("|") if f.strip()][:20]


def parse_faqs(faqs_str: str) -> List[dict]:
    """Parse FAQs JSON string → [{question, answer}]"""
    if not faqs_str:
        return []
    try:
        faqs = json.loads(faqs_str)
        if isinstance(faqs, list):
            return [
                {"question": f.get("question", ""), "answer": f.get("answer", "")}
                for f in faqs if f.get("question") and f.get("answer")
            ][:10]
    except (json.JSONDecodeError, TypeError):
        pass
    return []


def safe_float(value: str, default: float = 0.0) -> float:
    """Safely convert string to float."""
    try:
        return float(value) if value else default
    except (ValueError, TypeError):
        return default


def generate_uuid() -> str:
    """Generate a new UUID string."""
    return str(uuid.uuid4())


# ══════════════════════════════════════════════════════════════════════════════
# JSON-LD GENERATORS
# ══════════════════════════════════════════════════════════════════════════════

def build_tool_json_ld(tool_data: dict) -> dict:
    """Generate comprehensive JSON-LD for a tool (SoftwareApplication + FAQPage + Breadcrumbs)."""
    slug = tool_data.get("slug", "")
    name = tool_data.get("name", "")
    url = tool_data.get("url", "")
    description = (tool_data.get("description", "") or "")[:500]
    rating = tool_data.get("rating", 0.0)
    faqs = tool_data.get("faqs", [])
    platform = tool_data.get("platform", "Web")
    pricing = tool_data.get("pricing_details", {})

    graph = [
        {
            "@type": "SoftwareApplication",
            "@id": f"{SITE_URL}/tools/{slug}#software",
            "name": name,
            "url": url or f"{SITE_URL}/tools/{slug}",
            "description": description,
            "applicationCategory": "BusinessApplication",
            "operatingSystem": platform,
            "offers": {
                "@type": "Offer",
                "priceCurrency": "USD",
                "description": pricing.get("description", "") if isinstance(pricing, dict) else str(pricing),
                "availability": "https://schema.org/InStock",
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": str(rating),
                "bestRating": "5",
                "worstRating": "1",
                "ratingCount": "1",
            },
            "publisher": {
                "@type": "Organization",
                "name": SITE_NAME,
                "url": SITE_URL,
            },
        },
        {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL},
                {"@type": "ListItem", "position": 2, "name": "Tools", "item": f"{SITE_URL}/tools"},
                {"@type": "ListItem", "position": 3, "name": name, "item": f"{SITE_URL}/tools/{slug}"},
            ],
        },
    ]

    # Add FAQPage if FAQs exist
    if faqs:
        graph.append({
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": faq.get("question", ""),
                    "acceptedAnswer": {"@type": "Answer", "text": faq.get("answer", "")},
                }
                for faq in faqs[:10]
            ],
        })

    return {"@context": "https://schema.org", "@graph": graph}


def build_blog_json_ld(blog_data: dict) -> dict:
    """Generate comprehensive JSON-LD for a blog post (Article + FAQPage + Breadcrumbs)."""
    slug = blog_data.get("slug", "")
    title = blog_data.get("title", "")
    description = (blog_data.get("seo_description", "") or "")[:300]
    
    graph = [
        {
            "@type": "Article",
            "@id": f"{SITE_URL}/blogs/{slug}#article",
            "headline": title,
            "description": description,
            "datePublished": datetime.utcnow().isoformat(),
            "dateModified": datetime.utcnow().isoformat(),
            "author": {
                "@type": "Organization",
                "name": SITE_NAME,
                "url": SITE_URL,
            },
            "publisher": {
                "@type": "Organization",
                "name": SITE_NAME,
                "url": SITE_URL,
                "logo": {
                    "@type": "ImageObject",
                    "url": f"{SITE_URL}/logo.png",
                },
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": f"{SITE_URL}/blogs/{slug}",
            },
        },
        {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL},
                {"@type": "ListItem", "position": 2, "name": "Blog", "item": f"{SITE_URL}/blog"},
                {"@type": "ListItem", "position": 3, "name": title[:50], "item": f"{SITE_URL}/blogs/{slug}"},
            ],
        },
    ]

    return {"@context": "https://schema.org", "@graph": graph}


def build_category_json_ld(category_data: dict) -> dict:
    """Generate JSON-LD for a category page (CollectionPage + Breadcrumbs)."""
    slug = category_data.get("slug", "")
    name = category_data.get("name", "")
    description = category_data.get("description", "")

    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": f"{SITE_URL}/categories/{slug}",
                "name": name,
                "description": description,
                "url": f"{SITE_URL}/categories/{slug}",
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL},
                    {"@type": "ListItem", "position": 2, "name": "Categories", "item": f"{SITE_URL}/categories"},
                    {"@type": "ListItem", "position": 3, "name": name, "item": f"{SITE_URL}/categories/{slug}"},
                ],
            },
        ],
    }


# ══════════════════════════════════════════════════════════════════════════════
# HTML BLOG PARSER
# ══════════════════════════════════════════════════════════════════════════════

class BlogHTMLParser(HTMLParser):
    """Parse HTML blog files to extract metadata and content."""
    
    def __init__(self):
        super().__init__()
        self.title = ""
        self.meta = {}
        self.json_ld_raw = []
        self._in_title = False
        self._in_script_ld = False
        self._script_buf = ""

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == "title":
            self._in_title = True
        elif tag == "meta":
            name = attrs_dict.get("name", attrs_dict.get("property", ""))
            content = attrs_dict.get("content", "")
            if name:
                self.meta[name] = content
        elif tag == "script" and attrs_dict.get("type") == "application/ld+json":
            self._in_script_ld = True
            self._script_buf = ""

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        elif tag == "script" and self._in_script_ld:
            self.json_ld_raw.append(self._script_buf)
            self._in_script_ld = False

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        if self._in_script_ld:
            self._script_buf += data


def extract_blog_body(html_content: str) -> str:
    """Extract content inside <body> tags."""
    m = re.search(r"<body[^>]*>(.*?)</body>", html_content, re.DOTALL | re.IGNORECASE)
    return m.group(1).strip() if m else html_content


def parse_blog_html(filepath: str) -> dict:
    """Parse a blog HTML file and extract all metadata."""
    with open(filepath, encoding="utf-8", errors="replace") as f:
        html = f.read()

    parser = BlogHTMLParser()
    parser.feed(html)

    slug = os.path.basename(filepath).replace(".html", "")
    title = parser.title.strip() or slug.replace("-", " ").title()

    # Parse JSON-LD
    json_ld = None
    for raw in parser.json_ld_raw:
        try:
            parsed = json.loads(raw)
            # Fix domain references
            def fix_urls(obj):
                if isinstance(obj, dict):
                    for k, v in obj.items():
                        if isinstance(v, str):
                            obj[k] = v.replace("https://yourdomain.com", SITE_URL).replace("YourBrand", SITE_NAME)
                        elif isinstance(v, (dict, list)):
                            fix_urls(v)
                elif isinstance(obj, list):
                    for item in obj:
                        fix_urls(item)
            fix_urls(parsed)
            json_ld = parsed
            break
        except (json.JSONDecodeError, TypeError):
            continue

    description = parser.meta.get("description", "")
    keywords = parser.meta.get("keywords", "")
    body_html = extract_blog_body(html)

    return {
        "slug": slug,
        "title": title[:255],
        "seo_title": parser.meta.get("og:title", title)[:255],
        "seo_description": description[:500],
        "seo_keywords": keywords[:500],
        "json_ld": json_ld,
        "content": body_html,
        "excerpt": description[:300] if description else "",
        "featured_image": parser.meta.get("og:image", ""),
    }


# ══════════════════════════════════════════════════════════════════════════════
# DATABASE OPERATIONS
# ══════════════════════════════════════════════════════════════════════════════

def create_tables():
    """Create all database tables."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("  ✓ Tables created")


def clear_all_data(session):
    """Clear all existing data from all tables."""
    print("\nClearing existing data...")
    
    tables_to_clear = [
        "sitemap_entries", "tool_likes", "tool_comments", "blog_bookmarks",
        "blog_likes", "blog_comments", "reviews", "user_tool_favorites",
        "tool_categories", "newsletter_subscriptions", "contact_submissions",
        "seo_pages", "site_settings", "free_tools", "locations",
        "blogs", "tools", "categories", "users"
    ]
    
    for table in tables_to_clear:
        try:
            session.execute(text(f'DELETE FROM {table}'))
            print(f"  ✓ Cleared {table}")
        except Exception as e:
            print(f"  ! Could not clear {table}: {e}")
    
    session.commit()
    print("  ✓ All data cleared")


# ══════════════════════════════════════════════════════════════════════════════
# SEED FUNCTIONS
# ══════════════════════════════════════════════════════════════════════════════

def seed_users(session) -> Dict[str, User]:
    """Create default users including superadmin."""
    print("\n═══ Seeding Users ═══")
    
    users_data = [
        {
            "email": "superadmin@marketmindai.com",
            "username": "superadmin",
            "full_name": "Super Admin",
            "password": "SuperAdmin@2024!",
            "role": "superadmin",
        },
        {
            "email": "admin@marketmindai.com",
            "username": "admin",
            "full_name": "Admin User",
            "password": "Admin@2024!",
            "role": "admin",
        },
        {
            "email": "editor@marketmindai.com",
            "username": "editor",
            "full_name": "Content Editor",
            "password": "Editor@2024!",
            "role": "admin",
        },
    ]
    
    users = {}
    for data in users_data:
        existing = session.query(User).filter(User.email == data["email"]).first()
        if existing:
            users[data["role"]] = existing
            print(f"  ○ User exists: {data['email']}")
            continue
        
        user = User(
            id=generate_uuid(),
            email=data["email"],
            username=data["username"],
            full_name=data["full_name"],
            hashed_password=get_password_hash(data["password"]),
            role=data["role"],
            is_active=True,
            is_email_verified=True,
        )
        session.add(user)
        users[data["role"]] = user
        print(f"  ✓ Created: {data['email']} / {data['password']}")
    
    session.commit()
    return users


def seed_categories(session) -> Tuple[Dict[str, Category], Dict[Tuple[str, str], Category]]:
    """Import categories and subcategories from CSV."""
    print("\n═══ Seeding Categories ═══")
    
    if not os.path.exists(CATEGORIES_CSV):
        print(f"  ! Categories CSV not found: {CATEGORIES_CSV}")
        return {}, {}
    
    parent_categories = {}  # name -> Category
    subcategories = {}  # (parent_name, sub_name) -> Category
    used_slugs = set()
    used_names = set()  # Track used names globally
    
    with open(CATEGORIES_CSV, encoding="utf-8", errors="replace") as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    
    # First pass: Create parent categories
    for row in rows:
        cat_name = row.get("Category", "").strip()
        if not cat_name or cat_name in parent_categories:
            continue
        
        slug = slugify(cat_name)
        base_slug = slug
        counter = 1
        while slug in used_slugs:
            slug = f"{base_slug}-{counter}"
            counter += 1
        used_slugs.add(slug)
        used_names.add(cat_name)
        
        seo_title = row.get("SEO Title", f"Best {cat_name} Tools 2026")
        
        category = Category(
            id=generate_uuid(),
            name=cat_name,
            slug=slug,
            description=f"Discover the best AI tools for {cat_name}. Compare features, pricing, and reviews.",
            seo_title=seo_title[:255],
            seo_description=f"Find the top {cat_name} tools and software. Expert reviews, pricing comparisons, and recommendations for 2026.",
            seo_keywords=f"{cat_name}, AI tools, software, 2026",
        )
        session.add(category)
        parent_categories[cat_name] = category
    
    session.flush()
    print(f"  ✓ Created {len(parent_categories)} parent categories")
    
    # Second pass: Create subcategories with unique names
    for row in rows:
        cat_name = row.get("Category", "").strip()
        sub_name = row.get("Sub Category", "").strip()
        seo_slug = row.get("SEO Slug", "").strip()
        seo_title = row.get("SEO Title", "").strip()
        
        if not cat_name or not sub_name:
            continue
        
        # Skip invalid names
        if sub_name == "#NAME?" or sub_name.startswith('"'):
            continue
        
        key = (cat_name, sub_name)
        if key in subcategories:
            continue
        
        parent = parent_categories.get(cat_name)
        if not parent:
            continue
        
        # Make slug unique
        slug = seo_slug or slugify(sub_name)
        base_slug = slug
        counter = 1
        while slug in used_slugs:
            slug = f"{base_slug}-{counter}"
            counter += 1
        used_slugs.add(slug)
        
        # Make name unique by appending parent category if needed
        unique_name = sub_name
        if unique_name in used_names:
            unique_name = f"{sub_name} ({cat_name})"
            # If still not unique, add a counter
            base_name = unique_name
            name_counter = 1
            while unique_name in used_names:
                unique_name = f"{base_name} {name_counter}"
                name_counter += 1
        used_names.add(unique_name)
        
        subcategory = Category(
            id=generate_uuid(),
            name=unique_name[:255],
            slug=slug,
            description=f"Top AI tools for {sub_name} in {cat_name}. Compare and find the best solutions.",
            parent_id=parent.id,
            seo_title=(seo_title or f"Best {sub_name} Tools 2026")[:255],
            seo_description=f"Compare the best {sub_name} tools for {cat_name}. Expert reviews and pricing for 2026.",
            seo_keywords=f"{sub_name}, {cat_name}, AI tools, software",
        )
        session.add(subcategory)
        subcategories[key] = subcategory
    
    session.commit()
    print(f"  ✓ Created {len(subcategories)} subcategories")
    print(f"  ✓ Total: {len(parent_categories) + len(subcategories)} categories")
    
    return parent_categories, subcategories


def seed_tools(session, parent_categories: dict, subcategories: dict) -> int:
    """Import tools from CSV with full SEO data."""
    print("\n═══ Seeding Tools ═══")
    
    if not os.path.exists(TOOLS_CSV):
        print(f"  ! Tools CSV not found: {TOOLS_CSV}")
        return 0
    
    # Build category lookup by name
    all_categories = {}
    for cat in session.query(Category).all():
        all_categories[cat.name] = cat
    
    used_slugs = set(t.slug for t in session.query(Tool.slug).all())
    
    with open(TOOLS_CSV, encoding="utf-8", errors="replace") as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    
    total = len(rows)
    inserted = 0
    skipped = 0
    batch_size = 500
    
    for i, row in enumerate(rows, 1):
        if i % batch_size == 0:
            session.commit()
            print(f"  ... {i}/{total} processed ({inserted} inserted, {skipped} skipped)")
        
        name = row.get("Name", "").strip()
        if not name:
            skipped += 1
            continue
        
        # Check for duplicate
        existing = session.query(Tool).filter(Tool.name == name).first()
        if existing:
            skipped += 1
            continue
        
        # Generate unique slug
        slug = slugify(name)
        base_slug = slug
        counter = 1
        while slug in used_slugs:
            slug = f"{base_slug}-{counter}"
            counter += 1
        used_slugs.add(slug)
        
        # Parse data
        website = row.get("Website", "").strip()
        icon_url = row.get("Icon_URL", "").strip()
        logo = get_local_logo_url(website, icon_url)
        
        description = row.get("Description", "").strip()
        rating = safe_float(row.get("Rating", "0"))
        rating = min(5.0, max(0.0, rating))  # Clamp rating
        
        faqs = parse_faqs(row.get("FAQs_JSON", ""))
        features = parse_features(row.get("Features", ""))
        alternatives = parse_alternatives(row.get("Alternatives_with_Ratings", ""))
        
        pricing_str = row.get("Paid_Plans_Details", "").strip()
        free_trial = row.get("Free_Trial", "").strip()
        
        # Determine pricing type
        if "free" in pricing_str.lower() and "from" not in pricing_str.lower():
            pricing_type = "free"
        elif free_trial and "available" in free_trial.lower() and "not" not in free_trial.lower():
            pricing_type = "freemium"
        elif pricing_str:
            pricing_type = "paid"
        else:
            pricing_type = "free"
        
        new_category = row.get("New_Category", "").strip()
        new_subcategory = row.get("New_Subcategory", "").strip()
        platform = row.get("Platform", "Web").strip()
        best_for = row.get("Best_For", "").strip()
        
        # Build tool data
        tool_data = {
            "slug": slug,
            "name": name,
            "description": description[:5000] if description else "",
            "short_description": best_for[:255] if best_for else "",
            "url": website,
            "logo_url": logo,
            "platform": platform[:100],
            "best_for": best_for[:500],
            "free_trial": free_trial[:50],
            "rating": rating,
            "pricing_type": pricing_type,
            "pricing_details": {"description": pricing_str} if pricing_str else None,
            "features": features,
            "alternatives": alternatives,
            "faqs": faqs,
            "new_category": new_category[:255],
            "new_subcategory": new_subcategory[:255],
            "is_active": True,
            "is_featured": rating >= 4.5,
            "seo_title": f"{name} Review, Pricing & Alternatives 2026 | {SITE_NAME}"[:255],
            "seo_description": (description[:250] + "..." if len(description) > 250 else description) or f"Expert review of {name}. Features, pricing, alternatives and more.",
            "seo_keywords": f"{name}, {new_category}, {new_subcategory}, AI tools, review"[:255],
        }
        
        # Generate JSON-LD
        tool_data["json_ld"] = build_tool_json_ld(tool_data)
        
        # Create tool
        tool = Tool(id=generate_uuid(), **tool_data)
        session.add(tool)
        
        # Link to categories
        linked_cats = []
        if new_category and new_category in all_categories:
            linked_cats.append(all_categories[new_category])
        if new_subcategory and new_subcategory in all_categories:
            linked_cats.append(all_categories[new_subcategory])
        
        # Also try old Category column
        old_category = row.get("Category", "").strip()
        if old_category and old_category in all_categories:
            linked_cats.append(all_categories[old_category])
        
        if linked_cats:
            tool.categories = list({c.id: c for c in linked_cats}.values())
        
        inserted += 1
    
    session.commit()
    print(f"  ✓ Inserted {inserted} tools")
    print(f"  ○ Skipped {skipped} (duplicates or empty)")
    
    return inserted


def seed_blogs(session, admin_user: User) -> int:
    """Import blog posts from HTML files with full SEO."""
    print("\n═══ Seeding Blogs ═══")
    
    if not os.path.exists(BLOGS_DIR):
        print(f"  ! Blogs directory not found: {BLOGS_DIR}")
        return 0
    
    html_files = sorted(Path(BLOGS_DIR).glob("*.html"))
    if not html_files:
        print(f"  ! No HTML files found in {BLOGS_DIR}")
        return 0
    
    used_slugs = set(b.slug for b in session.query(Blog.slug).all())
    
    total = len(html_files)
    inserted = 0
    skipped = 0
    
    for i, filepath in enumerate(html_files, 1):
        if i % 50 == 0:
            session.commit()
            print(f"  ... {i}/{total} processed ({inserted} inserted)")
        
        slug = filepath.stem
        
        # Check for duplicate
        if slug in used_slugs:
            skipped += 1
            continue
        
        try:
            data = parse_blog_html(str(filepath))
        except Exception as e:
            print(f"  ! Error parsing {filepath.name}: {e}")
            skipped += 1
            continue
        
        # Ensure unique slug
        base_slug = data["slug"]
        counter = 1
        while data["slug"] in used_slugs:
            data["slug"] = f"{base_slug}-{counter}"
            counter += 1
        used_slugs.add(data["slug"])
        
        # Use existing JSON-LD or generate new one
        json_ld = data.get("json_ld") or build_blog_json_ld(data)
        
        blog = Blog(
            id=generate_uuid(),
            title=data["title"],
            slug=data["slug"],
            content=data["content"],
            excerpt=data["excerpt"][:500],
            featured_image=data.get("featured_image", ""),
            author_id=admin_user.id,
            status="published",
            published_at=datetime.utcnow(),
            seo_title=data["seo_title"],
            seo_description=data["seo_description"],
            seo_keywords=data["seo_keywords"],
            json_ld=json_ld,
            is_ai_generated=True,
            tags=data["seo_keywords"].split(",")[:5] if data["seo_keywords"] else [],
            reading_time=max(1, len(data["content"]) // 1500),
        )
        session.add(blog)
        inserted += 1
    
    session.commit()
    print(f"  ✓ Inserted {inserted} blog posts")
    print(f"  ○ Skipped {skipped} (duplicates or errors)")
    
    return inserted


def seed_seo_pages(session) -> int:
    """Create SEO entries for static pages."""
    print("\n═══ Seeding SEO Pages ═══")
    
    static_pages = [
        {
            "page_path": "/",
            "title": f"{SITE_NAME} - Discover the Best AI Tools",
            "description": f"{SITE_NAME} is your ultimate directory for AI tools. Compare 10,000+ AI tools with reviews, pricing, and alternatives.",
            "keywords": "AI tools, artificial intelligence, software directory, AI software, machine learning tools",
        },
        {
            "page_path": "/tools",
            "title": f"AI Tools Directory - Browse 10,000+ Tools | {SITE_NAME}",
            "description": "Browse our comprehensive AI tools directory. Filter by category, pricing, and rating to find the perfect tool.",
            "keywords": "AI tools directory, AI software list, browse AI tools",
        },
        {
            "page_path": "/blog",
            "title": f"AI Blog - News, Reviews & Guides | {SITE_NAME}",
            "description": "Stay updated with the latest AI news, tool reviews, and industry guides. Expert insights for AI enthusiasts.",
            "keywords": "AI blog, AI news, AI reviews, AI guides",
        },
        {
            "page_path": "/categories",
            "title": f"AI Tool Categories - Browse by Category | {SITE_NAME}",
            "description": "Explore AI tools by category. Find tools for marketing, sales, development, design, and more.",
            "keywords": "AI categories, AI tool types, AI software categories",
        },
        {
            "page_path": "/about",
            "title": f"About {SITE_NAME} - Our Mission",
            "description": f"Learn about {SITE_NAME}'s mission to help you discover and compare the best AI tools for your needs.",
            "keywords": "about marketmindai, AI tools company",
        },
        {
            "page_path": "/contact",
            "title": f"Contact Us | {SITE_NAME}",
            "description": f"Get in touch with the {SITE_NAME} team. We'd love to hear from you.",
            "keywords": "contact marketmindai, support",
        },
        {
            "page_path": "/pricing",
            "title": f"Pricing Plans | {SITE_NAME}",
            "description": f"Explore {SITE_NAME} pricing plans. Free and premium options available.",
            "keywords": "pricing, plans, subscription",
        },
    ]
    
    inserted = 0
    for page in static_pages:
        existing = session.query(SeoPage).filter(SeoPage.page_path == page["page_path"]).first()
        if existing:
            continue
        
        seo_page = SeoPage(
            id=generate_uuid(),
            page_path=page["page_path"],
            title=page["title"],
            description=page["description"],
            keywords=page["keywords"],
            json_ld={
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": page["title"],
                "description": page["description"],
                "url": f"{SITE_URL}{page['page_path']}",
            },
            meta_tags={
                "robots": "index, follow",
                "author": SITE_NAME,
            },
        )
        session.add(seo_page)
        inserted += 1
    
    session.commit()
    print(f"  ✓ Created {inserted} SEO page entries")
    return inserted


def seed_site_settings(session) -> int:
    """Create default site settings."""
    print("\n═══ Seeding Site Settings ═══")
    
    settings = [
        ("site_name", SITE_NAME, "Website name"),
        ("site_url", SITE_URL, "Website URL"),
        ("site_description", "Your ultimate AI tools directory", "Site meta description"),
        ("contact_email", "contact@marketmindai.com", "Contact email"),
        ("support_email", "support@marketmindai.com", "Support email"),
        ("twitter_handle", "@marketmindai", "Twitter handle"),
        ("facebook_url", "", "Facebook page URL"),
        ("linkedin_url", "", "LinkedIn page URL"),
        ("analytics_id", "", "Google Analytics ID"),
        ("adsense_id", "", "Google AdSense ID"),
        ("enable_comments", "true", "Enable comments on blogs"),
        ("enable_reviews", "true", "Enable tool reviews"),
        ("maintenance_mode", "false", "Maintenance mode flag"),
        ("site_logo_url", "/images/logo-horizontal.png", "Site logo URL"),
        ("site_favicon_url", "/favicon.ico", "Site favicon URL"),
        ("site_logo_square_url", "/images/logo-square.png", "Site square logo URL"),
    ]
    
    inserted = 0
    for key, value, description in settings:
        existing = session.query(SiteSettings).filter(SiteSettings.key == key).first()
        if existing:
            continue
        
        setting = SiteSettings(
            id=generate_uuid(),
            key=key,
            value=value,
            description=description,
        )
        session.add(setting)
        inserted += 1
    
    session.commit()
    print(f"  ✓ Created {inserted} site settings")
    return inserted


def seed_locations(session) -> int:
    """Create sample locations for geo-targeted SEO."""
    print("\n═══ Seeding Locations ═══")
    
    locations_data = [
        ("United States", "united-states", "country", None),
        ("United Kingdom", "united-kingdom", "country", None),
        ("Canada", "canada", "country", None),
        ("Australia", "australia", "country", None),
        ("Germany", "germany", "country", None),
        ("France", "france", "country", None),
        ("India", "india", "country", None),
        ("New York", "new-york", "city", "US"),
        ("San Francisco", "san-francisco", "city", "US"),
        ("London", "london", "city", "GB"),
        ("Toronto", "toronto", "city", "CA"),
        ("Sydney", "sydney", "city", "AU"),
        ("Berlin", "berlin", "city", "DE"),
    ]
    
    inserted = 0
    for name, slug, loc_type, country_code in locations_data:
        existing = session.query(Location).filter(Location.slug == slug).first()
        if existing:
            continue
        
        location = Location(
            id=generate_uuid(),
            name=name,
            slug=slug,
            type=loc_type,
            country_code=country_code,
            is_active=True,
            seo_title_template=f"Best {{tool_name}} for {name}",
            seo_description_template=f"Find the best {{tool_name}} solutions in {name}. Compare features and pricing.",
        )
        session.add(location)
        inserted += 1
    
    session.commit()
    print(f"  ✓ Created {inserted} locations")
    return inserted


def seed_free_tools(session) -> int:
    """Create sample free tools entries."""
    print("\n═══ Seeding Free Tools ═══")
    
    free_tools_data = [
        ("AI Writing Assistant", f"{SITE_URL}/free-tools/ai-writer", "Free AI-powered writing assistant"),
        ("Image Generator", f"{SITE_URL}/free-tools/image-generator", "Generate images with AI for free"),
        ("PDF Analyzer", f"{SITE_URL}/free-tools/pdf-analyzer", "Analyze and extract data from PDFs"),
        ("Text Summarizer", f"{SITE_URL}/free-tools/summarizer", "Summarize long texts instantly"),
        ("Grammar Checker", f"{SITE_URL}/free-tools/grammar", "Free grammar and spelling checker"),
    ]
    
    inserted = 0
    for name, link, description in free_tools_data:
        existing = session.query(FreeTool).filter(FreeTool.name == name).first()
        if existing:
            continue
        
        free_tool = FreeTool(
            id=generate_uuid(),
            name=name,
            link=link,
            description=description,
            is_active=True,
        )
        session.add(free_tool)
        inserted += 1
    
    session.commit()
    print(f"  ✓ Created {inserted} free tools")
    return inserted


# ══════════════════════════════════════════════════════════════════════════════
# MAIN EXECUTION
# ══════════════════════════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(description="Seed MarketMindAI database")
    parser.add_argument("--clear", action="store_true", help="Clear existing data before import")
    args = parser.parse_args()
    
    print("=" * 70)
    print(f"  MarketMindAI Complete Database Seed")
    print(f"  {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}")
    print("=" * 70)
    
    # Create tables
    create_tables()
    
    with Session() as session:
        # Clear data if requested
        if args.clear:
            clear_all_data(session)
        
        # Seed in order
        users = seed_users(session)
        admin_user = users.get("superadmin") or users.get("admin")
        
        parent_cats, subcats = seed_categories(session)
        tools_count = seed_tools(session, parent_cats, subcats)
        blogs_count = seed_blogs(session, admin_user)
        
        seed_seo_pages(session)
        seed_site_settings(session)
        seed_locations(session)
        seed_free_tools(session)
    
    # Print summary
    print("\n" + "=" * 70)
    print("  ✅ SEED COMPLETE")
    print("=" * 70)
    
    with Session() as session:
        stats = {
            "Users": session.query(User).count(),
            "Categories": session.query(Category).count(),
            "Tools": session.query(Tool).count(),
            "Blogs": session.query(Blog).count(),
            "SEO Pages": session.query(SeoPage).count(),
            "Site Settings": session.query(SiteSettings).count(),
            "Locations": session.query(Location).count(),
            "Free Tools": session.query(FreeTool).count(),
        }
    
    print("\n  📊 Database Statistics:")
    for name, count in stats.items():
        print(f"     {name}: {count:,}")
    
    print(f"\n  🔐 SuperAdmin Credentials:")
    print(f"     Email: superadmin@marketmindai.com")
    print(f"     Password: SuperAdmin@2024!")
    print(f"\n  🌐 Site URL: {SITE_URL}")
    print("=" * 70)


if __name__ == "__main__":
    main()

"""
Production seed script - imports categories, tools, and blogs from CSV/HTML files.
Run: python seed_production.py
"""
import csv
import json
import os
import re
import sys
import uuid
from datetime import datetime
from html.parser import HTMLParser
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://marketmind:marketmind_secure_2024@localhost:5432/marketmindai")
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
Session = sessionmaker(bind=engine)

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))
from models import Base, Category, Tool, Blog, User, tool_categories
from auth import get_password_hash

SITE_URL = "https://marketmindai.com"
BLOGS_DIR = "/tmp/assets/blogs_extracted"
CATEGORIES_CSV = "/tmp/assets/categories.csv"
TOOLS_CSV = "/tmp/assets/ai_tools.csv"
LOGOS_DIR = "/app/backend/uploads/logos"

# ── helpers ──────────────────────────────────────────────────────────────────

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")


def domain_to_filename(url: str) -> str:
    """Convert https://example.com → example_com"""
    url = re.sub(r"^https?://", "", url)
    url = url.rstrip("/").split("/")[0]  # keep domain only
    url = re.sub(r"\.", "_", url)
    url = re.sub(r"[^a-zA-Z0-9_]", "", url)
    return url.lower()


def local_logo_url(website: str, icon_url: str, tool_name: str) -> str:
    """Return local /uploads/logos/<file>.webp if the file exists, else remote icon_url."""
    if website:
        fname = domain_to_filename(website) + ".webp"
        if os.path.exists(os.path.join(LOGOS_DIR, fname)):
            return f"/uploads/logos/{fname}"
    # Fallback to remote
    return icon_url or ""


def parse_alternatives(alt_str: str) -> list:
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
    return result


def parse_features(feat_str: str) -> list:
    if not feat_str:
        return []
    return [f.strip() for f in feat_str.split("|") if f.strip()]


def parse_faqs(faqs_str: str) -> list:
    if not faqs_str:
        return []
    try:
        return json.loads(faqs_str)
    except Exception:
        return []


def build_tool_json_ld(tool_data: dict, categories: list, site_url: str) -> dict:
    """Generate SoftwareApplication + FAQPage + BreadcrumbList JSON-LD."""
    slug = tool_data.get("slug", "")
    name = tool_data.get("name", "")
    url = tool_data.get("url", "")
    description = tool_data.get("description", "")[:500]
    rating = tool_data.get("rating", 0.0)
    faqs = tool_data.get("faqs", [])

    graph = [
        {
            "@type": "SoftwareApplication",
            "@id": f"{site_url}/tools/{slug}#software",
            "name": name,
            "url": url,
            "description": description,
            "applicationCategory": "BusinessApplication",
            "operatingSystem": tool_data.get("platform", "Web"),
            "offers": {
                "@type": "Offer",
                "priceCurrency": "USD",
                "description": tool_data.get("pricing_details", ""),
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
                "name": "MarketMindAI",
                "url": site_url,
            },
        },
        {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": site_url},
                {"@type": "ListItem", "position": 2, "name": "Tools", "item": f"{site_url}/tools"},
                {"@type": "ListItem", "position": 3, "name": name, "item": f"{site_url}/tools/{slug}"},
            ],
        },
    ]

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


# ── HTML Blog Parser ──────────────────────────────────────────────────────────

class BlogHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.meta = {}
        self.json_ld_raw = []
        self._in_title = False
        self._in_script_ld = False
        self._script_buf = ""
        self._body_started = False
        self._body_buf = []
        self._in_body = False

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == "title":
            self._in_title = True
        elif tag == "meta":
            name = attrs_dict.get("name", attrs_dict.get("property", ""))
            content = attrs_dict.get("content", "")
            if name:
                self.meta[name] = content
        elif tag == "script":
            if attrs_dict.get("type") == "application/ld+json":
                self._in_script_ld = True
                self._script_buf = ""
        elif tag == "body":
            self._in_body = True

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        elif tag == "script":
            if self._in_script_ld:
                self.json_ld_raw.append(self._script_buf)
                self._in_script_ld = False
                self._script_buf = ""
        elif tag == "body":
            self._in_body = False

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        if self._in_script_ld:
            self._script_buf += data


def extract_blog_body(html_content: str) -> str:
    """Extract everything inside <body>...</body>."""
    m = re.search(r"<body[^>]*>(.*?)</body>", html_content, re.DOTALL | re.IGNORECASE)
    if m:
        return m.group(1).strip()
    return html_content


def parse_blog_html(filepath: str) -> dict:
    with open(filepath, encoding="utf-8") as f:
        html = f.read()

    parser = BlogHTMLParser()
    parser.feed(html)

    slug = os.path.basename(filepath).replace(".html", "")
    title = parser.title.strip() or slug.replace("-", " ").title()

    json_ld = None
    for raw in parser.json_ld_raw:
        try:
            json_ld = json.loads(raw)
            break
        except Exception:
            continue

    description = parser.meta.get("description", "")
    keywords = parser.meta.get("keywords", "")

    body_html = extract_blog_body(html)

    return {
        "slug": slug,
        "title": title,
        "seo_title": parser.meta.get("og:title", title),
        "seo_description": description,
        "seo_keywords": keywords,
        "json_ld": json_ld,
        "content": body_html,
        "excerpt": description[:300] if description else "",
    }


# ── Main Import ───────────────────────────────────────────────────────────────

def create_tables():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created.")


def get_or_create_admin(session) -> User:
    admin = session.query(User).filter(User.email == "superadmin@marketmindai.com").first()
    if not admin:
        print("Creating superadmin user...")
        admin = User(
            id=str(uuid.uuid4()),
            email="superadmin@marketmindai.com",
            username="superadmin",
            full_name="Super Admin",
            hashed_password=get_password_hash("SuperAdmin@2024!"),
            role="superadmin",
            is_active=True,
            is_email_verified=True,
        )
        session.add(admin)
        session.commit()
        print(f"  Created superadmin: superadmin@marketmindai.com / SuperAdmin@2024!")
    return admin


def import_categories(session) -> dict:
    """Returns {(category_name, subcategory_name): Category obj for subcats}"""
    print("\nImporting categories...")
    cat_map = {}  # name → Category
    subcat_map = {}  # (cat_name, subcat_name) → Category

    with open(CATEGORIES_CSV, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    # First pass – create parent categories
    for row in rows:
        cat_name = row["Category"].strip()
        if cat_name not in cat_map:
            existing = session.query(Category).filter(Category.name == cat_name).first()
            if not existing:
                slug = slugify(cat_name)
                # Ensure slug unique
                base = slug
                i = 1
                while session.query(Category).filter(Category.slug == slug).first():
                    slug = f"{base}-{i}"
                    i += 1
                existing = Category(
                    id=str(uuid.uuid4()),
                    name=cat_name,
                    slug=slug,
                    seo_title=row.get("SEO Title", f"Best {cat_name} Tools 2026"),
                    description=f"Discover the best AI tools for {cat_name}.",
                )
                session.add(existing)
            cat_map[cat_name] = existing

    session.flush()

    # Second pass – create subcategories (using no_autoflush to avoid premature flushes)
    for row in rows:
        cat_name = row["Category"].strip()
        subcat_name = row["Sub Category"].strip()
        seo_slug = row.get("SEO Slug", "").strip()
        seo_title = row.get("SEO Title", f"Best {subcat_name} Tools 2026")

        key = (cat_name, subcat_name)
        if key in subcat_map:
            continue

        parent_id = cat_map[cat_name].id

        # Check by parent+name in DB (committed rows)
        with session.no_autoflush:
            existing = session.query(Category).filter(
                Category.name == subcat_name,
                Category.parent_id == parent_id
            ).first()

        if existing:
            subcat_map[key] = existing
            continue

        # Pick a unique slug
        slug = seo_slug or slugify(subcat_name)
        base = slug
        i = 1
        with session.no_autoflush:
            while session.query(Category).filter(Category.slug == slug).first():
                slug = f"{base}-{i}"
                i += 1

        # Make the DB name unique: if another category already has this name, suffix with parent
        unique_name = subcat_name
        with session.no_autoflush:
            name_clash = session.query(Category).filter(
                Category.name == unique_name,
                Category.parent_id != parent_id
            ).first()
        if name_clash:
            unique_name = f"{subcat_name} ({cat_name})"

        new_cat = Category(
            id=str(uuid.uuid4()),
            name=unique_name,
            slug=slug,
            seo_title=seo_title,
            description=f"Top AI tools for {subcat_name} in {cat_name}.",
            parent_id=parent_id,
        )
        session.add(new_cat)
        try:
            session.flush()
        except Exception:
            session.rollback()
            # Try with fully unique name
            unique_name = f"{subcat_name} - {cat_name}"
            slug = f"{slug}-{slugify(cat_name)[:20]}"
            new_cat = Category(
                id=str(uuid.uuid4()),
                name=unique_name,
                slug=slug,
                seo_title=seo_title,
                description=f"Top AI tools for {subcat_name} in {cat_name}.",
                parent_id=parent_id,
            )
            session.add(new_cat)
            session.flush()

        subcat_map[key] = new_cat

    session.commit()
    print(f"  {len(cat_map)} parent categories, {len(subcat_map)} subcategories.")
    return cat_map, subcat_map


def import_tools(session, cat_map, subcat_map):
    print("\nImporting tools (this may take a while)...")
    
    # Build a lookup for all categories by name
    all_cats = {c.name: c for c in session.query(Category).all()}

    with open(TOOLS_CSV, encoding="utf-8", errors="replace") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    total = len(rows)
    inserted = 0
    skipped = 0

    for i, row in enumerate(rows, 1):
        if i % 500 == 0:
            print(f"  {i}/{total} tools processed...")
            session.commit()

        name = row.get("Name", "").strip()
        if not name:
            skipped += 1
            continue

        # Check if already exists
        existing = session.query(Tool).filter(Tool.name == name).first()
        if existing:
            skipped += 1
            continue

        slug = slugify(name)
        base_slug = slug
        counter = 1
        while session.query(Tool).filter(Tool.slug == slug).first():
            slug = f"{base_slug}-{counter}"
            counter += 1

        website = row.get("Website", "").strip()
        icon_url = row.get("Icon_URL", "").strip()
        logo = local_logo_url(website, icon_url, name)

        description = row.get("Description", "").strip()
        rating_raw = row.get("Rating", "0")
        try:
            rating = float(rating_raw) if rating_raw else 0.0
        except ValueError:
            rating = 0.0

        faqs = parse_faqs(row.get("FAQs_JSON", ""))
        features = parse_features(row.get("Features", ""))
        alternatives = parse_alternatives(row.get("Alternatives_with_Ratings", ""))
        pricing_str = row.get("Paid_Plans_Details", "").strip()
        free_trial = row.get("Free_Trial", "").strip()

        # Determine pricing_type
        if free_trial and "available" in free_trial.lower() and "not" not in free_trial.lower():
            pricing_type = "freemium"
        elif pricing_str and pricing_str.lower() not in ("free", ""):
            pricing_type = "paid"
        else:
            pricing_type = "free"

        new_cat = row.get("New_Category", "").strip()
        new_subcat = row.get("New_Subcategory", "").strip()

        tool_data = {
            "slug": slug,
            "name": name,
            "description": description,
            "short_description": row.get("Best_For", "").strip()[:255] if row.get("Best_For") else "",
            "url": website,
            "logo_url": logo,
            "platform": row.get("Platform", "Web").strip(),
            "best_for": row.get("Best_For", "").strip(),
            "free_trial": free_trial,
            "rating": rating,
            "pricing_type": pricing_type,
            "pricing_details": {"description": pricing_str} if pricing_str else None,
            "features": features,
            "alternatives": alternatives,
            "faqs": faqs,
            "new_category": new_cat,
            "new_subcategory": new_subcat,
            "is_active": True,
            "is_featured": rating >= 4.5,
            "seo_title": f"{name} Review, Pricing & Alternatives 2026 | MarketMindAI",
            "seo_description": description[:300] if description else f"Read our expert review of {name}. Pricing, features, alternatives and more.",
            "seo_keywords": f"{name}, {new_cat}, {new_subcat}, AI tools",
        }

        tool_data["json_ld"] = build_tool_json_ld(tool_data, [], SITE_URL)

        tool = Tool(id=str(uuid.uuid4()), **tool_data)
        session.add(tool)

        # Link to categories
        linked_cats = []
        if new_cat and new_cat in all_cats:
            linked_cats.append(all_cats[new_cat])
        if new_subcat and new_subcat in all_cats:
            linked_cats.append(all_cats[new_subcat])
        # Also try old Category column
        old_cat_name = row.get("Category", "").strip()
        if old_cat_name and old_cat_name in all_cats:
            linked_cats.append(all_cats[old_cat_name])

        if linked_cats:
            tool.categories = list({c.id: c for c in linked_cats}.values())

        inserted += 1

    session.commit()
    print(f"  Inserted {inserted} tools, skipped {skipped} duplicates.")


def import_blogs(session, admin_user: User):
    print("\nImporting blog posts...")

    if not os.path.exists(BLOGS_DIR):
        print(f"  Blog dir not found: {BLOGS_DIR}")
        return

    html_files = sorted(Path(BLOGS_DIR).glob("*.html"))
    inserted = 0
    skipped = 0

    for filepath in html_files:
        slug = filepath.stem

        existing = session.query(Blog).filter(Blog.slug == slug).first()
        if existing:
            skipped += 1
            continue

        try:
            data = parse_blog_html(str(filepath))
        except Exception as e:
            print(f"  Error parsing {filepath.name}: {e}")
            skipped += 1
            continue

        # Enrich JSON-LD with proper URLs
        json_ld = data.get("json_ld") or {}
        if isinstance(json_ld, dict):
            graph = json_ld.get("@graph", [])
            for node in graph:
                # Fix yourdomain.com references
                def fix_url(obj):
                    if isinstance(obj, dict):
                        for k, v in obj.items():
                            if isinstance(v, str):
                                obj[k] = v.replace("https://yourdomain.com", SITE_URL)
                            elif isinstance(v, (dict, list)):
                                fix_url(v)
                    elif isinstance(obj, list):
                        for item in obj:
                            fix_url(item)
                fix_url(node)

        blog = Blog(
            id=str(uuid.uuid4()),
            title=data["title"],
            slug=data["slug"],
            content=data["content"],
            excerpt=data["excerpt"],
            author_id=admin_user.id,
            status="published",
            published_at=datetime.utcnow(),
            seo_title=data["seo_title"],
            seo_description=data["seo_description"],
            seo_keywords=data["seo_keywords"],
            json_ld=json_ld,
            is_ai_generated=True,
            tags=data["seo_keywords"].split(",")[:5] if data["seo_keywords"] else [],
            reading_time=max(1, len(data["content"]) // 1000),
        )
        session.add(blog)
        inserted += 1

        if inserted % 50 == 0:
            session.commit()
            print(f"  {inserted} blogs imported...")

    session.commit()
    print(f"  Inserted {inserted} blogs, skipped {skipped} duplicates.")


def main():
    print("=" * 60)
    print("MarketMindAI Production Data Import")
    print("=" * 60)

    create_tables()

    with Session() as session:
        admin = get_or_create_admin(session)
        cat_map, subcat_map = import_categories(session)
        import_tools(session, cat_map, subcat_map)
        import_blogs(session, admin)

    print("\n✅ Import complete!")
    print(f"   Superadmin: superadmin@marketmindai.com / SuperAdmin@2024!")


if __name__ == "__main__":
    main()

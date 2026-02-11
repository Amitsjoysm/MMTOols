"""
Initial Database Schema Migration for MarketMindAI
Creates all tables with proper indexes and constraints for PostgreSQL
"""

import sys
import os
from pathlib import Path

# Add parent directory to path to import models
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy import create_engine, text, inspect
from sqlalchemy.orm import sessionmaker
from models import Base
from database import engine, DATABASE_URL
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def create_indexes(engine):
    """Create additional indexes for performance optimization"""
    indexes = [
        # User indexes
        "CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);",
        "CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);",
        "CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);",
        "CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);",
        
        # Tool indexes
        "CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);",
        "CREATE INDEX IF NOT EXISTS idx_tools_is_active ON tools(is_active);",
        "CREATE INDEX IF NOT EXISTS idx_tools_is_featured ON tools(is_featured);",
        "CREATE INDEX IF NOT EXISTS idx_tools_pricing_type ON tools(pricing_type);",
        "CREATE INDEX IF NOT EXISTS idx_tools_trending_score ON tools(trending_score DESC);",
        "CREATE INDEX IF NOT EXISTS idx_tools_rating ON tools(rating DESC);",
        "CREATE INDEX IF NOT EXISTS idx_tools_created_at ON tools(created_at DESC);",
        
        # Category indexes
        "CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);",
        "CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);",
        
        # Blog indexes
        "CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);",
        "CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);",
        "CREATE INDEX IF NOT EXISTS idx_blogs_author_id ON blogs(author_id);",
        "CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);",
        "CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at DESC);",
        "CREATE INDEX IF NOT EXISTS idx_blogs_is_ai_generated ON blogs(is_ai_generated);",
        
        # Review indexes
        "CREATE INDEX IF NOT EXISTS idx_reviews_tool_id ON reviews(tool_id);",
        "CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);",
        "CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);",
        "CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);",
        
        # Comment indexes
        "CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON blog_comments(blog_id);",
        "CREATE INDEX IF NOT EXISTS idx_blog_comments_user_id ON blog_comments(user_id);",
        "CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON blog_comments(parent_id);",
        "CREATE INDEX IF NOT EXISTS idx_tool_comments_tool_id ON tool_comments(tool_id);",
        "CREATE INDEX IF NOT EXISTS idx_tool_comments_user_id ON tool_comments(user_id);",
        
        # Like indexes
        "CREATE INDEX IF NOT EXISTS idx_blog_likes_blog_id ON blog_likes(blog_id);",
        "CREATE INDEX IF NOT EXISTS idx_blog_likes_user_id ON blog_likes(user_id);",
        "CREATE INDEX IF NOT EXISTS idx_tool_likes_tool_id ON tool_likes(tool_id);",
        "CREATE INDEX IF NOT EXISTS idx_tool_likes_user_id ON tool_likes(user_id);",
        
        # Bookmark indexes
        "CREATE INDEX IF NOT EXISTS idx_blog_bookmarks_blog_id ON blog_bookmarks(blog_id);",
        "CREATE INDEX IF NOT EXISTS idx_blog_bookmarks_user_id ON blog_bookmarks(user_id);",
        
        # SEO and Location indexes
        "CREATE INDEX IF NOT EXISTS idx_seo_pages_page_path ON seo_pages(page_path);",
        "CREATE INDEX IF NOT EXISTS idx_locations_slug ON locations(slug);",
        "CREATE INDEX IF NOT EXISTS idx_locations_type ON locations(type);",
        "CREATE INDEX IF NOT EXISTS idx_sitemap_entries_url_path ON sitemap_entries(url_path);",
        "CREATE INDEX IF NOT EXISTS idx_sitemap_entries_page_type ON sitemap_entries(page_type);",
        
        # Contact and Newsletter indexes
        "CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);",
        "CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);",
        "CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email ON newsletter_subscriptions(email);",
        "CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_status ON newsletter_subscriptions(status);",
        
        # Site settings indexes
        "CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);",
        
        # Free tools indexes
        "CREATE INDEX IF NOT EXISTS idx_free_tools_is_active ON free_tools(is_active);",
    ]
    
    with engine.connect() as conn:
        for idx_sql in indexes:
            try:
                conn.execute(text(idx_sql))
                conn.commit()
                logger.debug(f"Created index: {idx_sql[:50]}...")
            except Exception as e:
                logger.warning(f"Index creation warning: {str(e)[:100]}")
                conn.rollback()


def run_migration():
    """Run the initial schema migration"""
    logger.info("="*70)
    logger.info("MarketMindAI - Initial Schema Migration")
    logger.info("="*70)
    logger.info(f"Database URL: {DATABASE_URL.split('@')[1] if '@' in DATABASE_URL else 'local'}")
    
    try:
        # Test database connection
        logger.info("\n[1/4] Testing database connection...")
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version();"))
            version = result.fetchone()[0]
            logger.info(f"✓ Connected to PostgreSQL: {version[:50]}...")
        
        # Check existing tables
        logger.info("\n[2/4] Checking existing schema...")
        inspector = inspect(engine)
        existing_tables = inspector.get_table_names()
        
        if existing_tables:
            logger.info(f"Found {len(existing_tables)} existing tables:")
            for table in existing_tables[:5]:
                logger.info(f"  - {table}")
            if len(existing_tables) > 5:
                logger.info(f"  ... and {len(existing_tables) - 5} more")
            
            response = input("\n⚠️  Tables already exist. Drop and recreate? (yes/no): ")
            if response.lower() == 'yes':
                logger.info("Dropping all existing tables...")
                Base.metadata.drop_all(bind=engine)
                logger.info("✓ Existing tables dropped")
            else:
                logger.info("Keeping existing tables, will create missing ones only")
        else:
            logger.info("✓ No existing tables found")
        
        # Create all tables
        logger.info("\n[3/4] Creating database tables...")
        Base.metadata.create_all(bind=engine)
        
        # Verify created tables
        inspector = inspect(engine)
        created_tables = inspector.get_table_names()
        logger.info(f"✓ Created {len(created_tables)} tables:")
        
        expected_tables = [
            'users', 'categories', 'tools', 'blogs', 'reviews',
            'blog_comments', 'blog_likes', 'blog_bookmarks',
            'tool_comments', 'tool_likes', 'user_tool_favorites',
            'tool_categories', 'seo_pages', 'contact_submissions',
            'newsletter_subscriptions', 'site_settings', 'locations',
            'sitemap_entries', 'free_tools'
        ]
        
        for table in expected_tables:
            status = "✓" if table in created_tables else "✗"
            logger.info(f"  {status} {table}")
        
        # Create indexes
        logger.info("\n[4/4] Creating performance indexes...")
        create_indexes(engine)
        logger.info("✓ Indexes created successfully")
        
        # Final verification
        logger.info("\n" + "="*70)
        logger.info("Migration completed successfully! 🎉")
        logger.info("="*70)
        logger.info(f"Total tables created: {len(created_tables)}")
        logger.info("\nNext steps:")
        logger.info("  1. Run seed_data.py to populate initial data")
        logger.info("  2. Start the application with: uvicorn server:app --reload")
        logger.info("="*70)
        
        return True
        
    except Exception as e:
        logger.error(f"\n✗ Migration failed: {str(e)}")
        logger.error("\nTroubleshooting:")
        logger.error("  1. Verify PostgreSQL is running")
        logger.error("  2. Check DATABASE_URL in .env file")
        logger.error("  3. Ensure database credentials are correct")
        logger.error("  4. Verify database 'marketmindai' exists")
        return False


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Run initial schema migration')
    parser.add_argument('--auto', action='store_true', help='Auto-confirm table recreation')
    args = parser.parse_args()
    
    success = run_migration()
    sys.exit(0 if success else 1)

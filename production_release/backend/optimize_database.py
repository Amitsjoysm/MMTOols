"""
Database Optimization Script
Adds indexes for frequently queried fields to improve performance at scale
"""

import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import logging

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://marketmind:marketmind_secure_2024@localhost:5432/marketmindai")

def add_database_indexes():
    """
    Add indexes to improve query performance for 2M+ users
    """
    engine = create_engine(DATABASE_URL)
    
    indexes = [
        # User indexes
        ("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);", "users(email)"),
        ("CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);", "users(username)"),
        ("CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);", "users(role)"),
        ("CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);", "users(is_active)"),
        ("CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);", "users(created_at)"),
        
        # Tool indexes
        ("CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);", "tools(slug)"),
        ("CREATE INDEX IF NOT EXISTS idx_tools_is_active ON tools(is_active);", "tools(is_active)"),
        ("CREATE INDEX IF NOT EXISTS idx_tools_is_featured ON tools(is_featured);", "tools(is_featured)"),
        ("CREATE INDEX IF NOT EXISTS idx_tools_rating ON tools(rating DESC);", "tools(rating)"),
        ("CREATE INDEX IF NOT EXISTS idx_tools_trending_score ON tools(trending_score DESC);", "tools(trending_score)"),
        ("CREATE INDEX IF NOT EXISTS idx_tools_created_at ON tools(created_at DESC);", "tools(created_at)"),
        ("CREATE INDEX IF NOT EXISTS idx_tools_claim_status ON tools(claim_status);", "tools(claim_status)"),
        ("CREATE INDEX IF NOT EXISTS idx_tools_claimed_by ON tools(claimed_by_user_id);", "tools(claimed_by_user_id)"),
        
        # Blog indexes
        ("CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);", "blogs(slug)"),
        ("CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);", "blogs(status)"),
        ("CREATE INDEX IF NOT EXISTS idx_blogs_author_id ON blogs(author_id);", "blogs(author_id)"),
        ("CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);", "blogs(created_at)"),
        ("CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at DESC);", "blogs(published_at)"),
        ("CREATE INDEX IF NOT EXISTS idx_blogs_view_count ON blogs(view_count DESC);", "blogs(view_count)"),
        
        # Category indexes
        ("CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);", "categories(slug)"),
        ("CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);", "categories(parent_id)"),
        
        # Review indexes
        ("CREATE INDEX IF NOT EXISTS idx_reviews_tool_id ON reviews(tool_id);", "reviews(tool_id)"),
        ("CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);", "reviews(user_id)"),
        ("CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);", "reviews(rating)"),
        ("CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);", "reviews(created_at)"),
        
        # Comment indexes
        ("CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON blog_comments(blog_id);", "blog_comments(blog_id)"),
        ("CREATE INDEX IF NOT EXISTS idx_blog_comments_user_id ON blog_comments(user_id);", "blog_comments(user_id)"),
        ("CREATE INDEX IF NOT EXISTS idx_tool_comments_tool_id ON tool_comments(tool_id);", "tool_comments(tool_id)"),
        ("CREATE INDEX IF NOT EXISTS idx_tool_comments_user_id ON tool_comments(user_id);", "tool_comments(user_id)"),
        
        # Like indexes
        ("CREATE INDEX IF NOT EXISTS idx_blog_likes_blog_id ON blog_likes(blog_id);", "blog_likes(blog_id)"),
        ("CREATE INDEX IF NOT EXISTS idx_blog_likes_user_id ON blog_likes(user_id);", "blog_likes(user_id)"),
        ("CREATE INDEX IF NOT EXISTS idx_tool_likes_tool_id ON tool_likes(tool_id);", "tool_likes(tool_id)"),
        ("CREATE INDEX IF NOT EXISTS idx_tool_likes_user_id ON tool_likes(user_id);", "tool_likes(user_id)"),
        
        # Newsletter indexes
        ("CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);", "newsletter_subscriptions(email)"),
        ("CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscriptions(status);", "newsletter_subscriptions(status)"),
        
        # Contact indexes
        ("CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);", "contact_submissions(status)"),
        ("CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_submissions(created_at DESC);", "contact_submissions(created_at)"),
        
        # Composite indexes for common queries
        ("CREATE INDEX IF NOT EXISTS idx_tools_active_featured ON tools(is_active, is_featured);", "tools(is_active, is_featured)"),
        ("CREATE INDEX IF NOT EXISTS idx_tools_claim_status_user ON tools(claim_status, claimed_by_user_id);", "tools(claim_status, claimed_by_user_id)"),
        ("CREATE INDEX IF NOT EXISTS idx_blogs_status_published ON blogs(status, published_at DESC);", "blogs(status, published_at)"),
    ]
    
    logger.info("="*60)
    logger.info("Adding database indexes for performance optimization...")
    logger.info("="*60)
    
    success_count = 0
    fail_count = 0
    
    with engine.connect() as conn:
        for sql, index_name in indexes:
            try:
                conn.execute(text(sql))
                conn.commit()
                logger.info(f"✓ Index created: {index_name}")
                success_count += 1
            except Exception as e:
                logger.warning(f"⚠ Index {index_name}: {str(e)}")
                fail_count += 1
    
    logger.info("="*60)
    logger.info(f"Indexing complete: {success_count} successful, {fail_count} skipped/failed")
    logger.info("="*60)
    
    # Analyze tables for query planner
    logger.info("\nAnalyzing tables for query optimization...")
    tables = [
        "users", "tools", "blogs", "categories", "reviews",
        "blog_comments", "tool_comments", "blog_likes", "tool_likes",
        "newsletter_subscriptions", "contact_submissions"
    ]
    
    with engine.connect() as conn:
        for table in tables:
            try:
                conn.execute(text(f"ANALYZE {table};"))
                conn.commit()
                logger.info(f"✓ Analyzed: {table}")
            except Exception as e:
                logger.warning(f"⚠ Failed to analyze {table}: {str(e)}")
    
    logger.info("\n" + "="*60)
    logger.info("Database optimization complete!")
    logger.info("="*60)

if __name__ == "__main__":
    add_database_indexes()

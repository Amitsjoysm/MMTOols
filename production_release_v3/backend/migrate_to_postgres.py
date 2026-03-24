"""
Data Migration Script: SQLite to PostgreSQL
Migrates all data from SQLite to PostgreSQL database
"""

import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from models import Base, User, Category, Tool, Blog, Review, SeoPage, BlogComment, BlogLike, BlogBookmark, ToolComment, ToolLike, ContactSubmission, NewsletterSubscription, SiteSettings, Location, SitemapEntry, FreeTool
import logging
from datetime import datetime

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database URLs
SQLITE_URL = "sqlite:///./marketmind.db"
POSTGRES_URL = "postgresql://marketmind:marketmind_secure_2024@localhost:5432/marketmindai"

def migrate_data():
    """Migrate all data from SQLite to PostgreSQL"""
    
    logger.info("="*60)
    logger.info("Starting database migration: SQLite -> PostgreSQL")
    logger.info("="*60)
    
    # Create engines
    sqlite_engine = create_engine(SQLITE_URL, connect_args={"check_same_thread": False})
    postgres_engine = create_engine(POSTGRES_URL)
    
    # Create sessions
    SqliteSession = sessionmaker(bind=sqlite_engine)
    PostgresSession = sessionmaker(bind=postgres_engine)
    
    sqlite_session = SqliteSession()
    postgres_session = PostgresSession()
    
    try:
        # Create all tables in PostgreSQL
        logger.info("Creating tables in PostgreSQL...")
        Base.metadata.create_all(postgres_engine)
        logger.info("✓ Tables created successfully")
        
        # Define migration order (respecting foreign key constraints)
        migrations = [
            (User, "Users"),
            (Category, "Categories"),
            (Tool, "Tools"),
            (Blog, "Blogs"),
            (Review, "Reviews"),
            (SeoPage, "SEO Pages"),
            (BlogComment, "Blog Comments"),
            (BlogLike, "Blog Likes"),
            (BlogBookmark, "Blog Bookmarks"),
            (ToolComment, "Tool Comments"),
            (ToolLike, "Tool Likes"),
            (ContactSubmission, "Contact Submissions"),
            (NewsletterSubscription, "Newsletter Subscriptions"),
            (SiteSettings, "Site Settings"),
            (Location, "Locations"),
            (SitemapEntry, "Sitemap Entries"),
            (FreeTool, "Free Tools"),
        ]
        
        # Handle many-to-many relationships separately
        logger.info("\n" + "="*60)
        logger.info("Migrating data...")
        logger.info("="*60)
        
        total_migrated = 0
        
        for model, name in migrations:
            try:
                # Get all records from SQLite
                records = sqlite_session.query(model).all()
                count = len(records)
                
                if count == 0:
                    logger.info(f"⊘ {name}: 0 records (skipped)")
                    continue
                
                # Migrate each record
                for record in records:
                    # Create a dictionary of all attributes
                    record_dict = {}
                    for column in model.__table__.columns:
                        record_dict[column.name] = getattr(record, column.name)
                    
                    # Create new instance for PostgreSQL
                    new_record = model(**record_dict)
                    postgres_session.merge(new_record)  # Use merge to handle existing records
                
                postgres_session.commit()
                logger.info(f"✓ {name}: {count} records migrated")
                total_migrated += count
                
            except Exception as e:
                logger.error(f"✗ {name}: Migration failed - {str(e)}")
                postgres_session.rollback()
        
        # Migrate many-to-many relationships
        logger.info("\n" + "-"*60)
        logger.info("Migrating many-to-many relationships...")
        logger.info("-"*60)
        
        # User favorites (user_tool_favorites)
        try:
            sqlite_result = sqlite_session.execute(text("SELECT * FROM user_tool_favorites"))
            favorites = sqlite_result.fetchall()
            if favorites:
                for fav in favorites:
                    postgres_session.execute(
                        text("INSERT INTO user_tool_favorites (user_id, tool_id) VALUES (:user_id, :tool_id) ON CONFLICT DO NOTHING"),
                        {"user_id": fav[0], "tool_id": fav[1]}
                    )
                postgres_session.commit()
                logger.info(f"✓ User Favorites: {len(favorites)} relationships migrated")
            else:
                logger.info(f"⊘ User Favorites: 0 relationships (skipped)")
        except Exception as e:
            logger.warning(f"⚠ User Favorites: {str(e)}")
            postgres_session.rollback()
        
        # Tool categories (tool_categories)
        try:
            sqlite_result = sqlite_session.execute(text("SELECT * FROM tool_categories"))
            tool_cats = sqlite_result.fetchall()
            if tool_cats:
                for tc in tool_cats:
                    postgres_session.execute(
                        text("INSERT INTO tool_categories (tool_id, category_id) VALUES (:tool_id, :category_id) ON CONFLICT DO NOTHING"),
                        {"tool_id": tc[0], "category_id": tc[1]}
                    )
                postgres_session.commit()
                logger.info(f"✓ Tool Categories: {len(tool_cats)} relationships migrated")
            else:
                logger.info(f"⊘ Tool Categories: 0 relationships (skipped)")
        except Exception as e:
            logger.warning(f"⚠ Tool Categories: {str(e)}")
            postgres_session.rollback()
        
        logger.info("\n" + "="*60)
        logger.info(f"Migration completed successfully!")
        logger.info(f"Total records migrated: {total_migrated}")
        logger.info("="*60)
        
        # Verify migration
        logger.info("\n" + "-"*60)
        logger.info("Verification:")
        logger.info("-"*60)
        
        for model, name in migrations:
            sqlite_count = sqlite_session.query(model).count()
            postgres_count = postgres_session.query(model).count()
            status = "✓" if sqlite_count == postgres_count else "✗"
            logger.info(f"{status} {name}: SQLite={sqlite_count}, PostgreSQL={postgres_count}")
        
        logger.info("="*60)
        
    except Exception as e:
        logger.error(f"Migration failed: {str(e)}")
        postgres_session.rollback()
        raise
    
    finally:
        sqlite_session.close()
        postgres_session.close()
        logger.info("Database connections closed")

if __name__ == "__main__":
    migrate_data()

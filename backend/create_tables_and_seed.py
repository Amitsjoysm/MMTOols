"""
Create database tables and seed with comprehensive test data
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, User, Category, Tool, Blog, Review, SiteSettings, tool_categories
from auth import get_password_hash
from datetime import datetime, timedelta
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

# Database URL
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://marketmind:marketmind_secure_2024@localhost:5432/marketmindai")

# Create engine
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

def create_tables():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created successfully!")

def seed_data():
    """Seed database with comprehensive test data"""
    session = Session()
    
    try:
        print("\n🌱 Seeding database with test data...")
        
        # Create SuperAdmin User
        print("Creating SuperAdmin user...")
        superadmin = User(
            id=str(uuid.uuid4()),
            email="superadmin@marketmind.com",
            username="superadmin",
            hashed_password=get_password_hash("admin123"),
            full_name="Super Administrator",
            role="superadmin",
            is_active=True,
            is_email_verified=True
        )
        session.add(superadmin)
        
        # Create Admin Users
        print("Creating Admin users...")
        admin1 = User(
            id=str(uuid.uuid4()),
            email="admin@marketmind.com",
            username="admin",
            hashed_password=get_password_hash("admin123"),
            full_name="Admin User",
            role="admin",
            is_active=True,
            is_email_verified=True
        )
        session.add(admin1)
        
        admin2 = User(
            id=str(uuid.uuid4()),
            email="admin2@marketmind.com",
            username="admin2",
            hashed_password=get_password_hash("admin123"),
            full_name="Second Admin",
            role="admin",
            is_active=True,
            is_email_verified=True
        )
        session.add(admin2)
        
        # Create Regular Users
        print("Creating regular users...")
        for i in range(1, 6):
            user = User(
                id=str(uuid.uuid4()),
                email=f"user{i}@example.com",
                username=f"user{i}",
                hashed_password=get_password_hash("user123"),
                full_name=f"Test User {i}",
                role="user",
                is_active=True,
                is_email_verified=True
            )
            session.add(user)
        
        session.commit()
        print("✓ Users created!")
        
        # Create Categories
        print("Creating categories...")
        categories_data = [
            {"name": "Project Management", "description": "Tools for managing projects and teams"},
            {"name": "Marketing", "description": "Marketing automation and analytics tools"},
            {"name": "CRM", "description": "Customer Relationship Management systems"},
            {"name": "Analytics", "description": "Data analysis and business intelligence"},
            {"name": "Communication", "description": "Team communication and collaboration"},
            {"name": "Development", "description": "Developer tools and platforms"},
            {"name": "Design", "description": "Design and creative tools"},
            {"name": "Sales", "description": "Sales automation and management"},
        ]
        
        categories = []
        for cat_data in categories_data:
            slug = cat_data["name"].lower().replace(" ", "-")
            category = Category(
                id=str(uuid.uuid4()),
                name=cat_data["name"],
                slug=slug,
                description=cat_data["description"],
                seo_title=f"Best {cat_data['name']} Tools",
                seo_description=f"Discover the best {cat_data['name'].lower()} tools for your business",
                seo_keywords=f"{cat_data['name'].lower()}, tools, software"
            )
            categories.append(category)
            session.add(category)
        
        # Create a subcategory
        subcategory = Category(
            id=str(uuid.uuid4()),
            name="Task Management",
            slug="task-management",
            description="Task and to-do list management tools",
            parent_id=categories[0].id,  # Child of Project Management
            seo_title="Best Task Management Tools",
            seo_description="Discover the best task management tools",
            seo_keywords="task management, todo, productivity"
        )
        categories.append(subcategory)
        session.add(subcategory)
        
        session.commit()
        print("✓ Categories created!")
        
        # Create Tools
        print("Creating tools...")
        tools_data = [
            {
                "name": "Asana",
                "description": "Asana is a web and mobile application designed to help teams organize, track, and manage their work. From lists to boards to calendars and gantt charts, organize work your way.",
                "short_description": "Work management platform for teams",
                "url": "https://asana.com",
                "pricing_type": "freemium",
                "categories": [0],  # Project Management
                "is_featured": True
            },
            {
                "name": "Trello",
                "description": "Trello is a collaboration tool that organizes your projects into boards. In one glance, Trello tells you what's being worked on, who's working on what, and where something is in a process.",
                "short_description": "Visual collaboration tool for project management",
                "url": "https://trello.com",
                "pricing_type": "freemium",
                "categories": [0, 8],  # Project Management & Task Management
                "is_featured": True
            },
            {
                "name": "HubSpot",
                "description": "HubSpot is an AI-powered customer platform with all the software, integrations, and resources you need to connect your marketing, sales, and customer service.",
                "short_description": "Complete CRM platform for growing businesses",
                "url": "https://hubspot.com",
                "pricing_type": "freemium",
                "categories": [1, 2, 7],  # Marketing, CRM, Sales
                "is_featured": True
            },
            {
                "name": "Slack",
                "description": "Slack is a messaging app for business that connects people to the information they need. By bringing people together to work as one unified team, Slack transforms the way organizations communicate.",
                "short_description": "Team communication and collaboration platform",
                "url": "https://slack.com",
                "pricing_type": "freemium",
                "categories": [4],  # Communication
                "is_featured": True
            },
            {
                "name": "GitHub",
                "description": "GitHub is the world's leading AI-powered developer platform, where developers can create, share, and ship software.",
                "short_description": "Development platform for collaborative coding",
                "url": "https://github.com",
                "pricing_type": "freemium",
                "categories": [5],  # Development
                "is_featured": False
            },
            {
                "name": "Figma",
                "description": "Figma is a collaborative interface design tool that makes it easy for teams to create, share, and test designs for websites, mobile apps, and other digital products.",
                "short_description": "Collaborative design platform",
                "url": "https://figma.com",
                "pricing_type": "freemium",
                "categories": [6],  # Design
                "is_featured": False
            },
            {
                "name": "Google Analytics",
                "description": "Google Analytics is a web analytics service that tracks and reports website traffic, helping businesses understand user behavior and optimize their online presence.",
                "short_description": "Web analytics and reporting platform",
                "url": "https://analytics.google.com",
                "pricing_type": "free",
                "categories": [3],  # Analytics
                "is_featured": True
            },
            {
                "name": "Mailchimp",
                "description": "Mailchimp is an all-in-one marketing platform that helps businesses manage and talk to their clients, customers, and other interested parties.",
                "short_description": "Email marketing and automation platform",
                "url": "https://mailchimp.com",
                "pricing_type": "freemium",
                "categories": [1],  # Marketing
                "is_featured": False
            },
        ]
        
        tools = []
        for i, tool_data in enumerate(tools_data):
            tool = Tool(
                id=str(uuid.uuid4()),
                name=tool_data["name"],
                slug=tool_data["name"].lower().replace(" ", "-"),
                description=tool_data["description"],
                short_description=tool_data["short_description"],
                url=tool_data["url"],
                pricing_type=tool_data["pricing_type"],
                is_featured=tool_data["is_featured"],
                is_active=True,
                rating=round(4.0 + (i % 11) / 10, 1),  # Ratings between 4.0 and 5.0
                review_count=10 + (i * 5),
                view_count=100 + (i * 50),
                features=["Feature 1", "Feature 2", "Feature 3"],
                pros=["Pro 1", "Pro 2"],
                cons=["Con 1"],
                seo_title=f"{tool_data['name']} - {tool_data['short_description']}",
                seo_description=tool_data["short_description"],
                assigned_admin_id=admin1.id if i % 2 == 0 else None  # Assign half to admin1
            )
            tools.append(tool)
            session.add(tool)
            
            # Add tool to categories
            for cat_idx in tool_data["categories"]:
                if cat_idx < len(categories):
                    tool.categories.append(categories[cat_idx])
        
        session.commit()
        print("✓ Tools created!")
        
        # Create Blogs
        print("Creating blog posts...")
        blog_topics = [
            ("10 Best Project Management Tools for 2024", "A comprehensive guide to the top project management tools available today."),
            ("How to Choose the Right CRM for Your Business", "Essential factors to consider when selecting a CRM system."),
            ("Marketing Automation: A Complete Guide", "Everything you need to know about marketing automation tools."),
            ("The Future of Remote Team Collaboration", "Exploring the latest trends in remote work communication tools."),
            ("Design Tools Every Creative Should Know", "A curated list of essential design tools for professionals."),
        ]
        
        for i, (title, excerpt) in enumerate(blog_topics):
            slug = title.lower().replace(" ", "-").replace(":", "")
            blog = Blog(
                id=str(uuid.uuid4()),
                title=title,
                slug=slug,
                content=f"<h2>Introduction</h2><p>{excerpt}</p><h2>Main Content</h2><p>This is a comprehensive blog post about {title.lower()}. It contains valuable insights and practical tips for businesses.</p>" * 3,
                excerpt=excerpt,
                author_id=superadmin.id,
                status="published",
                published_at=datetime.utcnow() - timedelta(days=i*2),
                reading_time=5 + i,
                view_count=200 + (i * 50),
                like_count=15 + (i * 3),
                tags=["business", "tools", "productivity"],
                seo_title=title,
                seo_description=excerpt,
                is_ai_generated=False
            )
            session.add(blog)
        
        session.commit()
        print("✓ Blogs created!")
        
        # Create Reviews
        print("Creating reviews...")
        review_comments = [
            ("Excellent tool!", "This tool has transformed our workflow. Highly recommended!"),
            ("Great but pricey", "Very powerful features but the pricing can be steep for small teams."),
            ("Good for teams", "Perfect for team collaboration. Easy to use and intuitive."),
            ("Could be better", "Good tool overall but missing some features we need."),
            ("Best in class", "Simply the best tool in its category. Worth every penny!"),
        ]
        
        for i, tool in enumerate(tools[:5]):  # Add reviews to first 5 tools
            for j, (title, content) in enumerate(review_comments):
                review = Review(
                    id=str(uuid.uuid4()),
                    user_id=superadmin.id,
                    tool_id=tool.id,
                    rating=5 - (j % 2),  # Alternate between 4 and 5 stars
                    title=title,
                    content=content,
                    pros=["Easy to use", "Great features"],
                    cons=["Can be expensive"] if j == 1 else [],
                    is_verified=True
                )
                session.add(review)
        
        session.commit()
        print("✓ Reviews created!")
        
        # Create Site Settings
        print("Creating site settings...")
        site_settings = [
            SiteSettings(
                key="site_name",
                value="MarketMindAI",
                description="Site name displayed in navbar and footer"
            ),
            SiteSettings(
                key="site_logo_url",
                value=None,
                description="Site logo URL displayed in navbar and footer"
            ),
        ]
        for setting in site_settings:
            session.add(setting)
        
        session.commit()
        print("✓ Site settings created!")
        
        print("\n✅ Database seeded successfully!")
        print("\n📝 Test Credentials:")
        print("   SuperAdmin: superadmin@marketmind.com / admin123")
        print("   Admin: admin@marketmind.com / admin123")
        print("   User: user1@example.com / user123")
        
    except Exception as e:
        print(f"\n❌ Error seeding database: {e}")
        session.rollback()
        raise
    finally:
        session.close()

if __name__ == "__main__":
    create_tables()
    seed_data()

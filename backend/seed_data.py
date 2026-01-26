"""
Seed data script for MarketMindAI
Populates the database with realistic sample data
"""
import sys
import os
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database import engine, get_db
from models import (
    Base, User, Category, Tool, Blog, Review, 
    ContactSubmission, NewsletterSubscription, FreeTool,
    tool_categories
)
from auth import get_password_hash
import uuid

def create_seed_data():
    """Create comprehensive seed data"""
    print("🌱 Starting seed data creation...")
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Get database session
    db = next(get_db())
    
    try:
        # Check if data already exists
        existing_users = db.query(User).count()
        if existing_users > 0:
            print("⚠️  Database already has data. Skipping seed...")
            response = input("Do you want to clear and reseed? (yes/no): ")
            if response.lower() != 'yes':
                print("Seed cancelled.")
                return
            # Clear existing data
            print("🗑️  Clearing existing data...")
            for table in reversed(Base.metadata.sorted_tables):
                db.execute(table.delete())
            db.commit()
        
        print("\n👥 Creating users...")
        # Create superadmin
        superadmin = User(
            id=str(uuid.uuid4()),
            email="admin@marketmindai.com",
            username="superadmin",
            hashed_password=get_password_hash("admin123"),
            full_name="Super Admin",
            role="superadmin",
            is_active=True,
            is_email_verified=True,
            bio="MarketMindAI Platform Administrator"
        )
        db.add(superadmin)
        
        # Create admin
        admin = User(
            id=str(uuid.uuid4()),
            email="editor@marketmindai.com",
            username="editor",
            hashed_password=get_password_hash("editor123"),
            full_name="Content Editor",
            role="admin",
            is_active=True,
            is_email_verified=True,
            bio="Content editor and moderator"
        )
        db.add(admin)
        
        # Create regular users
        users = []
        user_data = [
            ("john.doe@example.com", "johndoe", "John Doe", "Tech enthusiast and AI researcher"),
            ("sarah.smith@example.com", "sarahsmith", "Sarah Smith", "Product manager and tool reviewer"),
            ("mike.johnson@example.com", "mikej", "Mike Johnson", "Software developer and blogger"),
            ("emma.wilson@example.com", "emmaw", "Emma Wilson", "Marketing professional"),
            ("david.brown@example.com", "davidb", "David Brown", "Startup founder and tech advocate"),
        ]
        
        for email, username, full_name, bio in user_data:
            user = User(
                id=str(uuid.uuid4()),
                email=email,
                username=username,
                hashed_password=get_password_hash("password123"),
                full_name=full_name,
                role="user",
                is_active=True,
                is_email_verified=True,
                bio=bio
            )
            users.append(user)
            db.add(user)
        
        db.commit()
        print(f"✅ Created {len(users) + 2} users (1 superadmin, 1 admin, {len(users)} regular users)")
        
        print("\n📁 Creating categories...")
        categories_data = [
            ("AI & Machine Learning", "ai-machine-learning", "Artificial intelligence and machine learning tools"),
            ("Productivity", "productivity", "Tools to boost productivity and efficiency"),
            ("Marketing & Sales", "marketing-sales", "Marketing automation and sales tools"),
            ("Development Tools", "development-tools", "Software development and coding tools"),
            ("Design & Creative", "design-creative", "Design, graphics, and creative tools"),
            ("Communication", "communication", "Team communication and collaboration tools"),
            ("Project Management", "project-management", "Project and task management solutions"),
            ("Analytics & Data", "analytics-data", "Data analysis and business intelligence tools"),
            ("Customer Support", "customer-support", "Customer service and support platforms"),
            ("Finance & Accounting", "finance-accounting", "Financial management and accounting software"),
        ]
        
        categories = []
        for name, slug, description in categories_data:
            category = Category(
                id=str(uuid.uuid4()),
                name=name,
                slug=slug,
                description=description,
                seo_title=f"{name} - Best Tools & Solutions",
                seo_description=f"Discover the best {name.lower()} tools. Compare features, pricing, and reviews.",
                seo_keywords=f"{name.lower()}, tools, software, solutions"
            )
            categories.append(category)
            db.add(category)
        
        db.commit()
        print(f"✅ Created {len(categories)} categories")
        
        print("\n🔧 Creating tools...")
        tools_data = [
            {
                "name": "ChatGPT",
                "description": "ChatGPT is an advanced AI language model developed by OpenAI that can engage in natural conversations, answer questions, generate content, assist with coding, and help with various tasks. It uses state-of-the-art natural language processing to understand context and provide helpful, detailed responses.",
                "short_description": "Advanced AI chatbot for conversations, content creation, and task assistance",
                "url": "https://chat.openai.com",
                "pricing_type": "freemium",
                "pricing_details": {"free": "Limited access", "plus": "$20/month", "team": "$30/user/month"},
                "features": ["Natural language conversations", "Code generation", "Content writing", "Question answering", "Multiple languages", "Creative writing"],
                "pros": ["Highly intelligent responses", "Versatile capabilities", "User-friendly interface", "Regular updates"],
                "cons": ["May have knowledge cutoff", "Can sometimes provide incorrect info", "Paid features required for best experience"],
                "rating": 4.8,
                "review_count": 1250,
                "view_count": 15420,
                "is_featured": True,
                "categories": ["AI & Machine Learning", "Productivity"],
                "about": "OpenAI's ChatGPT represents a breakthrough in conversational AI technology, offering unprecedented natural language understanding and generation capabilities.",
                "started_on": "November 2022",
                "company_location": "San Francisco, CA, USA"
            },
            {
                "name": "Notion",
                "description": "Notion is an all-in-one workspace that combines notes, documents, wikis, databases, and project management. It's highly customizable and perfect for individuals and teams looking to centralize their work and knowledge.",
                "short_description": "All-in-one workspace for notes, docs, and project management",
                "url": "https://notion.so",
                "pricing_type": "freemium",
                "pricing_details": {"free": "Personal use", "plus": "$10/user/month", "business": "$18/user/month"},
                "features": ["Rich text editor", "Databases", "Kanban boards", "Wiki pages", "Templates", "Team collaboration", "API access"],
                "pros": ["Extremely flexible", "Beautiful interface", "Great templates", "Powerful databases"],
                "cons": ["Learning curve", "Can be slow with large databases", "Mobile app limitations"],
                "rating": 4.6,
                "review_count": 980,
                "view_count": 12350,
                "is_featured": True,
                "categories": ["Productivity", "Project Management"],
                "about": "Notion has revolutionized how teams organize information and collaborate on projects with its flexible block-based system.",
                "started_on": "March 2016",
                "company_location": "San Francisco, CA, USA"
            },
            {
                "name": "Figma",
                "description": "Figma is a collaborative interface design tool that runs in the browser. It's perfect for designing user interfaces, prototyping, and team collaboration. Real-time collaboration features make it the go-to choice for modern design teams.",
                "short_description": "Collaborative interface design and prototyping tool",
                "url": "https://figma.com",
                "pricing_type": "freemium",
                "pricing_details": {"free": "3 files", "professional": "$12/editor/month", "organization": "$45/editor/month"},
                "features": ["Vector design", "Prototyping", "Real-time collaboration", "Component library", "Auto-layout", "Design systems", "Developer handoff"],
                "pros": ["Browser-based", "Real-time collaboration", "Powerful prototyping", "Free for individuals"],
                "cons": ["Requires internet", "Can be resource-intensive", "Limited offline mode"],
                "rating": 4.7,
                "review_count": 856,
                "view_count": 9840,
                "is_featured": True,
                "categories": ["Design & Creative"],
                "about": "Figma has become the industry standard for UI/UX design, enabling seamless collaboration between designers and developers.",
                "started_on": "September 2016",
                "company_location": "San Francisco, CA, USA"
            },
            {
                "name": "Slack",
                "description": "Slack is a business communication platform offering chat rooms organized by topic, along with private groups and direct messaging. It integrates with numerous business tools and services, making team communication seamless and organized.",
                "short_description": "Team communication and collaboration platform",
                "url": "https://slack.com",
                "pricing_type": "freemium",
                "pricing_details": {"free": "Limited history", "pro": "$7.25/user/month", "business": "$12.50/user/month"},
                "features": ["Channels", "Direct messaging", "File sharing", "Voice/video calls", "App integrations", "Search", "Workflow builder"],
                "pros": ["Intuitive interface", "Great integrations", "Organized communication", "Mobile apps"],
                "cons": ["Can be distracting", "Free tier limitations", "Search in free version limited"],
                "rating": 4.5,
                "review_count": 1420,
                "view_count": 11230,
                "is_featured": True,
                "categories": ["Communication", "Productivity"],
                "about": "Slack has transformed workplace communication, making it easier for teams to stay connected and productive.",
                "started_on": "August 2013",
                "company_location": "San Francisco, CA, USA"
            },
            {
                "name": "Zapier",
                "description": "Zapier is an automation platform that connects your favorite apps and services to automate repetitive tasks without coding. With support for 5,000+ apps, you can create powerful workflows called Zaps that save time and increase productivity.",
                "short_description": "Automation platform connecting 5,000+ apps",
                "url": "https://zapier.com",
                "pricing_type": "freemium",
                "pricing_details": {"free": "100 tasks/month", "starter": "$19.99/month", "professional": "$49/month"},
                "features": ["5000+ app integrations", "Multi-step workflows", "Filters & formatters", "Webhooks", "Scheduling", "Error handling", "Team collaboration"],
                "pros": ["No coding required", "Huge app library", "Reliable automation", "Time-saving"],
                "cons": ["Can get expensive", "Complex workflows need paid plans", "Learning curve for advanced features"],
                "rating": 4.6,
                "review_count": 745,
                "view_count": 8650,
                "is_featured": True,
                "categories": ["Productivity", "AI & Machine Learning"],
                "about": "Zapier empowers anyone to create powerful automations between their favorite apps without writing code.",
                "started_on": "June 2012",
                "company_location": "San Francisco, CA, USA"
            },
            {
                "name": "HubSpot",
                "description": "HubSpot is a comprehensive CRM platform with marketing, sales, customer service, and operations tools. It helps businesses grow by attracting, engaging, and delighting customers with inbound marketing strategies.",
                "short_description": "Complete CRM platform for marketing, sales, and service",
                "url": "https://hubspot.com",
                "pricing_type": "freemium",
                "pricing_details": {"free": "Basic CRM", "starter": "$50/month", "professional": "$800/month"},
                "features": ["CRM", "Email marketing", "Landing pages", "Analytics", "Sales automation", "Customer service tools", "Marketing automation"],
                "pros": ["Comprehensive platform", "Free CRM", "Great support", "Extensive features"],
                "cons": ["Expensive at scale", "Complex for beginners", "Some features only in higher tiers"],
                "rating": 4.4,
                "review_count": 892,
                "view_count": 10420,
                "is_featured": True,
                "categories": ["Marketing & Sales", "Customer Support"],
                "about": "HubSpot provides businesses with all the tools needed to attract, engage, and delight customers in one integrated platform.",
                "started_on": "June 2006",
                "company_location": "Cambridge, MA, USA"
            },
            {
                "name": "Canva",
                "description": "Canva is a graphic design platform that makes it easy to create social media graphics, presentations, posters, and other visual content. With thousands of templates and a drag-and-drop interface, anyone can create professional designs.",
                "short_description": "Easy-to-use graphic design platform",
                "url": "https://canva.com",
                "pricing_type": "freemium",
                "pricing_details": {"free": "Basic features", "pro": "$12.99/month", "teams": "$14.99/user/month"},
                "features": ["Templates", "Drag-and-drop editor", "Stock photos", "Brand kit", "Collaboration", "Magic resize", "Background remover"],
                "pros": ["Beginner-friendly", "Huge template library", "Affordable", "Regular updates"],
                "cons": ["Limited customization vs pro tools", "Free version watermarks", "Can be slow"],
                "rating": 4.7,
                "review_count": 1156,
                "view_count": 13580,
                "is_featured": True,
                "categories": ["Design & Creative", "Marketing & Sales"],
                "about": "Canva democratizes design, making it accessible to everyone regardless of design experience.",
                "started_on": "January 2013",
                "company_location": "Sydney, Australia"
            },
            {
                "name": "Trello",
                "description": "Trello is a visual project management tool that uses boards, lists, and cards to organize tasks and projects. It's based on the Kanban methodology and is perfect for individuals and teams looking for a simple, visual way to manage work.",
                "short_description": "Visual project management with Kanban boards",
                "url": "https://trello.com",
                "pricing_type": "freemium",
                "pricing_details": {"free": "Unlimited cards", "standard": "$5/user/month", "premium": "$10/user/month"},
                "features": ["Kanban boards", "Lists & cards", "Checklists", "Due dates", "Labels", "Power-ups", "Templates", "Mobile apps"],
                "pros": ["Simple and intuitive", "Visual organization", "Good free tier", "Many integrations"],
                "cons": ["Limited reporting", "Basic features", "Can get cluttered"],
                "rating": 4.5,
                "review_count": 678,
                "view_count": 7890,
                "is_featured": False,
                "categories": ["Project Management", "Productivity"],
                "about": "Trello makes project management visual and collaborative with its intuitive board-based system.",
                "started_on": "September 2011",
                "company_location": "New York, NY, USA"
            },
            {
                "name": "Google Analytics",
                "description": "Google Analytics is a web analytics service that tracks and reports website traffic. It provides insights into user behavior, traffic sources, conversion rates, and more, helping businesses make data-driven decisions.",
                "short_description": "Web analytics and reporting platform",
                "url": "https://analytics.google.com",
                "pricing_type": "freemium",
                "pricing_details": {"free": "Standard features", "360": "Enterprise pricing"},
                "features": ["Traffic analysis", "User behavior tracking", "Conversion tracking", "Custom reports", "Real-time data", "Goal tracking", "E-commerce tracking"],
                "pros": ["Free for most users", "Comprehensive data", "Integration with Google tools", "Industry standard"],
                "cons": ["Learning curve", "Privacy concerns", "Can be overwhelming"],
                "rating": 4.4,
                "review_count": 892,
                "view_count": 9560,
                "is_featured": False,
                "categories": ["Analytics & Data", "Marketing & Sales"],
                "about": "Google Analytics is the world's most popular web analytics platform, providing deep insights into website performance.",
                "started_on": "November 2005",
                "company_location": "Mountain View, CA, USA"
            },
            {
                "name": "Asana",
                "description": "Asana is a work management platform that helps teams organize, track, and manage their work. With features like timelines, portfolios, and workload management, it's designed for teams that need robust project management capabilities.",
                "short_description": "Work management platform for teams",
                "url": "https://asana.com",
                "pricing_type": "freemium",
                "pricing_details": {"free": "Up to 15 users", "premium": "$10.99/user/month", "business": "$24.99/user/month"},
                "features": ["Task management", "Timeline view", "Workload management", "Portfolios", "Custom fields", "Automation", "Reporting"],
                "pros": ["Powerful features", "Great for larger teams", "Good reporting", "Flexible views"],
                "cons": ["Can be complex", "Expensive for teams", "Mobile app limitations"],
                "rating": 4.5,
                "review_count": 756,
                "view_count": 8450,
                "is_featured": False,
                "categories": ["Project Management"],
                "about": "Asana helps teams stay organized and focused on what matters most with powerful project management features.",
                "started_on": "April 2012",
                "company_location": "San Francisco, CA, USA"
            },
        ]
        
        tools = []
        for tool_data in tools_data:
            # Find category objects
            category_names = tool_data.get("categories", [])
            tool_categories_obj = [cat for cat in categories if cat.name in category_names]
            
            tool = Tool(
                id=str(uuid.uuid4()),
                name=tool_data["name"],
                slug=tool_data["name"].lower().replace(" ", "-"),
                description=tool_data["description"],
                short_description=tool_data["short_description"],
                url=tool_data["url"],
                pricing_type=tool_data["pricing_type"],
                pricing_details=tool_data["pricing_details"],
                features=tool_data["features"],
                pros=tool_data["pros"],
                cons=tool_data["cons"],
                rating=tool_data["rating"],
                review_count=tool_data["review_count"],
                view_count=tool_data["view_count"],
                like_count=int(tool_data["view_count"] * 0.1),
                trending_score=tool_data["rating"] * (tool_data["view_count"] / 100),
                is_featured=tool_data["is_featured"],
                is_active=True,
                about=tool_data.get("about"),
                started_on=tool_data.get("started_on"),
                company_location=tool_data.get("company_location"),
                categories=tool_categories_obj
            )
            tools.append(tool)
            db.add(tool)
        
        db.commit()
        print(f"✅ Created {len(tools)} tools")
        
        print("\n📝 Creating blogs...")
        blogs_data = [
            {
                "title": "The Future of AI: Trends to Watch in 2024",
                "content": """# The Future of AI: Trends to Watch in 2024

Artificial Intelligence continues to evolve at a breathtaking pace. As we move through 2024, several key trends are emerging that will shape the future of AI and how businesses leverage these technologies.

## 1. Generative AI Goes Mainstream

Generative AI tools like ChatGPT and Midjourney have captured the public imagination, but 2024 will see these technologies integrated into everyday business workflows. From content creation to code generation, generative AI is becoming an essential productivity tool.

## 2. AI Ethics and Regulation

With the rapid adoption of AI comes increased scrutiny. Governments worldwide are working on AI regulation frameworks to ensure responsible development and deployment. Businesses must prioritize ethical AI practices and transparency.

## 3. Multimodal AI Systems

The next generation of AI systems will seamlessly work with text, images, audio, and video. These multimodal systems will enable more natural and intuitive interactions between humans and machines.

## 4. AI-Powered Personalization

Businesses are using AI to deliver hyper-personalized experiences across all customer touchpoints. From product recommendations to customer service, AI enables unprecedented levels of personalization at scale.

## Conclusion

The AI revolution is just beginning. Organizations that embrace these trends and invest in AI capabilities will be well-positioned for success in the coming years. Stay informed, experiment with new tools, and always prioritize ethical considerations in your AI initiatives.""",
                "excerpt": "Explore the key AI trends shaping 2024, from generative AI to ethical considerations and multimodal systems.",
                "tags": ["AI", "Technology", "Trends", "Innovation"],
                "author": superadmin,
                "status": "published"
            },
            {
                "title": "10 Productivity Tools Every Remote Team Needs",
                "content": """# 10 Productivity Tools Every Remote Team Needs

Remote work is here to stay, and having the right tools can make all the difference in team productivity and collaboration. Here are 10 essential tools every remote team should consider.

## 1. Communication Platforms

**Slack** and **Microsoft Teams** enable real-time communication and keep teams connected across time zones and locations.

## 2. Project Management

**Asana**, **Trello**, and **Monday.com** help teams organize tasks, track progress, and meet deadlines effectively.

## 3. Video Conferencing

**Zoom** and **Google Meet** are essential for face-to-face meetings, presentations, and maintaining team connections.

## 4. Document Collaboration

**Google Workspace** and **Notion** enable teams to create, edit, and share documents in real-time.

## 5. Time Management

**Toggl** and **RescueTime** help track time and maintain productivity when working remotely.

## 6. Password Management

**1Password** and **LastPass** keep team credentials secure and easily accessible.

## 7. Design Collaboration

**Figma** revolutionizes how design teams work together on interface design and prototypes.

## 8. Code Collaboration

**GitHub** and **GitLab** are essential for development teams working on software projects.

## 9. Customer Support

**Zendesk** and **Intercom** help teams provide excellent customer service from anywhere.

## 10. Automation

**Zapier** connects your apps and automates workflows, saving time on repetitive tasks.

## Conclusion

The right combination of tools can transform remote team productivity. Evaluate your team's needs and invest in tools that facilitate seamless collaboration and communication.""",
                "excerpt": "Discover the essential productivity tools that help remote teams collaborate effectively and stay productive.",
                "tags": ["Productivity", "Remote Work", "Tools", "Collaboration"],
                "author": admin,
                "status": "published"
            },
            {
                "title": "Getting Started with ChatGPT for Business",
                "content": """# Getting Started with ChatGPT for Business

ChatGPT has become one of the most talked-about AI tools in recent years. But how can businesses effectively leverage this powerful technology? This guide will help you get started.

## Understanding ChatGPT

ChatGPT is an AI language model that can understand and generate human-like text. It can assist with various tasks including content creation, customer service, coding, and more.

## Business Use Cases

### Content Creation
Generate blog posts, social media content, and marketing copy quickly and efficiently.

### Customer Support
Use ChatGPT to handle common customer inquiries and provide 24/7 support.

### Research and Analysis
Quickly summarize documents, analyze data, and generate insights.

### Code Generation
Help developers write, debug, and document code more efficiently.

## Best Practices

1. **Be Specific**: Clear, detailed prompts yield better results
2. **Iterate**: Refine responses through follow-up questions
3. **Verify**: Always fact-check important information
4. **Customize**: Train on your specific use case for better results

## Getting Started

1. Sign up for a ChatGPT account
2. Explore the free tier to understand capabilities
3. Consider ChatGPT Plus or Enterprise for business use
4. Develop clear guidelines for your team
5. Monitor and measure impact

## Conclusion

ChatGPT is a powerful tool that can transform how businesses operate. Start small, experiment with different use cases, and scale what works best for your organization.""",
                "excerpt": "Learn how to effectively leverage ChatGPT for business applications, from content creation to customer support.",
                "tags": ["ChatGPT", "AI", "Business", "Productivity"],
                "author": users[0],
                "status": "published"
            },
            {
                "title": "Design System Best Practices with Figma",
                "content": """# Design System Best Practices with Figma

Design systems are essential for maintaining consistency and efficiency in product design. Figma has become the go-to tool for building and maintaining design systems. Here's how to do it right.

## Why Design Systems Matter

Design systems provide a single source of truth for your design language, ensuring consistency across all products and platforms while speeding up the design process.

## Setting Up Your Design System

### 1. Foundation
Start with core elements: colors, typography, spacing, and grid systems.

### 2. Components
Build reusable components for buttons, forms, navigation, and other UI elements.

### 3. Patterns
Document common design patterns and when to use them.

### 4. Documentation
Include guidelines, examples, and best practices for each component.

## Figma Features for Design Systems

- **Components and Variants**: Create flexible, reusable components
- **Styles**: Maintain consistent colors, text, and effects
- **Auto Layout**: Build responsive components
- **Libraries**: Share components across files and teams

## Maintenance Tips

1. Regular audits to ensure consistency
2. Version control for tracking changes
3. Clear contribution guidelines
4. Regular team reviews and updates

## Conclusion

A well-maintained design system in Figma can dramatically improve design efficiency and consistency. Invest time in building it right, and your team will reap the benefits.""",
                "excerpt": "Master design system creation and maintenance using Figma's powerful features.",
                "tags": ["Design", "Figma", "Design Systems", "UI/UX"],
                "author": users[1],
                "status": "published"
            },
            {
                "title": "Automation Strategies for Small Businesses",
                "content": """# Automation Strategies for Small Businesses

Small businesses often operate with limited resources. Automation can help you do more with less, freeing up time to focus on growth and customer relationships.

## Why Automate?

Automation helps small businesses:
- Save time on repetitive tasks
- Reduce human error
- Scale operations efficiently
- Improve customer experience
- Focus on strategic work

## Key Areas to Automate

### 1. Marketing
- Email campaigns
- Social media posting
- Lead nurturing
- Analytics reporting

### 2. Sales
- Lead qualification
- Follow-up emails
- CRM updates
- Proposal generation

### 3. Operations
- Invoicing and payments
- Inventory management
- Data entry
- Reporting

### 4. Customer Service
- Chatbots for common questions
- Ticket routing
- Follow-up surveys
- Knowledge base updates

## Tools to Get Started

- **Zapier**: Connect apps and automate workflows
- **HubSpot**: CRM with marketing automation
- **Mailchimp**: Email marketing automation
- **QuickBooks**: Financial automation

## Implementation Tips

1. Start small with one process
2. Document your workflows first
3. Test thoroughly before full rollout
4. Train your team
5. Measure and optimize

## Conclusion

Automation doesn't have to be expensive or complicated. Start with simple workflows and gradually expand as you see results.""",
                "excerpt": "Practical automation strategies to help small businesses save time and scale efficiently.",
                "tags": ["Automation", "Small Business", "Productivity", "Efficiency"],
                "author": users[2],
                "status": "published"
            },
        ]
        
        blogs = []
        for i, blog_data in enumerate(blogs_data):
            author = blog_data.pop("author")
            published_at = datetime.utcnow() - timedelta(days=len(blogs_data) - i)
            
            blog = Blog(
                id=str(uuid.uuid4()),
                title=blog_data["title"],
                slug=blog_data["title"].lower().replace(" ", "-").replace(":", ""),
                content=blog_data["content"],
                excerpt=blog_data["excerpt"],
                author_id=author.id,
                status=blog_data["status"],
                tags=blog_data["tags"],
                reading_time=len(blog_data["content"].split()) // 200 + 1,
                view_count=500 + (i * 100),
                like_count=50 + (i * 10),
                published_at=published_at,
                is_ai_generated=False,
                seo_title=blog_data["title"],
                seo_description=blog_data["excerpt"],
                seo_keywords=", ".join(blog_data["tags"])
            )
            blogs.append(blog)
            db.add(blog)
        
        db.commit()
        print(f"✅ Created {len(blogs)} blogs")
        
        print("\n⭐ Creating reviews...")
        # Create reviews for tools
        review_contents = [
            ("Excellent tool!", "This tool has transformed how we work. Highly recommended!", 5),
            ("Great value", "Good features at a reasonable price. Worth trying.", 4),
            ("Could be better", "It works but has some limitations. Customer support is responsive.", 3),
            ("Fantastic product", "Everything we needed and more. The best in its category.", 5),
            ("Solid choice", "Reliable and feature-rich. Minor issues but overall great.", 4),
        ]
        
        reviews_created = 0
        for tool in tools[:5]:  # Add reviews to first 5 tools
            for i, (title, content, rating) in enumerate(review_contents[:3]):
                review = Review(
                    id=str(uuid.uuid4()),
                    user_id=users[i % len(users)].id,
                    tool_id=tool.id,
                    rating=rating,
                    title=title,
                    content=content,
                    pros=["Easy to use", "Great features"] if rating >= 4 else ["Decent features"],
                    cons=["Expensive"] if rating < 4 else [],
                    is_verified=True
                )
                db.add(review)
                reviews_created += 1
        
        db.commit()
        print(f"✅ Created {reviews_created} reviews")
        
        print("\n✉️ Creating contact submissions...")
        contact_data = [
            ("John Smith", "john@example.com", "ABC Corp", "Partnership Inquiry", "Interested in partnership opportunities", "partnership"),
            ("Jane Doe", "jane@example.com", None, "Feature Request", "Would love to see feature X", "feature"),
            ("Bob Wilson", "bob@example.com", "XYZ Inc", "General Question", "How does pricing work?", "general"),
        ]
        
        for name, email, company, subject, message, inquiry_type in contact_data:
            contact = ContactSubmission(
                id=str(uuid.uuid4()),
                name=name,
                email=email,
                company=company,
                subject=subject,
                message=message,
                inquiry_type=inquiry_type,
                status="new"
            )
            db.add(contact)
        
        db.commit()
        print(f"✅ Created {len(contact_data)} contact submissions")
        
        print("\n📧 Creating newsletter subscriptions...")
        newsletter_emails = [
            "subscriber1@example.com",
            "subscriber2@example.com",
            "subscriber3@example.com",
            "subscriber4@example.com",
            "subscriber5@example.com",
        ]
        
        for email in newsletter_emails:
            subscription = NewsletterSubscription(
                id=str(uuid.uuid4()),
                email=email,
                status="active",
                source="website"
            )
            db.add(subscription)
        
        db.commit()
        print(f"✅ Created {len(newsletter_emails)} newsletter subscriptions")
        
        print("\n🛠️ Creating free tools...")
        free_tools_data = [
            ("SEO Analyzer", "/free-tools/seo-analyzer", "Analyze your website's SEO performance"),
            ("Keyword Research", "/free-tools/keyword-research", "Find the best keywords for your content"),
            ("Backlink Checker", "/free-tools/backlink-checker", "Check your website's backlinks"),
        ]
        
        for name, link, description in free_tools_data:
            free_tool = FreeTool(
                id=str(uuid.uuid4()),
                name=name,
                link=link,
                description=description,
                is_active=True
            )
            db.add(free_tool)
        
        db.commit()
        print(f"✅ Created {len(free_tools_data)} free tools")
        
        print("\n✨ Seed data creation completed successfully!")
        print("\n📊 Summary:")
        print(f"  - Users: {len(users) + 2}")
        print(f"  - Categories: {len(categories)}")
        print(f"  - Tools: {len(tools)}")
        print(f"  - Blogs: {len(blogs)}")
        print(f"  - Reviews: {reviews_created}")
        print(f"  - Contact Submissions: {len(contact_data)}")
        print(f"  - Newsletter Subscribers: {len(newsletter_emails)}")
        print(f"  - Free Tools: {len(free_tools_data)}")
        
        print("\n🔑 Login Credentials:")
        print("  Superadmin: admin@marketmindai.com / admin123")
        print("  Admin: editor@marketmindai.com / editor123")
        print("  User: john.doe@example.com / password123")
        
    except Exception as e:
        print(f"\n❌ Error creating seed data: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_seed_data()

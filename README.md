# MarketMindAI - B2B Blogging and Tools Platform

A comprehensive B2B platform for AI tools directory, blogging, and content management built with FastAPI and Astro.

## 🚀 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Production database with SQLAlchemy ORM
- **Redis** - Caching layer (optional)
- **Python 3.11+** - Core language

### Frontend
- **Astro 5.x** - Static site generator
- **TailwindCSS** - Utility-first CSS
- **TipTap** - Rich text editor
- **TypeScript** - Type-safe JavaScript

## 📋 Prerequisites

- Python 3.11+
- Node.js 18.17.1 or 20.3.0+
- PostgreSQL 14+
- yarn package manager

## 🛠️ Installation

### 1. Clone Repository
```bash
git clone -b supadredirect https://github.com/Amitsjoysm/MMTOols.git
cd MMTOols
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials
```

**Required environment variables in `.env`:**
```env
DATABASE_URL=postgresql://marketmind:marketmind_secure_2024@localhost:5432/marketmindai
SECRET_KEY=your-secret-key-here
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:3000,http://localhost:4321
FRONTEND_URL=http://localhost:4321
API_URL=http://localhost:8001
```

### 3. Database Setup

```bash
# Create PostgreSQL database
sudo -u postgres psql
CREATE DATABASE marketmindai;
CREATE USER marketmind WITH PASSWORD 'marketmind_secure_2024';
GRANT ALL PRIVILEGES ON DATABASE marketmindai TO marketmind;
\q

# Run migrations
cd /app/backend
python migrations/001_initial_schema.py

# Seed sample data (optional)
python seed_data.py
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
yarn install

# Configure environment
cp .env.example .env
# Edit .env if needed
```

## 🚦 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
yarn dev
```

Access the application:
- **Frontend**: http://localhost:4321
- **Backend API**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs

### Production Mode

```bash
# Backend
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --workers 4

# Frontend
cd frontend
yarn build
yarn preview
```

## 📁 Project Structure

```
/app/
├── backend/
│   ├── migrations/          # Database migration scripts
│   │   ├── 001_initial_schema.py
│   │   └── README.md
│   ├── models.py            # SQLAlchemy models
│   ├── server.py            # FastAPI application
│   ├── database.py          # Database configuration
│   ├── auth.py              # Authentication utilities
│   ├── seed_data.py         # Database seeding script
│   ├── requirements.txt     # Python dependencies
│   ├── *_routes.py          # API route modules
│   └── .env                 # Environment variables
├── frontend/
│   ├── src/                 # Astro source files
│   ├── public/              # Static assets
│   ├── package.json         # Node dependencies
│   └── astro.config.mjs     # Astro configuration
└── old/                     # Archived files (documentation, tests, etc.)
```

## 🗄️ Database Models

- **User** - User accounts with roles (user, admin, superadmin)
- **Tool** - AI tools directory with reviews and ratings
- **Category** - Hierarchical categories for tools
- **Blog** - Blog posts with SEO fields
- **Review** - User reviews for tools
- **BlogComment, ToolComment** - Comments system
- **BlogLike, ToolLike** - Like functionality
- **ContactSubmission** - Contact form submissions
- **NewsletterSubscription** - Newsletter subscribers
- **Location** - Geographic locations for SEO
- **SitemapEntry** - Dynamic sitemap management
- **FreeTool** - Free tools directory

## 🔑 Default Credentials (After Seeding)

- **Superadmin**: admin@marketmindai.com / admin123
- **Admin**: editor@marketmindai.com / editor123
- **User**: john.doe@example.com / password123

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
yarn test
```

## 📝 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting middleware
- CORS protection
- SQL injection prevention (SQLAlchemy ORM)
- XSS protection
- Security headers middleware

## 🚀 Deployment

See `/app/old/PRODUCTION_DEPLOYMENT.md` for detailed deployment instructions.

## 📚 Documentation

Additional documentation available in `/app/old/`:
- QUICKSTART.md
- PRODUCTION_READY.md
- AAPANEL_DEPLOYMENT_GUIDE.md
- And more...

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is proprietary software for MarketMindAI.

## 🆘 Support

For issues and questions:
- Check documentation in `/app/old/`
- Review migration README: `/app/backend/migrations/README.md`
- Check API documentation: http://localhost:8001/docs

## 📋 Changelog

### v2.0.0 - Cleanup & PostgreSQL Migration
- Removed emergent dependencies
- Cleaned up unnecessary files
- Created proper migration scripts
- Organized project structure
- Added comprehensive documentation

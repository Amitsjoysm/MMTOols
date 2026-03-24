from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import subprocess
import time
from dotenv import load_dotenv

load_dotenv()

def _ensure_postgres():
    """Auto-start PostgreSQL if it's not running (for container environments)"""
    try:
        import psycopg2
        db_url = os.getenv("DATABASE_URL", "")
        if "postgresql" not in db_url:
            return
        # Extract connection params
        import re
        m = re.match(r'postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(\w+)', db_url)
        if not m: return
        user, pwd, host, port, dbname = m.groups()
        # Try to connect first
        try:
            conn = psycopg2.connect(dbname=dbname, user=user, password=pwd, host=host, port=int(port), connect_timeout=2)
            conn.close()
            return  # Already running
        except psycopg2.OperationalError:
            pass  # Need to start
        # Start PostgreSQL
        for cmd in ["service postgresql start", "pg_ctlcluster 15 main start"]:
            try:
                result = subprocess.run(cmd, shell=True, capture_output=True, timeout=10)
                if result.returncode == 0:
                    time.sleep(2)
                    # Ensure DB exists
                    try:
                        subprocess.run(
                            f"sudo -u postgres psql -c \"CREATE USER {user} WITH PASSWORD '{pwd}';\" 2>/dev/null; "
                            f"sudo -u postgres psql -c \"CREATE DATABASE {dbname} OWNER {user};\" 2>/dev/null; "
                            f"sudo -u postgres psql -c \"GRANT ALL PRIVILEGES ON DATABASE {dbname} TO {user};\" 2>/dev/null",
                            shell=True, timeout=15
                        )
                    except: pass
                    return
            except: continue
    except Exception:
        pass

_ensure_postgres()

# Database URL from environment - supports both SQLite and PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://marketmind:marketmind_secure_2024@localhost:5432/marketmindai")

# Create engine with appropriate settings for each database type
if "sqlite" in DATABASE_URL:
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
elif "postgresql" in DATABASE_URL:
    engine = create_engine(
        DATABASE_URL,
        pool_size=20,
        max_overflow=40,
        pool_pre_ping=True,
        pool_recycle=3600,
        echo=False
    )
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
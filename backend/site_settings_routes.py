"""
Site Settings Routes - API for managing site-wide settings including logo
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from models import SiteSettings
from auth import get_current_superadmin
import os
import uuid
from datetime import datetime

router = APIRouter()

# Pydantic models
class SiteSettingsResponse(BaseModel):
    key: str
    value: Optional[str]
    description: Optional[str]
    
class LogoResponse(BaseModel):
    logo_url: Optional[str]
    site_name: str
    
class UpdateLogoRequest(BaseModel):
    logo_url: str
    
class UpdateSiteNameRequest(BaseModel):
    site_name: str

# Public endpoint - Get site logo
@router.get("/site-settings/logo", response_model=LogoResponse)
async def get_site_logo(db: Session = Depends(get_db)):
    """Get the site logo URL - public endpoint"""
    logo_setting = db.query(SiteSettings).filter(SiteSettings.key == "site_logo_url").first()
    name_setting = db.query(SiteSettings).filter(SiteSettings.key == "site_name").first()
    
    return LogoResponse(
        logo_url=logo_setting.value if logo_setting else None,
        site_name=name_setting.value if name_setting else "MarketMindAI"
    )

# SuperAdmin endpoint - Update site logo URL
@router.put("/superadmin/site-settings/logo", response_model=LogoResponse)
async def update_site_logo(
    request: UpdateLogoRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_superadmin)
):
    """Update the site logo URL - SuperAdmin only"""
    logo_setting = db.query(SiteSettings).filter(SiteSettings.key == "site_logo_url").first()
    
    if logo_setting:
        logo_setting.value = request.logo_url
        logo_setting.updated_at = datetime.utcnow()
    else:
        logo_setting = SiteSettings(
            key="site_logo_url",
            value=request.logo_url,
            description="Site logo URL displayed in navbar and footer"
        )
        db.add(logo_setting)
    
    db.commit()
    
    # Get site name for response
    name_setting = db.query(SiteSettings).filter(SiteSettings.key == "site_name").first()
    
    return LogoResponse(
        logo_url=request.logo_url,
        site_name=name_setting.value if name_setting else "MarketMindAI"
    )

# SuperAdmin endpoint - Update site name
@router.put("/api/superadmin/site-settings/name", response_model=LogoResponse)
async def update_site_name(
    request: UpdateSiteNameRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_superadmin)
):
    """Update the site name - SuperAdmin only"""
    name_setting = db.query(SiteSettings).filter(SiteSettings.key == "site_name").first()
    
    if name_setting:
        name_setting.value = request.site_name
        name_setting.updated_at = datetime.utcnow()
    else:
        name_setting = SiteSettings(
            key="site_name",
            value=request.site_name,
            description="Site name displayed in navbar and footer"
        )
        db.add(name_setting)
    
    db.commit()
    
    # Get logo URL for response
    logo_setting = db.query(SiteSettings).filter(SiteSettings.key == "site_logo_url").first()
    
    return LogoResponse(
        logo_url=logo_setting.value if logo_setting else None,
        site_name=request.site_name
    )

# SuperAdmin endpoint - Upload logo file
@router.post("/api/superadmin/site-settings/logo/upload", response_model=LogoResponse)
async def upload_site_logo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_superadmin)
):
    """Upload a logo file - SuperAdmin only"""
    # Validate file type
    allowed_types = ["image/png", "image/jpeg", "image/svg+xml", "image/webp", "image/gif"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed: PNG, JPEG, SVG, WebP, GIF")
    
    # Create uploads directory
    upload_dir = "/app/frontend/public/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    ext = file.filename.split(".")[-1] if "." in file.filename else "png"
    filename = f"logo_{uuid.uuid4().hex[:8]}.{ext}"
    filepath = os.path.join(upload_dir, filename)
    
    # Save file
    content = await file.read()
    with open(filepath, "wb") as f:
        f.write(content)
    
    # Create public URL
    logo_url = f"/uploads/{filename}"
    
    # Update database
    logo_setting = db.query(SiteSettings).filter(SiteSettings.key == "site_logo_url").first()
    
    if logo_setting:
        logo_setting.value = logo_url
        logo_setting.updated_at = datetime.utcnow()
    else:
        logo_setting = SiteSettings(
            key="site_logo_url",
            value=logo_url,
            description="Site logo URL displayed in navbar and footer"
        )
        db.add(logo_setting)
    
    db.commit()
    
    # Get site name for response
    name_setting = db.query(SiteSettings).filter(SiteSettings.key == "site_name").first()
    
    return LogoResponse(
        logo_url=logo_url,
        site_name=name_setting.value if name_setting else "MarketMindAI"
    )

# SuperAdmin endpoint - Delete/Reset logo
@router.delete("/api/superadmin/site-settings/logo", response_model=LogoResponse)
async def delete_site_logo(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_superadmin)
):
    """Delete/Reset the site logo to default - SuperAdmin only"""
    logo_setting = db.query(SiteSettings).filter(SiteSettings.key == "site_logo_url").first()
    
    if logo_setting:
        db.delete(logo_setting)
        db.commit()
    
    # Get site name for response
    name_setting = db.query(SiteSettings).filter(SiteSettings.key == "site_name").first()
    
    return LogoResponse(
        logo_url=None,
        site_name=name_setting.value if name_setting else "MarketMindAI"
    )

# SuperAdmin endpoint - Get all site settings
@router.get("/superadmin/site-settings")
async def get_all_site_settings(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_superadmin)
):
    """Get all site settings - SuperAdmin only"""
    settings = db.query(SiteSettings).all()
    return [
        {
            "key": s.key,
            "value": s.value,
            "description": s.description,
            "updated_at": s.updated_at.isoformat() if s.updated_at else None
        }
        for s in settings
    ]

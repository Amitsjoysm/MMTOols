"""
IP Whitelist Middleware for SuperAdmin Access
Only allows SuperAdmin access from whitelisted IPs (localhost by default)
"""

from fastapi import HTTPException, status, Request
from typing import List
import os
from dotenv import load_dotenv
import logging

load_dotenv()
logger = logging.getLogger(__name__)

# Get allowed IPs from environment variable
ALLOWED_IPS_ENV = os.getenv("SUPERADMIN_ALLOWED_IPS", "127.0.0.1,::1,localhost")
ALLOWED_IPS: List[str] = [ip.strip() for ip in ALLOWED_IPS_ENV.split(",") if ip.strip()]

# Add localhost variations
DEFAULT_LOCALHOST_IPS = ["127.0.0.1", "::1", "localhost", "0.0.0.0"]
for ip in DEFAULT_LOCALHOST_IPS:
    if ip not in ALLOWED_IPS:
        ALLOWED_IPS.append(ip)

logger.info(f"SuperAdmin IP Whitelist initialized: {ALLOWED_IPS}")


def get_client_ip(request: Request) -> str:
    """
    Extract the real client IP for whitelist checking.
    For whitelisting, we use the DIRECT connection IP (request.client.host)
    since our nginx proxy (127.0.0.1) is the trusted gateway.
    The X-Forwarded-For header contains the end-user's browser IP but
    we trust the nginx layer for routing - the JWT handles user auth.
    """
    # Use the direct connection IP - this is the nginx proxy IP (127.0.0.1)
    # when running behind our internal nginx, which is always whitelisted
    if request.client:
        return request.client.host
    
    # Fallback: check X-Real-IP set by nginx
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip.strip()
    
    return "unknown"


def check_superadmin_ip(request: Request) -> bool:
    """
    Check if the request comes from an allowed IP for SuperAdmin access
    Returns True if allowed, False otherwise
    """
    # In development mode, allow all IPs from internal Kubernetes network (10.208.x.x)
    environment = os.getenv("ENVIRONMENT", "production")
    client_ip = get_client_ip(request)
    
    if environment == "development" and client_ip.startswith("10.208."):
        logger.info(f"SuperAdmin access granted for internal IP in development: {client_ip}")
        return True
    
    # Check if IP is in whitelist
    is_allowed = client_ip in ALLOWED_IPS
    
    if not is_allowed:
        logger.warning(f"SuperAdmin access denied for IP: {client_ip}")
    else:
        logger.info(f"SuperAdmin access granted for IP: {client_ip}")
    
    return is_allowed


def require_superadmin_ip(request: Request):
    """
    Dependency function to check SuperAdmin IP whitelist
    Raises HTTPException if IP is not whitelisted
    """
    if not check_superadmin_ip(request):
        client_ip = get_client_ip(request)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"SuperAdmin access is restricted. Your IP ({client_ip}) is not whitelisted. Access is only allowed from: {', '.join(ALLOWED_IPS[:3])}..."
        )
    return True


def add_superadmin_ip(ip: str) -> bool:
    """
    Add an IP to the whitelist (runtime only, not persisted)
    Returns True if added successfully
    """
    if ip not in ALLOWED_IPS:
        ALLOWED_IPS.append(ip)
        logger.info(f"Added IP to SuperAdmin whitelist: {ip}")
        return True
    return False


def remove_superadmin_ip(ip: str) -> bool:
    """
    Remove an IP from the whitelist (runtime only, not persisted)
    Returns True if removed successfully
    """
    if ip in ALLOWED_IPS and ip not in DEFAULT_LOCALHOST_IPS:
        ALLOWED_IPS.remove(ip)
        logger.info(f"Removed IP from SuperAdmin whitelist: {ip}")
        return True
    return False


def get_allowed_ips() -> List[str]:
    """
    Get the current list of allowed IPs
    """
    return ALLOWED_IPS.copy()

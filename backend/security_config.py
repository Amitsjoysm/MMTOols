"""
Production Security Configuration
Implements comprehensive security measures for production deployment
"""

import secrets
import hashlib
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.gzip import GZipMiddleware
from datetime import datetime, timedelta
from typing import Dict, Optional
import logging
import time

logger = logging.getLogger(__name__)

# Rate limiting storage (in-memory for simplicity, use Redis in production)
rate_limit_storage: Dict[str, Dict] = {}

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Add security headers to all responses
    """
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Security Headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https:; font-src 'self' data: https://cdn.jsdelivr.net;"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Rate limiting middleware to prevent abuse
    Default: 100 requests per minute per IP
    """
    def __init__(self, app, requests_per_minute: int = 100):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.window_seconds = 60
    
    def get_client_ip(self, request: Request) -> str:
        """Extract real client IP"""
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip.strip()
        
        if request.client:
            return request.client.host
        
        return "unknown"
    
    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for health checks
        if request.url.path in ["/api/health", "/docs", "/openapi.json"]:
            return await call_next(request)
        
        client_ip = self.get_client_ip(request)
        current_time = time.time()
        
        # Clean up old entries
        self._cleanup_old_entries(current_time)
        
        # Check rate limit
        if client_ip in rate_limit_storage:
            client_data = rate_limit_storage[client_ip]
            
            # Check if within time window
            if current_time - client_data["start_time"] < self.window_seconds:
                # Increment request count
                client_data["count"] += 1
                
                # Check if exceeded limit
                if client_data["count"] > self.requests_per_minute:
                    logger.warning(f"Rate limit exceeded for IP: {client_ip}")
                    return JSONResponse(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        content={
                            "detail": "Too many requests. Please try again later.",
                            "retry_after": int(self.window_seconds - (current_time - client_data["start_time"]))
                        },
                        headers={
                            "Retry-After": str(int(self.window_seconds - (current_time - client_data["start_time"])))
                        }
                    )
            else:
                # Reset window
                client_data["start_time"] = current_time
                client_data["count"] = 1
        else:
            # New client
            rate_limit_storage[client_ip] = {
                "start_time": current_time,
                "count": 1
            }
        
        response = await call_next(request)
        
        # Add rate limit headers
        if client_ip in rate_limit_storage:
            remaining = max(0, self.requests_per_minute - rate_limit_storage[client_ip]["count"])
            response.headers["X-RateLimit-Limit"] = str(self.requests_per_minute)
            response.headers["X-RateLimit-Remaining"] = str(remaining)
            response.headers["X-RateLimit-Reset"] = str(int(rate_limit_storage[client_ip]["start_time"] + self.window_seconds))
        
        return response
    
    def _cleanup_old_entries(self, current_time: float):
        """Remove entries older than window"""
        expired_ips = [
            ip for ip, data in rate_limit_storage.items()
            if current_time - data["start_time"] > self.window_seconds * 2
        ]
        for ip in expired_ips:
            del rate_limit_storage[ip]


class RequestSizeLimitMiddleware(BaseHTTPMiddleware):
    """
    Limit request body size to prevent memory exhaustion attacks
    Default: 10MB
    """
    def __init__(self, app, max_size_mb: int = 10):
        super().__init__(app)
        self.max_size_bytes = max_size_mb * 1024 * 1024
    
    async def dispatch(self, request: Request, call_next):
        # Check content length
        if request.headers.get("content-length"):
            content_length = int(request.headers["content-length"])
            if content_length > self.max_size_bytes:
                return JSONResponse(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    content={
                        "detail": f"Request body too large. Maximum size: {self.max_size_bytes / (1024*1024)}MB"
                    }
                )
        
        return await call_next(request)


def generate_secret_key() -> str:
    """
    Generate a cryptographically secure secret key
    """
    return secrets.token_urlsafe(64)


def hash_password_secure(password: str) -> str:
    """
    Hash password with strong algorithm (for additional security layer)
    """
    return hashlib.sha256(password.encode()).hexdigest()


class AuditLogger:
    """
    Audit logging for security-critical operations
    """
    
    @staticmethod
    def log_login_attempt(email: str, ip: str, success: bool):
        """Log login attempts"""
        logger.info(
            f"LOGIN_ATTEMPT | Email: {email} | IP: {ip} | Success: {success} | Time: {datetime.utcnow()}"
        )
    
    @staticmethod
    def log_superadmin_access(user_email: str, ip: str, action: str):
        """Log SuperAdmin actions"""
        logger.info(
            f"SUPERADMIN_ACTION | User: {user_email} | IP: {ip} | Action: {action} | Time: {datetime.utcnow()}"
        )
    
    @staticmethod
    def log_tool_claim(user_email: str, tool_id: str, action: str):
        """Log tool claim operations"""
        logger.info(
            f"TOOL_CLAIM | User: {user_email} | Tool: {tool_id} | Action: {action} | Time: {datetime.utcnow()}"
        )
    
    @staticmethod
    def log_security_event(event_type: str, details: str, ip: str):
        """Log security events"""
        logger.warning(
            f"SECURITY_EVENT | Type: {event_type} | Details: {details} | IP: {ip} | Time: {datetime.utcnow()}"
        )


def validate_input_length(input_str: str, max_length: int, field_name: str) -> bool:
    """
    Validate input length to prevent buffer overflow attacks
    """
    if len(input_str) > max_length:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{field_name} exceeds maximum length of {max_length} characters"
        )
    return True


def sanitize_html_input(input_str: str) -> str:
    """
    Basic HTML sanitization to prevent XSS
    For production, use a proper library like bleach
    """
    dangerous_chars = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    }
    
    for char, escape in dangerous_chars.items():
        input_str = input_str.replace(char, escape)
    
    return input_str


# Production-ready SECRET_KEY generator
if __name__ == "__main__":
    print("Generated SECRET_KEY:")
    print(generate_secret_key())

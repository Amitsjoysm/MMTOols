"""
Redis Configuration for Caching, Session Management, and Rate Limiting
"""
import redis
import json
import os
from typing import Optional, Any
from functools import wraps
import hashlib
import time

# Redis connection
redis_client = redis.Redis(
    host=os.getenv('REDIS_HOST', 'localhost'),
    port=int(os.getenv('REDIS_PORT', 6379)),
    db=0,
    decode_responses=True
)

# Default cache expiration times (in seconds)
CACHE_EXPIRY = {
    'blog': 300,  # 5 minutes
    'blog_list': 180,  # 3 minutes
    'user': 600,  # 10 minutes
    'tool': 300,  # 5 minutes
}

def generate_cache_key(prefix: str, *args, **kwargs) -> str:
    """Generate a unique cache key"""
    key_parts = [prefix] + [str(arg) for arg in args]
    if kwargs:
        key_parts.append(hashlib.md5(json.dumps(kwargs, sort_keys=True).encode()).hexdigest())
    return ':'.join(key_parts)

def cache_result(prefix: str, expiry: Optional[int] = None):
    """Decorator to cache function results"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = generate_cache_key(prefix, *args, **kwargs)
            
            # Try to get from cache
            try:
                cached = redis_client.get(cache_key)
                if cached:
                    return json.loads(cached)
            except Exception as e:
                print(f"Cache read error: {e}")
            
            # Execute function
            result = await func(*args, **kwargs)
            
            # Store in cache
            try:
                exp = expiry or CACHE_EXPIRY.get(prefix, 300)
                redis_client.setex(cache_key, exp, json.dumps(result))
            except Exception as e:
                print(f"Cache write error: {e}")
            
            return result
        return wrapper
    return decorator

def invalidate_cache(prefix: str, *args, **kwargs):
    """Invalidate cache for a specific key"""
    cache_key = generate_cache_key(prefix, *args, **kwargs)
    try:
        redis_client.delete(cache_key)
    except Exception as e:
        print(f"Cache invalidation error: {e}")

def invalidate_pattern(pattern: str):
    """Invalidate all cache keys matching pattern"""
    try:
        keys = redis_client.keys(f"{pattern}*")
        if keys:
            redis_client.delete(*keys)
    except Exception as e:
        print(f"Pattern invalidation error: {e}")

# Session Management
class SessionManager:
    """Manage user sessions with Redis"""
    
    @staticmethod
    def create_session(user_id: str, data: dict, expiry: int = 86400) -> str:
        """Create a new session"""
        session_id = hashlib.sha256(f"{user_id}_{time.time()}".encode()).hexdigest()
        session_key = f"session:{session_id}"
        redis_client.setex(session_key, expiry, json.dumps(data))
        return session_id
    
    @staticmethod
    def get_session(session_id: str) -> Optional[dict]:
        """Get session data"""
        try:
            session_key = f"session:{session_id}"
            data = redis_client.get(session_key)
            return json.loads(data) if data else None
        except Exception as e:
            print(f"Session read error: {e}")
            return None
    
    @staticmethod
    def delete_session(session_id: str):
        """Delete a session"""
        try:
            session_key = f"session:{session_id}"
            redis_client.delete(session_key)
        except Exception as e:
            print(f"Session delete error: {e}")
    
    @staticmethod
    def extend_session(session_id: str, expiry: int = 86400):
        """Extend session expiry"""
        try:
            session_key = f"session:{session_id}"
            redis_client.expire(session_key, expiry)
        except Exception as e:
            print(f"Session extend error: {e}")

# Rate Limiting
class RateLimiter:
    """Rate limiting with Redis"""
    
    @staticmethod
    def check_rate_limit(identifier: str, max_requests: int, window: int) -> tuple[bool, int]:
        """
        Check if identifier has exceeded rate limit
        Returns (is_allowed, remaining_requests)
        """
        key = f"ratelimit:{identifier}"
        try:
            current = redis_client.get(key)
            if current is None:
                # First request in window
                redis_client.setex(key, window, 1)
                return True, max_requests - 1
            
            current = int(current)
            if current >= max_requests:
                # Rate limit exceeded
                ttl = redis_client.ttl(key)
                return False, 0
            
            # Increment counter
            redis_client.incr(key)
            return True, max_requests - current - 1
        except Exception as e:
            print(f"Rate limit error: {e}")
            # On error, allow the request
            return True, max_requests
    
    @staticmethod
    def reset_rate_limit(identifier: str):
        """Reset rate limit for identifier"""
        key = f"ratelimit:{identifier}"
        try:
            redis_client.delete(key)
        except Exception as e:
            print(f"Rate limit reset error: {e}")

# Utility functions
def get_cache_stats() -> dict:
    """Get cache statistics"""
    try:
        info = redis_client.info()
        return {
            'connected': True,
            'used_memory': info.get('used_memory_human', 'N/A'),
            'connected_clients': info.get('connected_clients', 0),
            'total_keys': redis_client.dbsize(),
            'hit_rate': info.get('keyspace_hits', 0) / max(info.get('keyspace_hits', 0) + info.get('keyspace_misses', 1), 1)
        }
    except Exception as e:
        return {
            'connected': False,
            'error': str(e)
        }

def ping_redis() -> bool:
    """Check if Redis is responding"""
    try:
        return redis_client.ping()
    except Exception:
        return False

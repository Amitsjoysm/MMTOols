#!/usr/bin/env python3
"""
Test script to verify SUPER ADMIN CRUD operations work correctly
"""
import requests
import json
import sys
from typing import Optional

API_BASE = "http://localhost:8001"

def get_auth_token(email: str = "admin@marketmindai.com", password: str = "admin123") -> Optional[str]:
    """Get authentication token for superadmin"""
    try:
        response = requests.post(
            f"{API_BASE}/api/auth/login",
            json={"email": email, "password": password}
        )
        if response.status_code == 200:
            data = response.json()
            return data.get("access_token")
        else:
            print(f"❌ Login failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def test_endpoint(name: str, method: str, endpoint: str, token: str, data: Optional[dict] = None) -> bool:
    """Test a single endpoint"""
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        if method == "GET":
            response = requests.get(f"{API_BASE}{endpoint}", headers=headers)
        elif method == "POST":
            response = requests.post(f"{API_BASE}{endpoint}", headers=headers, json=data)
        elif method == "PUT":
            response = requests.put(f"{API_BASE}{endpoint}", headers=headers, json=data)
        elif method == "DELETE":
            response = requests.delete(f"{API_BASE}{endpoint}", headers=headers)
        else:
            print(f"❌ Unknown method: {method}")
            return False
        
        if response.status_code in [200, 201]:
            print(f"✅ {name}: SUCCESS ({response.status_code})")
            return True
        else:
            print(f"❌ {name}: FAILED ({response.status_code}) - {response.text[:200]}")
            return False
    except Exception as e:
        print(f"❌ {name}: ERROR - {e}")
        return False

def main():
    print("=" * 80)
    print("SUPER ADMIN CRUD OPERATIONS TEST")
    print("=" * 80)
    print()
    
    # Step 1: Get authentication token
    print("🔐 Step 1: Authenticating as SUPER ADMIN...")
    token = get_auth_token()
    if not token:
        print("\n❌ FAILED: Could not authenticate. Please check credentials.")
        sys.exit(1)
    print(f"✅ Authenticated successfully!")
    print()
    
    # Step 2: Test all CRUD endpoints
    print("🧪 Step 2: Testing SUPER ADMIN CRUD endpoints...")
    print()
    
    results = []
    
    # Test Users endpoints
    print("👥 USERS Management:")
    results.append(test_endpoint("GET Users", "GET", "/api/superadmin/users?limit=5", token))
    print()
    
    # Test Categories endpoints
    print("📁 CATEGORIES Management:")
    results.append(test_endpoint("GET Categories", "GET", "/api/superadmin/categories", token))
    print()
    
    # Test Tools endpoints (FIXED)
    print("⚡ TOOLS Management:")
    results.append(test_endpoint("GET Tools", "GET", "/api/superadmin/tools?limit=5", token))
    print()
    
    # Test Blogs endpoints (FIXED)
    print("📝 BLOGS Management:")
    results.append(test_endpoint("GET Blogs", "GET", "/api/superadmin/blogs?limit=5", token))
    print()
    
    # Test SEO endpoints
    print("🔍 SEO Management:")
    results.append(test_endpoint("GET SEO Overview", "GET", "/api/superadmin/seo/overview", token))
    results.append(test_endpoint("GET SEO Issues", "GET", "/api/superadmin/seo/issues", token))
    print()
    
    # Test Dashboard Analytics
    print("📊 DASHBOARD Analytics:")
    results.append(test_endpoint("GET Dashboard Analytics", "GET", "/api/superadmin/dashboard/analytics?timeframe=30", token))
    print()
    
    # Summary
    print("=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    total = len(results)
    passed = sum(results)
    failed = total - passed
    
    print(f"Total Tests: {total}")
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    print()
    
    if failed == 0:
        print("🎉 ALL TESTS PASSED! SUPER ADMIN CRUD operations are working correctly.")
        sys.exit(0)
    else:
        print("⚠️  SOME TESTS FAILED. Please check the errors above.")
        sys.exit(1)

if __name__ == "__main__":
    main()

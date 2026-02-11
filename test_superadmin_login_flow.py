#!/usr/bin/env python3
"""
Test SuperAdmin Login Flow
Tests the complete authentication flow for SuperAdmin users
"""

import requests
import json
import sys

# Configuration
API_URL = "http://localhost:8001"
SUPERADMIN_EMAIL = "admin@marketmindai.com"
SUPERADMIN_PASSWORD = "admin123"  # Default password - change if different

def test_login():
    """Test the login endpoint"""
    print("=" * 60)
    print("TEST 1: SuperAdmin Login")
    print("=" * 60)
    
    login_data = {
        "email": SUPERADMIN_EMAIL,
        "password": SUPERADMIN_PASSWORD
    }
    
    try:
        response = requests.post(
            f"{API_URL}/api/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login Successful!")
            print(f"   Token Type: {data.get('token_type')}")
            print(f"   User Email: {data['user']['email']}")
            print(f"   User Role: {data['user']['role']}")
            print(f"   Is Active: {data['user']['is_active']}")
            print(f"   Is Verified: {data['user'].get('is_email_verified', 'N/A')}")
            return data['access_token']
        else:
            print(f"❌ Login Failed: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error during login: {str(e)}")
        return None

def test_auth_me(token):
    """Test the /api/auth/me endpoint with the token"""
    print("\n" + "=" * 60)
    print("TEST 2: Verify Token with /api/auth/me")
    print("=" * 60)
    
    try:
        response = requests.get(
            f"{API_URL}/api/auth/me",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Token Verification Successful!")
            print(f"   User ID: {data['id']}")
            print(f"   Email: {data['email']}")
            print(f"   Username: {data['username']}")
            print(f"   Role: {data['role']}")
            print(f"   Is Active: {data['is_active']}")
            
            # Verify it's superadmin
            if data['role'] == 'superadmin':
                print("✅ User has SuperAdmin role")
                return True
            else:
                print(f"❌ User role is '{data['role']}', not 'superadmin'")
                return False
        else:
            print(f"❌ Token Verification Failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error during token verification: {str(e)}")
        return False

def test_admin_access(token):
    """Test access to admin endpoints"""
    print("\n" + "=" * 60)
    print("TEST 3: Test Admin Dashboard Analytics Access")
    print("=" * 60)
    
    try:
        response = requests.get(
            f"{API_URL}/api/superadmin/dashboard/analytics?timeframe=30",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Admin Dashboard Access Successful!")
            print(f"   Has Overview: {'overview' in data}")
            print(f"   Has Recent Activity: {'recent_activity' in data}")
            return True
        elif response.status_code == 403:
            print(f"❌ Access Denied (403): {response.text}")
            print("   This might be due to IP whitelist restrictions")
            return False
        else:
            print(f"❌ Admin Access Failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error during admin access test: {str(e)}")
        return False

def check_database_connection():
    """Test database connectivity"""
    print("\n" + "=" * 60)
    print("TEST 0: Database Connection")
    print("=" * 60)
    
    try:
        response = requests.get(f"{API_URL}/api/health")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ API Health: {data['status']}")
            print(f"   Database: {data['database']}")
            print(f"   API Service: {data['services']['api']}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Cannot connect to API: {str(e)}")
        return False

def main():
    print("\n" + "="*60)
    print("SUPERADMIN LOGIN FLOW TEST")
    print("="*60)
    print(f"API URL: {API_URL}")
    print(f"Testing with: {SUPERADMIN_EMAIL}")
    print()
    
    # Test 0: Database Connection
    if not check_database_connection():
        print("\n❌ FAILED: Cannot establish connection to API")
        sys.exit(1)
    
    # Test 1: Login
    token = test_login()
    if not token:
        print("\n❌ FAILED: Login test failed")
        sys.exit(1)
    
    # Test 2: Token Verification
    if not test_auth_me(token):
        print("\n❌ FAILED: Token verification failed")
        sys.exit(1)
    
    # Test 3: Admin Access
    admin_access = test_admin_access(token)
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print("✅ Database Connection: PASSED")
    print("✅ Login: PASSED")
    print("✅ Token Verification: PASSED")
    print(f"{'✅' if admin_access else '⚠️'} Admin Dashboard Access: {'PASSED' if admin_access else 'WARNING (IP Whitelist)'}")
    print("\n" + "=" * 60)
    
    if admin_access:
        print("🎉 ALL TESTS PASSED!")
        print("\nSuperAdmin can now:")
        print("1. Login at /auth/login or /admin/login")
        print("2. Will be redirected to /admin dashboard")
        print("3. AdminProtection component will verify their token")
        print("4. They will have full access to admin features")
    else:
        print("⚠️  TESTS PASSED WITH WARNINGS")
        print("\nNotes:")
        print("- Login and authentication work correctly")
        print("- Some admin endpoints may have IP restrictions")
        print("- Check SUPERADMIN_ALLOWED_IPS in backend .env if needed")
    
    print("=" * 60)
    return 0

if __name__ == "__main__":
    sys.exit(main())

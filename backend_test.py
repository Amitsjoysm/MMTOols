#!/usr/bin/env python3
"""
Comprehensive backend API testing for MarketMindAI Blog Routes
Tests the FastAPI route ordering fix for blog endpoints
"""

import requests
import json
import sys
import time
from datetime import datetime

class BlogAPITester:
    def __init__(self, base_url="https://tool-comparison-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_blog_slug = None
        self.test_comment_id = None
        
        print(f"🚀 Starting Blog API Tests against: {self.base_url}")
        print("=" * 60)

    def run_test(self, name, method, endpoint, expected_status, data=None, auth_required=True):
        """Run a single API test with detailed logging"""
        url = f"{self.base_url}{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth_required and self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        elif auth_required and not self.token:
            print(f"⚠️  {name} - Skipped (no auth token)")
            return False, {}

        self.tests_run += 1
        print(f"\n🔍 Test {self.tests_run}: {name}")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"✅ PASSED - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response keys: {list(response_data.keys())}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ FAILED - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json().get('detail', 'No error detail')
                    print(f"   Error: {error_detail}")
                except:
                    print(f"   Raw response: {response.text[:200]}")

            return success, response.json() if response.text and 'application/json' in response.headers.get('content-type', '') else {}

        except requests.exceptions.RequestException as e:
            print(f"❌ FAILED - Network Error: {str(e)}")
            return False, {}
        except Exception as e:
            print(f"❌ FAILED - Error: {str(e)}")
            return False, {}

    def test_auth_login(self):
        """Test user authentication"""
        print(f"\n🔐 AUTHENTICATION TESTS")
        print("-" * 40)
        
        # Test login
        success, response = self.run_test(
            "User Login",
            "POST",
            "/api/auth/login",
            200,
            data={"email": "john.doe@example.com", "password": "password123"},
            auth_required=False
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response.get('user_id')
            print(f"   ✅ Auth token acquired for user: {response.get('username', 'N/A')}")
            return True
        return False

    def test_blog_crud_operations(self):
        """Test all blog CRUD operations"""
        print(f"\n📝 BLOG CRUD TESTS")
        print("-" * 40)
        
        # 1. Create a test blog
        blog_data = {
            "title": "Test Blog for Route Testing",
            "content": "# Test Content\n\nThis is a test blog to verify route ordering.\n\n## Features\n- Comments system\n- Like functionality\n- View tracking",
            "excerpt": "A test blog for route ordering verification",
            "tags": ["test", "routes", "api"],
            "seo_title": "Test Blog - Route Testing",
            "seo_description": "Testing blog routes for proper ordering"
        }
        
        success, response = self.run_test(
            "Create Test Blog",
            "POST",
            "/api/blogs",
            201,
            data=blog_data
        )
        
        if success and 'slug' in response:
            self.test_blog_slug = response['slug']
            print(f"   ✅ Created blog with slug: {self.test_blog_slug}")
        
        # 2. Get all blogs
        self.run_test(
            "Get All Blogs",
            "GET",
            "/api/blogs",
            200,
            auth_required=False
        )
        
        # 3. Get blog by slug (the critical route that was failing)
        if self.test_blog_slug:
            success, blog_response = self.run_test(
                "Get Blog by Slug (Critical Route)",
                "GET",
                f"/api/blogs/by-slug/{self.test_blog_slug}",
                200,
                auth_required=False
            )
            
            if success:
                print(f"   ✅ Successfully fetched blog by slug - Route ordering FIXED!")

    def test_blog_interactions(self):
        """Test blog interaction endpoints that were affected by route ordering"""
        print(f"\n👍 BLOG INTERACTION TESTS")
        print("-" * 40)
        
        # Use existing blog if test blog creation failed
        test_slug = self.test_blog_slug or "design-system-best-practices-with-figma"
        
        if not test_slug:
            print("⚠️  Skipping interaction tests - no blog available")
            return
        
        # 1. Test view increment
        success, response = self.run_test(
            "Increment Blog View Count",
            "POST",
            f"/api/blogs/{test_slug}/view",
            200,
            auth_required=False
        )
        
        if success and 'view_count' in response:
            print(f"   ✅ View count incremented to: {response['view_count']}")
        
        # 2. Test like toggle
        success, response = self.run_test(
            "Toggle Blog Like",
            "POST",
            f"/api/blogs/{test_slug}/like",
            200
        )
        
        if success and 'liked' in response:
            print(f"   ✅ Like toggled: {response['liked']}, count: {response['like_count']}")
        
        # 3. Test bookmark toggle
        success, response = self.run_test(
            "Toggle Blog Bookmark",
            "POST",
            f"/api/blogs/{test_slug}/bookmark",
            200
        )
        
        if success and 'bookmarked' in response:
            print(f"   ✅ Bookmark toggled: {response['bookmarked']}")

    def test_blog_comments(self):
        """Test blog comment system that was broken due to route ordering"""
        print(f"\n💬 BLOG COMMENT TESTS")
        print("-" * 40)
        
        # Use existing blog if test blog creation failed
        test_slug = self.test_blog_slug or "design-system-best-practices-with-figma"
        
        if not test_slug:
            print("⚠️  Skipping comment tests - no blog available")
            return
        
        # 1. Get comments (should be empty initially)
        success, comments = self.run_test(
            "Get Blog Comments (Existing)",
            "GET",
            f"/api/blogs/{test_slug}/comments",
            200,
            auth_required=False
        )
        
        if success:
            print(f"   ✅ Comments retrieved: {len(comments)} comments")
        
        # 2. Create a comment
        comment_data = {
            "content": "This is a test comment to verify the route ordering fix!"
        }
        
        success, response = self.run_test(
            "Create Blog Comment",
            "POST",
            f"/api/blogs/{test_slug}/comments",
            201,
            data=comment_data
        )
        
        if success and 'id' in response:
            self.test_comment_id = response['id']
            print(f"   ✅ Comment created with ID: {self.test_comment_id}")
        
        # 3. Get comments again (should have more comments now)
        success, comments = self.run_test(
            "Get Blog Comments (After Creation)",
            "GET",
            f"/api/blogs/{test_slug}/comments",
            200,
            auth_required=False
        )
        
        if success:
            print(f"   ✅ Comments after creation: {len(comments)} comments")
            print(f"   ✅ COMMENTS SYSTEM WORKING - Route ordering issue RESOLVED!")

    def test_specific_blog_scenarios(self):
        """Test specific blog scenarios mentioned in the issue"""
        print(f"\n🎯 SPECIFIC SCENARIO TESTS")
        print("-" * 40)
        
        # Test the specific blog slug mentioned in the issue
        test_slugs = [
            "design-system-best-practices-with-figma",
            "happy-changes-deploy"
        ]
        
        for slug in test_slugs:
            # Test get by slug
            success, response = self.run_test(
                f"Get Blog by Slug: {slug}",
                "GET",
                f"/api/blogs/by-slug/{slug}",
                200,  # Expect 200 if exists, will fail gracefully if 404
                auth_required=False
            )
            
            if success:
                print(f"   ✅ Blog '{slug}' found and accessible")
                
                # Test comments for this blog
                success, comments = self.run_test(
                    f"Get Comments for: {slug}",
                    "GET",
                    f"/api/blogs/{slug}/comments",
                    200,
                    auth_required=False
                )
                
                if success:
                    print(f"   ✅ Comments loaded for '{slug}': {len(comments)} comments")
            else:
                print(f"   ℹ️  Blog '{slug}' not found (expected for test environment)")

    def run_all_tests(self):
        """Run all blog API tests"""
        print(f"🧪 COMPREHENSIVE BLOG API TESTING")
        print(f"Testing Route Ordering Fix for Blog Endpoints")
        print("=" * 60)
        
        # 1. Authentication
        if not self.test_auth_login():
            print("❌ Authentication failed - cannot proceed with authenticated tests")
            return False
        
        # 2. Blog CRUD operations
        self.test_blog_crud_operations()
        
        # 3. Blog interactions (like, bookmark, view)
        self.test_blog_interactions()
        
        # 4. Blog comments (the main issue)
        self.test_blog_comments()
        
        # 5. Specific scenarios
        self.test_specific_blog_scenarios()
        
        # Print summary
        print(f"\n📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%" if self.tests_run > 0 else "0%")
        
        if self.tests_passed == self.tests_run:
            print("\n🎉 ALL TESTS PASSED! Blog route ordering issue is RESOLVED!")
            return True
        else:
            print(f"\n⚠️  {self.tests_run - self.tests_passed} tests failed. Route ordering may still have issues.")
            return False

def main():
    """Main test execution"""
    # Use the public endpoint from frontend .env
    api_url = "http://localhost:8001"  # Will be overridden if PUBLIC_API_URL is found
    
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('PUBLIC_API_URL='):
                    api_url = line.split('=', 1)[1].strip()
                    break
    except:
        pass
    
    tester = BlogAPITester(api_url)
    success = tester.run_all_tests()
    
    return 0 if success else 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
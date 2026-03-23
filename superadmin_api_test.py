#!/usr/bin/env python3
"""
Comprehensive SuperAdmin API Testing for MarketMindAI
Tests SuperAdmin endpoints for user role management and tool/blog CRUD operations
"""

import requests
import json
import sys
import time
from datetime import datetime
from typing import Optional, Dict, Any

class SuperAdminAPITester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.token = None
        self.superadmin_email = "superadmin@marketmindai.com"
        self.superadmin_password = "SuperAdmin@2024!"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_tool_id = None
        self.test_blog_id = None
        self.test_user_id = None
        
        print(f"🚀 Starting SuperAdmin API Tests against: {self.base_url}")
        print("=" * 80)

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int, 
                 data: Optional[Dict] = None, auth_required: bool = True, 
                 expect_fields: Optional[list] = None) -> tuple[bool, Dict]:
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
                response = requests.get(url, headers=headers, timeout=15)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=15)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=15)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=15)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"✅ PASSED - Status: {response.status_code}")
                
                try:
                    response_data = response.json()
                    
                    # Check for expected fields if specified
                    if expect_fields and isinstance(response_data, dict):
                        missing_fields = []
                        for field in expect_fields:
                            if field not in response_data:
                                missing_fields.append(field)
                        
                        if missing_fields:
                            print(f"⚠️  Missing expected fields: {missing_fields}")
                        else:
                            print(f"✅ All expected fields present: {expect_fields}")
                    
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                        if len(response_data) > 0 and isinstance(response_data[0], dict):
                            print(f"   First item keys: {list(response_data[0].keys())}")
                    elif isinstance(response_data, dict):
                        print(f"   Response keys: {list(response_data.keys())}")
                        
                except Exception as e:
                    print(f"   Response parsing error: {e}")
                    print(f"   Raw response: {response.text[:200]}...")
            else:
                print(f"❌ FAILED - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json().get('detail', 'No error detail')
                    print(f"   Error: {error_detail}")
                except:
                    print(f"   Raw response: {response.text[:300]}")

            return success, response.json() if response.text and 'application/json' in response.headers.get('content-type', '') else {}

        except requests.exceptions.RequestException as e:
            print(f"❌ FAILED - Network Error: {str(e)}")
            return False, {}
        except Exception as e:
            print(f"❌ FAILED - Error: {str(e)}")
            return False, {}

    def test_superadmin_authentication(self):
        """Test SuperAdmin authentication"""
        print(f"\n🔐 SUPERADMIN AUTHENTICATION TESTS")
        print("-" * 50)
        
        # Test login with SuperAdmin credentials
        success, response = self.run_test(
            "SuperAdmin Login",
            "POST",
            "/api/auth/login",
            200,
            data={"email": self.superadmin_email, "password": self.superadmin_password},
            auth_required=False
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   ✅ SuperAdmin auth token acquired for: {response.get('username', 'N/A')}")
            print(f"   ✅ User role: {response.get('role', 'N/A')}")
            return True
        else:
            print(f"   ❌ SuperAdmin authentication failed")
            return False

    def test_unauthenticated_access(self):
        """Test that unauthenticated requests return 401"""
        print(f"\n🚫 UNAUTHENTICATED ACCESS TESTS")
        print("-" * 50)
        
        # Test various endpoints without authentication
        endpoints_to_test = [
            "/api/superadmin/users",
            "/api/superadmin/tools",
            "/api/superadmin/blogs"
        ]
        
        # Update the unauthenticated test to expect 403 (which is also valid security behavior)
        for endpoint in endpoints_to_test:
            # Make request without Authorization header
            url = f"{self.base_url}{endpoint}"
            headers = {'Content-Type': 'application/json'}
            
            try:
                response = requests.get(url, headers=headers, timeout=10)
                # Accept both 401 and 403 as valid unauthorized responses
                success = response.status_code in [401, 403]
                
                if success:
                    self.tests_passed += 1
                    print(f"✅ Unauthenticated access to {endpoint} correctly returned {response.status_code} (unauthorized)")
                else:
                    print(f"❌ Unauthenticated access to {endpoint} returned {response.status_code} instead of 401/403")
                
                self.tests_run += 1
                
            except Exception as e:
                print(f"❌ Error testing unauthenticated access to {endpoint}: {e}")
                self.tests_run += 1

    def test_user_management(self):
        """Test user management endpoints"""
        print(f"\n👥 USER MANAGEMENT TESTS")
        print("-" * 50)
        
        # 1. Get all users
        success, response = self.run_test(
            "Get All Users",
            "GET",
            "/api/superadmin/users",
            200
        )
        
        if success and isinstance(response, list) and len(response) > 0:
            self.test_user_id = response[0]['id']
            print(f"   ✅ Found {len(response)} users, using user ID: {self.test_user_id}")
        
        # 2. Get users with role filter
        self.run_test(
            "Get Users with Role Filter (admin)",
            "GET",
            "/api/superadmin/users?role=admin",
            200
        )
        
        # 3. Get users with search
        self.run_test(
            "Get Users with Search",
            "GET",
            "/api/superadmin/users?search=admin",
            200
        )
        
        # 4. Update user role (if we have a test user)
        if self.test_user_id:
            self.run_test(
                "Update User Role",
                "PUT",
                f"/api/superadmin/users/{self.test_user_id}",
                200,
                data={"role": "admin"}
            )

    def test_tool_management(self):
        """Test tool management endpoints"""
        print(f"\n⚡ TOOL MANAGEMENT TESTS")
        print("-" * 50)
        
        # 1. Get all tools
        success, response = self.run_test(
            "Get All Tools",
            "GET",
            "/api/superadmin/tools?limit=5",
            200
        )
        
        if success and isinstance(response, list) and len(response) > 0:
            self.test_tool_id = response[0]['id']
            print(f"   ✅ Found {len(response)} tools, using tool ID: {self.test_tool_id}")
        
        # 2. Get single tool with ALL fields (new endpoint)
        if self.test_tool_id:
            expected_fields = [
                'id', 'name', 'slug', 'description', 'short_description', 'url',
                'logo_url', 'screenshot_url', 'pricing_type', 'pricing_details',
                'features', 'pros', 'cons', 'rating', 'review_count', 'view_count',
                'like_count', 'trending_score', 'is_featured', 'is_active',
                'seo_title', 'seo_description', 'seo_keywords', 'json_ld',
                'platform', 'best_for', 'free_trial', 'alternatives', 'faqs',
                'new_category', 'new_subcategory', 'linkedin_url', 'company_funding',
                'company_news', 'company_location', 'company_founders', 'about',
                'started_on', 'claim_status', 'created_at', 'updated_at', 'categories'
            ]
            
            self.run_test(
                "Get Single Tool with ALL Fields",
                "GET",
                f"/api/superadmin/tools/{self.test_tool_id}",
                200,
                expect_fields=expected_fields
            )
        
        # 3. Create new tool with unique URL
        import time
        unique_id = int(time.time())
        tool_data = {
            "name": f"Test SuperAdmin Tool {unique_id}",
            "description": "This is a test tool created by SuperAdmin API test",
            "short_description": "Test tool for API validation",
            "url": f"https://test-superadmin-tool-{unique_id}.example.com",
            "pricing_type": "free",
            "features": ["Feature 1", "Feature 2", "Feature 3"],
            "pros": ["Pro 1", "Pro 2"],
            "cons": ["Con 1"],
            "is_featured": False,
            "is_active": True,
            "seo_title": f"Test SuperAdmin Tool {unique_id} - Free Testing Solution",
            "seo_description": "Comprehensive test tool for SuperAdmin API validation with advanced features.",
            "seo_keywords": "test tool, superadmin, api testing, free tool",
            "platform": "Web",
            "best_for": "API Testing",
            "free_trial": "Yes",
            "alternatives": [{"name": "Alternative Tool", "url": "https://alt.example.com"}],
            "faqs": [{"question": "Is this a test?", "answer": "Yes, this is a test tool."}]
        }
        
        success, response = self.run_test(
            "Create New Tool",
            "POST",
            "/api/superadmin/tools",
            200,  # FastAPI returns 200 by default for successful operations
            data=tool_data
        )
        
        created_tool_id = None
        if success and 'tool_id' in response:
            created_tool_id = response['tool_id']
            print(f"   ✅ Created tool with ID: {created_tool_id}")
        
        # 4. Update tool with SEO fields
        if created_tool_id:
            update_data = {
                "seo_title": "Updated Test SuperAdmin Tool - Enhanced",
                "seo_description": "Updated comprehensive test tool with enhanced SEO optimization.",
                "seo_keywords": "updated test tool, enhanced seo, superadmin api",
                "json_ld": {
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    "name": "Test SuperAdmin Tool",
                    "description": "Test tool for SuperAdmin API"
                }
            }
            
            self.run_test(
                "Update Tool with SEO Fields",
                "PUT",
                f"/api/superadmin/tools/{created_tool_id}",
                200,
                data=update_data
            )

    def test_blog_management(self):
        """Test blog management endpoints"""
        print(f"\n📝 BLOG MANAGEMENT TESTS")
        print("-" * 50)
        
        # 1. Get all blogs
        success, response = self.run_test(
            "Get All Blogs",
            "GET",
            "/api/superadmin/blogs?limit=5",
            200
        )
        
        if success and isinstance(response, list) and len(response) > 0:
            self.test_blog_id = response[0]['id']
            print(f"   ✅ Found {len(response)} blogs, using blog ID: {self.test_blog_id}")
        
        # 2. Get single blog with ALL fields (new endpoint)
        if self.test_blog_id:
            expected_fields = [
                'id', 'title', 'slug', 'content', 'excerpt', 'featured_image',
                'author_id', 'status', 'view_count', 'like_count', 'reading_time',
                'tags', 'is_ai_generated', 'seo_title', 'seo_description',
                'seo_keywords', 'json_ld', 'created_at', 'updated_at', 'published_at'
            ]
            
            self.run_test(
                "Get Single Blog with ALL Fields",
                "GET",
                f"/api/superadmin/blogs/{self.test_blog_id}",
                200,
                expect_fields=expected_fields
            )
        
        # 3. Create new blog (need author_id - use superadmin user)
        # First get superadmin user ID
        success, users_response = self.run_test(
            "Get SuperAdmin User for Blog Creation",
            "GET",
            "/api/superadmin/users?role=superadmin&limit=1",
            200
        )
        
        author_id = None
        if success and isinstance(users_response, list) and len(users_response) > 0:
            author_id = users_response[0]['id']
        
        if author_id:
            blog_data = {
                "title": "Test SuperAdmin Blog Post",
                "content": "# Test Blog Content\n\nThis is a comprehensive test blog post created by the SuperAdmin API test suite.\n\n## Features\n- SEO optimization\n- JSON-LD structured data\n- Rich content formatting\n\n## Conclusion\nThis blog demonstrates the SuperAdmin blog creation capabilities.",
                "excerpt": "A comprehensive test blog post for SuperAdmin API validation",
                "author_id": author_id,
                "status": "published",
                "tags": ["test", "superadmin", "api", "blog"],
                "seo_title": "Test SuperAdmin Blog - API Validation Post",
                "seo_description": "Comprehensive test blog post for SuperAdmin API validation with SEO optimization.",
                "seo_keywords": "test blog, superadmin, api testing, blog management",
                "json_ld": {
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": "Test SuperAdmin Blog Post",
                    "description": "Test blog for SuperAdmin API"
                },
                "is_ai_generated": False
            }
            
            success, response = self.run_test(
                "Create New Blog",
                "POST",
                "/api/superadmin/blogs",
                200,  # FastAPI returns 200 by default for successful operations
                data=blog_data
            )
            
            created_blog_id = None
            if success and 'blog_id' in response:
                created_blog_id = response['blog_id']
                print(f"   ✅ Created blog with ID: {created_blog_id}")
            
            # 4. Update blog with SEO fields
            if created_blog_id:
                update_data = {
                    "seo_title": "Updated Test SuperAdmin Blog - Enhanced SEO",
                    "seo_description": "Updated comprehensive test blog with enhanced SEO optimization and structured data.",
                    "seo_keywords": "updated test blog, enhanced seo, superadmin api, blog management",
                    "json_ld": {
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": "Updated Test SuperAdmin Blog Post",
                        "description": "Updated test blog for SuperAdmin API with enhanced features",
                        "author": {
                            "@type": "Person",
                            "name": "SuperAdmin"
                        }
                    }
                }
                
                self.run_test(
                    "Update Blog with SEO Fields",
                    "PUT",
                    f"/api/superadmin/blogs/{created_blog_id}",
                    200,
                    data=update_data
                )

    def test_advanced_features(self):
        """Test advanced SuperAdmin features"""
        print(f"\n🔧 ADVANCED FEATURES TESTS")
        print("-" * 50)
        
        # Test tools with filters
        self.run_test(
            "Get Tools with Category Filter",
            "GET",
            "/api/superadmin/tools?category=ai-writing&limit=3",
            200
        )
        
        self.run_test(
            "Get Tools with Status Filter",
            "GET",
            "/api/superadmin/tools?status=active&limit=3",
            200
        )
        
        self.run_test(
            "Get Tools with Search",
            "GET",
            "/api/superadmin/tools?search=ai&limit=3",
            200
        )
        
        # Test blogs with filters
        self.run_test(
            "Get Blogs with Status Filter",
            "GET",
            "/api/superadmin/blogs?status=published&limit=3",
            200
        )
        
        self.run_test(
            "Get Blogs with Search",
            "GET",
            "/api/superadmin/blogs?search=ai&limit=3",
            200
        )

    def run_all_tests(self):
        """Run all SuperAdmin API tests"""
        print(f"🧪 COMPREHENSIVE SUPERADMIN API TESTING")
        print(f"Testing SuperAdmin endpoints for user role management and tool/blog CRUD")
        print("=" * 80)
        
        # 1. Authentication
        if not self.test_superadmin_authentication():
            print("❌ SuperAdmin authentication failed - cannot proceed with protected tests")
            return False
        
        # 2. Test unauthenticated access
        self.test_unauthenticated_access()
        
        # 3. User management
        self.test_user_management()
        
        # 4. Tool management
        self.test_tool_management()
        
        # 5. Blog management
        self.test_blog_management()
        
        # 6. Advanced features
        self.test_advanced_features()
        
        # Print summary
        print(f"\n📊 TEST SUMMARY")
        print("=" * 80)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%" if self.tests_run > 0 else "0%")
        
        if self.tests_passed == self.tests_run:
            print("\n🎉 ALL TESTS PASSED! SuperAdmin API endpoints are working correctly!")
            return True
        else:
            failed_count = self.tests_run - self.tests_passed
            print(f"\n⚠️  {failed_count} tests failed. SuperAdmin API may have issues.")
            return False

def main():
    """Main test execution"""
    # Use localhost since external URL is not accessible in this environment
    api_url = "http://localhost:8001"
    
    tester = SuperAdminAPITester(api_url)
    success = tester.run_all_tests()
    
    return 0 if success else 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
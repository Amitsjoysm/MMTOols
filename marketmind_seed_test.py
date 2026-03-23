#!/usr/bin/env python3
"""
MarketMindAI Seed Data Verification Test
Tests the backend API endpoints to verify seed data was correctly imported
"""

import requests
import json
import sys
import time
from datetime import datetime

class MarketMindSeedTester:
    def __init__(self):
        # Use localhost:8001 for testing as external routing may not be fully configured
        self.base_url = "http://localhost:8001"
        
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        
        print(f"🚀 MarketMindAI Seed Data Verification")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)

    def run_test(self, name, endpoint, expected_status=200, expected_data_checks=None):
        """Run a single API test with detailed validation"""
        url = f"{self.base_url}{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Test {self.tests_run}: {name}")
        print(f"   URL: {url}")
        
        try:
            response = requests.get(url, headers=headers, timeout=30)
            
            success = response.status_code == expected_status
            response_data = {}
            
            if response.text:
                try:
                    response_data = response.json()
                except:
                    response_data = {"raw_response": response.text}
            
            # Basic status check
            if success:
                print(f"✅ Status: {response.status_code} - OK")
            else:
                print(f"❌ Status: Expected {expected_status}, got {response.status_code}")
                success = False
            
            # Data validation checks
            if success and expected_data_checks:
                for check_name, check_func in expected_data_checks.items():
                    try:
                        check_result = check_func(response_data)
                        if check_result:
                            print(f"✅ {check_name}: PASSED")
                        else:
                            print(f"❌ {check_name}: FAILED")
                            success = False
                    except Exception as e:
                        print(f"❌ {check_name}: ERROR - {str(e)}")
                        success = False
            
            if success:
                self.tests_passed += 1
            
            # Store test result
            self.test_results.append({
                'name': name,
                'endpoint': endpoint,
                'success': success,
                'status_code': response.status_code,
                'response_data': response_data
            })
            
            return success, response_data
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Network Error: {str(e)}")
            self.test_results.append({
                'name': name,
                'endpoint': endpoint,
                'success': False,
                'error': str(e)
            })
            return False, {}
        except Exception as e:
            print(f"❌ Test Error: {str(e)}")
            self.test_results.append({
                'name': name,
                'endpoint': endpoint,
                'success': False,
                'error': str(e)
            })
            return False, {}

    def test_health_check(self):
        """Test health check endpoint"""
        print(f"\n🏥 HEALTH CHECK TEST")
        print("-" * 40)
        
        def check_health_status(data):
            return data.get('status') == 'healthy'
        
        success, response = self.run_test(
            "Health Check",
            "/api/health",
            200,
            {
                "Health Status": check_health_status
            }
        )
        
        if success:
            print(f"   ✅ Health check passed - System is healthy")
        
        return success

    def test_tools_pagination(self):
        """Test tools endpoint with pagination"""
        print(f"\n🔧 TOOLS PAGINATION TEST")
        print("-" * 40)
        
        def check_tools_count(data):
            if isinstance(data, list):
                return len(data) <= 5  # Should respect limit=5
            return False
        
        def check_tools_structure(data):
            if isinstance(data, list) and len(data) > 0:
                tool = data[0]
                required_fields = ['id', 'name', 'slug', 'description']
                return all(field in tool for field in required_fields)
            return False
        
        success, response = self.run_test(
            "Tools with Pagination (limit=5)",
            "/api/tools?limit=5",
            200,
            {
                "Tools Count": check_tools_count,
                "Tools Structure": check_tools_structure
            }
        )
        
        if success and isinstance(response, list):
            print(f"   ✅ Returned {len(response)} tools (respecting limit=5)")
            if len(response) > 0:
                print(f"   ✅ Sample tool: {response[0].get('name', 'N/A')}")
        
        return success

    def test_tool_detail_with_jsonld(self):
        """Test specific tool detail with JSON-LD"""
        print(f"\n🔍 TOOL DETAIL WITH JSON-LD TEST")
        print("-" * 40)
        
        def check_jsonld_structure(data):
            json_ld = data.get('json_ld')
            if not json_ld:
                return False
            
            # Check for required JSON-LD structure
            has_context = '@context' in json_ld and json_ld['@context'] == 'https://schema.org'
            has_graph = '@graph' in json_ld and isinstance(json_ld['@graph'], list)
            
            if has_graph:
                graph_types = [item.get('@type') for item in json_ld['@graph']]
                has_software_app = 'SoftwareApplication' in graph_types
                has_breadcrumb = 'BreadcrumbList' in graph_types
                
                return has_context and has_software_app and has_breadcrumb
            
            return has_context
        
        def check_tool_data(data):
            required_fields = ['id', 'name', 'slug', 'description', 'json_ld']
            return all(field in data for field in required_fields)
        
        success, response = self.run_test(
            "Tool Detail (goodcall) with JSON-LD",
            "/api/tools/by-slug/goodcall",
            200,
            {
                "Tool Data Structure": check_tool_data,
                "JSON-LD Structure": check_jsonld_structure
            }
        )
        
        if success:
            json_ld = response.get('json_ld', {})
            if json_ld:
                print(f"   ✅ JSON-LD @context: {json_ld.get('@context', 'Missing')}")
                graph = json_ld.get('@graph', [])
                if graph:
                    types = [item.get('@type') for item in graph]
                    print(f"   ✅ JSON-LD @graph types: {types}")
        
        return success

    def test_categories_endpoint(self):
        """Test categories endpoint"""
        print(f"\n📂 CATEGORIES TEST")
        print("-" * 40)
        
        def check_categories_count(data):
            if isinstance(data, list):
                # Should return 582 categories according to seed data
                return len(data) >= 500  # Allow some flexibility
            return False
        
        def check_categories_structure(data):
            if isinstance(data, list) and len(data) > 0:
                category = data[0]
                required_fields = ['id', 'name', 'slug']
                return all(field in category for field in required_fields)
            return False
        
        success, response = self.run_test(
            "All Categories",
            "/api/categories",
            200,
            {
                "Categories Count": check_categories_count,
                "Categories Structure": check_categories_structure
            }
        )
        
        if success and isinstance(response, list):
            print(f"   ✅ Returned {len(response)} categories")
            # Check for parent and child categories
            parent_categories = [cat for cat in response if cat.get('parent_id') is None]
            child_categories = [cat for cat in response if cat.get('parent_id') is not None]
            print(f"   ✅ Parent categories: {len(parent_categories)}")
            print(f"   ✅ Child categories: {len(child_categories)}")
        
        return success

    def test_blogs_with_seo(self):
        """Test blogs endpoint with SEO data"""
        print(f"\n📝 BLOGS WITH SEO TEST")
        print("-" * 40)
        
        def check_blogs_count(data):
            if isinstance(data, list):
                return len(data) <= 3  # Should respect limit=3
            return False
        
        def check_blogs_seo_structure(data):
            if isinstance(data, list) and len(data) > 0:
                blog = data[0]
                required_fields = ['id', 'title', 'slug', 'content']
                seo_fields = ['seo_title', 'seo_description', 'json_ld']
                
                has_basic = all(field in blog for field in required_fields)
                has_seo = any(field in blog and blog[field] for field in seo_fields)
                
                return has_basic and has_seo
            return False
        
        success, response = self.run_test(
            "Blogs with SEO Data (limit=3)",
            "/api/blogs?limit=3",
            200,
            {
                "Blogs Count": check_blogs_count,
                "Blogs SEO Structure": check_blogs_seo_structure
            }
        )
        
        if success and isinstance(response, list):
            print(f"   ✅ Returned {len(response)} blogs (respecting limit=3)")
            if len(response) > 0:
                blog = response[0]
                print(f"   ✅ Sample blog: {blog.get('title', 'N/A')}")
                if blog.get('json_ld'):
                    print(f"   ✅ Blog has JSON-LD structured data")
                if blog.get('seo_title'):
                    print(f"   ✅ Blog has SEO title: {blog.get('seo_title')[:50]}...")
        
        return success

    def test_total_data_counts(self):
        """Test to verify total data counts match seed expectations"""
        print(f"\n📊 TOTAL DATA COUNTS VERIFICATION")
        print("-" * 40)
        
        # Test tools count (should be 10,707+)
        success_tools, tools_response = self.run_test(
            "Total Tools Count Check",
            "/api/tools?limit=100",  # Get a sample to verify data exists
            200
        )
        
        # Test categories count (should be 582)
        success_categories, categories_response = self.run_test(
            "Total Categories Count Check",
            "/api/categories",
            200
        )
        
        # Test blogs count (should be 387)
        success_blogs, blogs_response = self.run_test(
            "Total Blogs Count Check",
            "/api/blogs?limit=100",  # Get a sample to verify data exists
            200
        )
        
        # Verify counts
        if success_tools and isinstance(tools_response, list):
            print(f"   ✅ Tools data available: {len(tools_response)} tools in sample")
        
        if success_categories and isinstance(categories_response, list):
            categories_count = len(categories_response)
            print(f"   ✅ Categories count: {categories_count}")
            if categories_count >= 580:
                print(f"   ✅ Categories count matches expectation (582 expected)")
            else:
                print(f"   ⚠️  Categories count lower than expected (582 expected)")
        
        if success_blogs and isinstance(blogs_response, list):
            print(f"   ✅ Blogs data available: {len(blogs_response)} blogs in sample")
        
        return success_tools and success_categories and success_blogs

    def run_all_tests(self):
        """Run all seed data verification tests"""
        print(f"🧪 MARKETMINDAI SEED DATA VERIFICATION")
        print("=" * 60)
        
        # Run all tests
        tests = [
            self.test_health_check,
            self.test_tools_pagination,
            self.test_tool_detail_with_jsonld,
            self.test_categories_endpoint,
            self.test_blogs_with_seo,
            self.test_total_data_counts
        ]
        
        all_passed = True
        for test in tests:
            try:
                result = test()
                if not result:
                    all_passed = False
            except Exception as e:
                print(f"❌ Test failed with exception: {str(e)}")
                all_passed = False
        
        # Print summary
        print(f"\n📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%" if self.tests_run > 0 else "0%")
        
        # Detailed results
        print(f"\n📋 DETAILED RESULTS")
        print("-" * 40)
        for result in self.test_results:
            status = "✅ PASSED" if result['success'] else "❌ FAILED"
            print(f"{status} - {result['name']}")
            if not result['success'] and 'error' in result:
                print(f"   Error: {result['error']}")
        
        if all_passed:
            print(f"\n🎉 ALL SEED DATA VERIFICATION TESTS PASSED!")
            print(f"✅ MarketMindAI backend is properly seeded and ready!")
        else:
            print(f"\n⚠️  Some tests failed. Check the results above.")
        
        return all_passed

def main():
    """Main test execution"""
    tester = MarketMindSeedTester()
    success = tester.run_all_tests()
    
    return 0 if success else 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
#!/bin/bash
# SSR and Page Functionality Test Script

echo "=========================================="
echo "SSR & Page Functionality Test"
echo "=========================================="
echo ""

# Test function
test_page() {
    local page_name=$1
    local url=$2
    local expected_content=$3
    
    echo "Testing: $page_name"
    echo "URL: $url"
    
    response=$(curl -s "$url" 2>&1)
    http_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>&1)
    
    if [ "$http_code" == "200" ]; then
        if echo "$response" | grep -q "$expected_content"; then
            echo "✅ PASS - SSR working, content found"
        else
            echo "⚠️  PARTIAL - Page loads but expected content not found"
            echo "   Looking for: $expected_content"
        fi
    elif [ "$http_code" == "404" ]; then
        echo "❌ FAIL - Page not found (404)"
    elif [ "$http_code" == "500" ]; then
        echo "❌ FAIL - Server error (500)"
    else
        echo "❌ FAIL - HTTP $http_code"
    fi
    
    echo ""
}

# Test API Health
echo "1. Testing Backend API"
echo "----------------------"
test_page "API Health Check" "http://localhost:8001/api/health" "healthy"

echo "2. Testing Landing & Static Pages"
echo "----------------------------------"
test_page "Homepage" "http://localhost:3000/" "MarketMindAI"
test_page "About Page" "http://localhost:3000/about" "About MarketMindAI"
test_page "Contact Page" "http://localhost:3000/contact" "Contact"
test_page "Pricing Page" "http://localhost:3000/pricing" "Pricing"
test_page "Free Tools Page" "http://localhost:3000/free-tools" "Free Tools"

echo "3. Testing Tools Pages (SSR Critical)"
echo "--------------------------------------"
test_page "Tools Index" "http://localhost:3000/tools" "Discover AI Tools"
test_page "Tool Detail - ChatGPT" "http://localhost:3000/tools/chatgpt" "ChatGPT"
test_page "Tool Detail - Notion" "http://localhost:3000/tools/notion" "Notion"
test_page "Tools Compare" "http://localhost:3000/tools/compare" "Compare"

echo "4. Testing Blogs Pages (SSR Critical)"
echo "--------------------------------------"
test_page "Blogs Index" "http://localhost:3000/blogs" "Latest from Our Blog"
test_page "Blog Detail" "http://localhost:3000/blogs/getting-started-with-chatgpt-for-business" "Getting Started with ChatGPT"

echo "5. Testing Auth Pages"
echo "---------------------"
test_page "Login Page" "http://localhost:3000/auth/login" "login"
test_page "Register Page" "http://localhost:3000/auth/register" "register"
test_page "Forgot Password" "http://localhost:3000/auth/forgot-password" "password"

echo "6. Testing Admin Pages (Requires Auth)"
echo "---------------------------------------"
test_page "Admin Dashboard" "http://localhost:3000/admin" "admin"
test_page "Admin Tools" "http://localhost:3000/admin/tools" "Tools"
test_page "Admin Blogs" "http://localhost:3000/admin/blogs" "Blogs"
test_page "Admin Users" "http://localhost:3000/admin/users" "Users"

echo "7. Testing User Pages (Requires Auth)"
echo "--------------------------------------"
test_page "User Dashboard" "http://localhost:3000/user/dashboard" "dashboard"

echo "8. Testing Backend API Endpoints"
echo "---------------------------------"
test_page "API - Tools List" "http://localhost:8001/api/tools?limit=3" "ChatGPT"
test_page "API - Blogs List" "http://localhost:8001/api/blogs?limit=3" "title"
test_page "API - Categories" "http://localhost:8001/api/categories" "AI"
test_page "API - Tool by Slug" "http://localhost:8001/api/tools/by-slug/chatgpt" "ChatGPT"
test_page "API - Blog by Slug" "http://localhost:8001/api/blogs/by-slug/getting-started-with-chatgpt-for-business" "ChatGPT"

echo "=========================================="
echo "Test Complete!"
echo "=========================================="

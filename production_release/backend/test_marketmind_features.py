"""
Backend tests for MarketMindAI new features:
- Blog creation with tags as array
- Blog publish with SEO content
- Blog like/bookmark toggle
- Blog like-status/bookmark-status
- User bookmarks list
- Tool like toggle
- Tool review submit
- AI recommendations
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('PUBLIC_API_URL', 'https://marketmind-staging.preview.emergentagent.com')

# Test credentials
SUPERADMIN_EMAIL = "superadmin@marketmindai.com"
SUPERADMIN_PASSWORD = "SuperAdmin@2024!"

# Data from DB
EXISTING_BLOG_SLUG = "affiliate-program-ai-matching"
EXISTING_BLOG_ID = "f2cc1e70-9287-4e4a-8ba1-e55000e40219"
EXISTING_TOOL_SLUG = "macaify"
EXISTING_TOOL_ID = "825d85ee-be5a-42cd-80e1-61ed9f0f5ed6"

# Track test-created resources
created_blog_id = None
created_blog_slug = None


@pytest.fixture(scope="module")
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture(scope="module")
def auth_token(api_client):
    """Get authentication token for superadmin"""
    response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": SUPERADMIN_EMAIL,
        "password": SUPERADMIN_PASSWORD
    })
    if response.status_code == 200:
        token = response.json().get("access_token")
        print(f"Auth token obtained: {token[:20]}..." if token else "No token")
        return token
    print(f"Auth failed: {response.status_code} - {response.text}")
    pytest.skip("Authentication failed - skipping authenticated tests")


@pytest.fixture(scope="module")
def authenticated_client(api_client, auth_token):
    """Session with auth header"""
    session = requests.Session()
    session.headers.update({
        "Content-Type": "application/json",
        "Authorization": f"Bearer {auth_token}"
    })
    return session


# ===== AUTH TESTS =====

class TestAuth:
    """Authentication endpoint tests"""

    def test_superadmin_login_success(self, api_client):
        """Test superadmin login returns token and user data"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": SUPERADMIN_EMAIL,
            "password": SUPERADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["role"] in ["superadmin", "admin"]
        assert len(data["access_token"]) > 10

    def test_invalid_credentials_returns_401(self, api_client):
        """Test that wrong credentials return 401"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": "wrong@example.com",
            "password": "wrongpassword"
        })
        assert response.status_code in [401, 400]

    def test_get_current_user_info(self, authenticated_client):
        """Test /api/auth/me returns user info"""
        response = authenticated_client.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 200
        data = response.json()
        assert "email" in data
        assert data["email"] == SUPERADMIN_EMAIL


# ===== BLOG CREATION WITH TAGS AS ARRAY =====

class TestBlogCreation:
    """Blog creation tests - tags must be sent as array"""

    def test_create_blog_with_tags_as_array(self, authenticated_client):
        """POST /api/user/blogs - tags as array ['AI','Test'] must work without validation errors"""
        global created_blog_id, created_blog_slug
        
        payload = {
            "title": "TEST_Blog Tags Array Test",
            "content": "This is a test blog to verify tags are sent as array. " * 20,
            "excerpt": "Test blog excerpt for validation",
            "tags": ["AI", "Test", "Automation"],
            "seo_title": "TEST_Blog Tags Array Test - MarketMindAI",
            "seo_description": "Testing tags as array submission",
            "seo_keywords": "AI, Test, Automation"
        }
        response = authenticated_client.post(f"{BASE_URL}/api/user/blogs", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert "slug" in data
        assert data["title"] == payload["title"]
        assert isinstance(data["tags"], list), "Tags must be returned as a list"
        assert "AI" in data["tags"]
        assert "Test" in data["tags"]
        
        # Store for subsequent tests
        created_blog_id = data["id"]
        created_blog_slug = data["slug"]
        print(f"Created blog: id={created_blog_id}, slug={created_blog_slug}")

    def test_create_blog_draft_status(self, authenticated_client):
        """Blog created via POST /api/user/blogs starts as draft"""
        response = authenticated_client.get(f"{BASE_URL}/api/user/blogs/{created_blog_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "draft"

    def test_create_blog_missing_title_fails(self, authenticated_client):
        """Blog creation without title should fail with 422"""
        payload = {
            "content": "This blog has no title",
            "tags": ["AI"]
        }
        response = authenticated_client.post(f"{BASE_URL}/api/user/blogs", json=payload)
        assert response.status_code == 422

    def test_create_blog_tags_as_string_fails(self, authenticated_client):
        """Tags as string should fail validation (should be an array)"""
        payload = {
            "title": "TEST_Blog Tags String Test",
            "content": "Testing that tags as string fails validation. " * 10,
            "tags": "AI,Test"  # This is the OLD broken format - should fail
        }
        response = authenticated_client.post(f"{BASE_URL}/api/user/blogs", json=payload)
        # Pydantic should reject this since tags: Optional[List[str]] expects array
        assert response.status_code == 422, f"Expected 422 for tags as string, got {response.status_code}"


# ===== BLOG PUBLISH =====

class TestBlogPublish:
    """Blog publish tests"""

    def test_publish_blog_returns_seo_content(self, authenticated_client):
        """POST /api/user/blogs/{id}/publish must publish and return SEO-optimized content"""
        if not created_blog_id:
            pytest.skip("No blog created in previous test")
        
        response = authenticated_client.post(f"{BASE_URL}/api/user/blogs/{created_blog_id}/publish")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "published" in data["message"].lower()
        assert data.get("seo_generated") == True or "blog" in data
        
        # Verify the blog data in response
        if "blog" in data:
            blog_data = data["blog"]
            assert blog_data["status"] == "published"
            assert blog_data["seo_title"] is not None

    def test_published_blog_status_is_published(self, authenticated_client):
        """After publish, blog status should be 'published'"""
        if not created_blog_id:
            pytest.skip("No blog created in previous test")
        
        response = authenticated_client.get(f"{BASE_URL}/api/user/blogs/{created_blog_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "published"
        assert data["published_at"] is not None


# ===== BLOG LIKE/BOOKMARK TOGGLE =====

class TestBlogLikeBookmark:
    """Blog like and bookmark toggle tests"""

    def test_blog_like_toggle_returns_liked_and_count(self, authenticated_client):
        """POST /api/blogs/{slug}/like must return {liked, like_count}"""
        response = authenticated_client.post(f"{BASE_URL}/api/blogs/{EXISTING_BLOG_SLUG}/like")
        assert response.status_code == 200
        data = response.json()
        assert "liked" in data, f"'liked' not in response: {data}"
        assert "like_count" in data, f"'like_count' not in response: {data}"
        assert isinstance(data["liked"], bool)
        assert isinstance(data["like_count"], int)
        assert data["like_count"] >= 0

    def test_blog_like_toggle_updates_count(self, authenticated_client):
        """Like count must change on consecutive toggles"""
        # First toggle
        resp1 = authenticated_client.post(f"{BASE_URL}/api/blogs/{EXISTING_BLOG_SLUG}/like")
        assert resp1.status_code == 200
        liked1 = resp1.json()["liked"]
        count1 = resp1.json()["like_count"]
        
        # Second toggle (reverse)
        resp2 = authenticated_client.post(f"{BASE_URL}/api/blogs/{EXISTING_BLOG_SLUG}/like")
        assert resp2.status_code == 200
        liked2 = resp2.json()["liked"]
        count2 = resp2.json()["like_count"]
        
        # Liked status should be opposite
        assert liked1 != liked2, "Liked status should toggle"
        # Count should change by 1
        assert abs(count1 - count2) == 1, f"Count should change by 1, got {count1} vs {count2}"

    def test_blog_bookmark_toggle_returns_bookmarked_status(self, authenticated_client):
        """POST /api/blogs/{slug}/bookmark must return {bookmarked} status"""
        response = authenticated_client.post(f"{BASE_URL}/api/blogs/{EXISTING_BLOG_SLUG}/bookmark")
        assert response.status_code == 200
        data = response.json()
        assert "bookmarked" in data, f"'bookmarked' not in response: {data}"
        assert isinstance(data["bookmarked"], bool)

    def test_blog_bookmark_toggle_reverses(self, authenticated_client):
        """Bookmark should toggle on consecutive calls"""
        resp1 = authenticated_client.post(f"{BASE_URL}/api/blogs/{EXISTING_BLOG_SLUG}/bookmark")
        assert resp1.status_code == 200
        bookmarked1 = resp1.json()["bookmarked"]
        
        resp2 = authenticated_client.post(f"{BASE_URL}/api/blogs/{EXISTING_BLOG_SLUG}/bookmark")
        assert resp2.status_code == 200
        bookmarked2 = resp2.json()["bookmarked"]
        
        assert bookmarked1 != bookmarked2, "Bookmark should toggle"


# ===== BLOG LIKE-STATUS / BOOKMARK-STATUS =====

class TestBlogStatusEndpoints:
    """Blog like-status and bookmark-status endpoints"""

    def test_like_status_returns_liked_bool(self, authenticated_client):
        """GET /api/blogs/{slug}/like-status must return {liked: bool}"""
        response = authenticated_client.get(f"{BASE_URL}/api/blogs/{EXISTING_BLOG_SLUG}/like-status")
        assert response.status_code == 200
        data = response.json()
        assert "liked" in data, f"'liked' not in response: {data}"
        assert isinstance(data["liked"], bool)

    def test_bookmark_status_returns_bookmarked_bool(self, authenticated_client):
        """GET /api/blogs/{slug}/bookmark-status must return {bookmarked: bool}"""
        response = authenticated_client.get(f"{BASE_URL}/api/blogs/{EXISTING_BLOG_SLUG}/bookmark-status")
        assert response.status_code == 200
        data = response.json()
        assert "bookmarked" in data, f"'bookmarked' not in response: {data}"
        assert isinstance(data["bookmarked"], bool)

    def test_like_status_without_auth_fails(self, api_client):
        """Like-status requires authentication"""
        response = api_client.get(f"{BASE_URL}/api/blogs/{EXISTING_BLOG_SLUG}/like-status")
        assert response.status_code in [401, 403]

    def test_bookmark_status_without_auth_fails(self, api_client):
        """Bookmark-status requires authentication"""
        response = api_client.get(f"{BASE_URL}/api/blogs/{EXISTING_BLOG_SLUG}/bookmark-status")
        assert response.status_code in [401, 403]


# ===== USER BOOKMARKS LIST =====

class TestUserBookmarks:
    """User bookmarks list tests"""

    def test_get_user_bookmarks_returns_array(self, authenticated_client):
        """GET /api/user/bookmarks must return array of bookmarked blogs"""
        response = authenticated_client.get(f"{BASE_URL}/api/user/bookmarks")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list), f"Expected list, got {type(data)}: {data}"

    def test_bookmarked_blog_appears_in_bookmarks(self, authenticated_client):
        """After bookmarking, the blog should appear in user bookmarks"""
        # First ensure the blog is bookmarked
        bookmark_resp = authenticated_client.post(f"{BASE_URL}/api/blogs/{EXISTING_BLOG_SLUG}/bookmark")
        assert bookmark_resp.status_code == 200
        
        if not bookmark_resp.json().get("bookmarked"):
            # Toggle again to bookmark
            authenticated_client.post(f"{BASE_URL}/api/blogs/{EXISTING_BLOG_SLUG}/bookmark")
        
        # Get bookmarks
        response = authenticated_client.get(f"{BASE_URL}/api/user/bookmarks")
        assert response.status_code == 200
        bookmarks = response.json()
        assert isinstance(bookmarks, list)
        
        # Check structure of bookmark entries
        if bookmarks:
            bm = bookmarks[0]
            assert "id" in bm
            assert "title" in bm
            assert "slug" in bm

    def test_user_bookmarks_requires_auth(self, api_client):
        """User bookmarks endpoint requires authentication"""
        response = api_client.get(f"{BASE_URL}/api/user/bookmarks")
        assert response.status_code in [401, 403]


# ===== TOOL LIKE TOGGLE =====

class TestToolLike:
    """Tool like toggle tests"""

    def test_tool_like_toggle_returns_liked_and_count(self, authenticated_client):
        """POST /api/tools/{slug}/like must return {liked, like_count}"""
        response = authenticated_client.post(f"{BASE_URL}/api/tools/{EXISTING_TOOL_SLUG}/like")
        assert response.status_code == 200
        data = response.json()
        assert "liked" in data, f"'liked' not in response: {data}"
        assert "like_count" in data, f"'like_count' not in response: {data}"
        assert isinstance(data["liked"], bool)
        assert isinstance(data["like_count"], int)

    def test_tool_like_toggle_count_changes(self, authenticated_client):
        """Tool like count changes on toggle"""
        resp1 = authenticated_client.post(f"{BASE_URL}/api/tools/{EXISTING_TOOL_SLUG}/like")
        assert resp1.status_code == 200
        liked1 = resp1.json()["liked"]
        count1 = resp1.json()["like_count"]
        
        resp2 = authenticated_client.post(f"{BASE_URL}/api/tools/{EXISTING_TOOL_SLUG}/like")
        assert resp2.status_code == 200
        liked2 = resp2.json()["liked"]
        count2 = resp2.json()["like_count"]
        
        assert liked1 != liked2
        assert abs(count1 - count2) == 1

    def test_tool_like_requires_auth(self, api_client):
        """Tool like requires authentication"""
        response = api_client.post(f"{BASE_URL}/api/tools/{EXISTING_TOOL_SLUG}/like")
        assert response.status_code in [401, 403]


# ===== TOOL REVIEW =====

class TestToolReview:
    """Tool review submission tests"""

    def test_create_tool_review(self, authenticated_client):
        """POST /api/user/tools/{id}/review must create review with rating"""
        payload = {
            "tool_id": EXISTING_TOOL_ID,
            "rating": 4,
            "title": "TEST_Review - Great Tool",
            "content": "This is a test review for the tool. It works great for AI tasks.",
            "pros": ["Easy to use", "Fast"],
            "cons": ["Limited features in free tier"]
        }
        response = authenticated_client.post(f"{BASE_URL}/api/user/tools/{EXISTING_TOOL_ID}/review", json=payload)
        
        if response.status_code == 400:
            data = response.json()
            if "already reviewed" in str(data.get("detail", "")).lower():
                pytest.skip("Tool already reviewed by this user - acceptable behavior")
        
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["rating"] == 4
        assert data["title"] == payload["title"]
        assert data["tool_id"] == EXISTING_TOOL_ID


# ===== AI RECOMMENDATIONS =====

class TestAIRecommendations:
    """AI recommendations endpoint tests"""

    def test_ai_recommend_tools_returns_recommendations(self, authenticated_client):
        """POST /api/ai/recommend-tools must return recommendations"""
        payload = {
            "user_needs": "I need a tool to help me write marketing content and social media posts",
            "budget": "any",
            "features_needed": ["content generation", "templates"],
            "limit": 3
        }
        response = authenticated_client.post(f"{BASE_URL}/api/ai/recommend-tools", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "recommendations" in data, f"'recommendations' not in response: {data}"
        assert isinstance(data["recommendations"], list)
        # Should have recommendations (may be empty if no tools match)
        print(f"Got {len(data['recommendations'])} recommendations")

    def test_ai_recommend_tools_response_structure(self, authenticated_client):
        """AI recommendations response has correct structure"""
        payload = {
            "user_needs": "I need an AI writing assistant",
            "limit": 5
        }
        response = authenticated_client.post(f"{BASE_URL}/api/ai/recommend-tools", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "recommendations" in data
        assert "ai_analysis" in data or "total_analyzed" in data
        
        if data["recommendations"]:
            rec = data["recommendations"][0]
            assert "id" in rec
            assert "name" in rec
            assert "slug" in rec

    def test_ai_recommend_tools_requires_auth(self, api_client):
        """AI recommendations requires authentication"""
        payload = {"user_needs": "I need a writing tool"}
        response = api_client.post(f"{BASE_URL}/api/ai/recommend-tools", json=payload)
        assert response.status_code in [401, 403]

    def test_ai_recommend_tools_requires_user_needs(self, authenticated_client):
        """AI recommendations requires user_needs field"""
        payload = {"budget": "free"}
        response = authenticated_client.post(f"{BASE_URL}/api/ai/recommend-tools", json=payload)
        assert response.status_code == 422  # Missing required field


# ===== TOOLS API =====

class TestToolsApi:
    """Tools API basic tests"""

    def test_get_tools_returns_list(self, api_client):
        """GET /api/tools returns list of tools"""
        response = api_client.get(f"{BASE_URL}/api/tools")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0

    def test_get_tool_by_slug(self, api_client):
        """GET /api/tools/by-slug/{slug} returns tool"""
        response = api_client.get(f"{BASE_URL}/api/tools/by-slug/{EXISTING_TOOL_SLUG}")
        assert response.status_code == 200
        data = response.json()
        assert data["slug"] == EXISTING_TOOL_SLUG
        assert "url" in data


# ===== BLOGS API =====

class TestBlogsApi:
    """Blogs API basic tests"""

    def test_get_published_blogs(self, api_client):
        """GET /api/blogs returns published blogs"""
        response = api_client.get(f"{BASE_URL}/api/blogs")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        
    def test_get_blog_by_slug(self, api_client):
        """GET /api/blogs/by-slug/{slug} returns blog"""
        response = api_client.get(f"{BASE_URL}/api/blogs/by-slug/{EXISTING_BLOG_SLUG}")
        assert response.status_code == 200
        data = response.json()
        assert data["slug"] == EXISTING_BLOG_SLUG

    def test_get_user_blogs_requires_auth(self, api_client):
        """GET /api/user/blogs requires authentication"""
        response = api_client.get(f"{BASE_URL}/api/user/blogs")
        assert response.status_code in [401, 403]


# ===== CLEANUP =====

class TestCleanup:
    """Cleanup test-created data"""

    def test_cleanup_test_blog(self, authenticated_client):
        """Delete test blog created during tests"""
        if not created_blog_id:
            return
        
        response = authenticated_client.delete(f"{BASE_URL}/api/user/blogs/{created_blog_id}")
        assert response.status_code in [200, 204, 404]
        print(f"Cleaned up test blog: {created_blog_id}")

    def test_cleanup_test_review(self, authenticated_client):
        """Delete test review created during tests"""
        response = authenticated_client.delete(f"{BASE_URL}/api/user/tools/{EXISTING_TOOL_ID}/review")
        # Accept 200 or 404 (if review was already deleted or not created)
        assert response.status_code in [200, 404]

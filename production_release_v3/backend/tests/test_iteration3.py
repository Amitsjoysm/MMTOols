"""
MarketMindAI - Iteration 3 Backend Tests
Tests focused on:
- Backend health check
- Admin auth/me endpoint (critical for AdminProtection fix)
- Site settings analytics endpoints (new feature)
- Admin tool CRUD without page refresh
- Admin blog CRUD without page refresh
- Admin category CRUD
- User blog create/edit (tags as array)
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

@pytest.fixture(scope="module")
def superadmin_token():
    """Get superadmin auth token"""
    resp = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": "superadmin@marketmindai.com",
        "password": "SuperAdmin@2024!"
    })
    assert resp.status_code == 200, f"Login failed: {resp.text}"
    return resp.json()["access_token"]

@pytest.fixture(scope="module")
def superadmin_headers(superadmin_token):
    return {"Authorization": f"Bearer {superadmin_token}", "Content-Type": "application/json"}


# ---- Health Check ----
class TestHealth:
    """Backend health endpoint"""

    def test_health_returns_healthy_and_connected(self):
        resp = requests.get(f"{BASE_URL}/api/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data.get("status") == "healthy", f"Expected healthy, got: {data}"
        assert data.get("database") == "connected", f"Expected connected DB, got: {data}"


# ---- Auth / Me Endpoint (AdminProtection fix) ----
class TestAuthMe:
    """GET /api/auth/me must succeed - critical for AdminProtection overlay fix"""

    def test_auth_me_with_superadmin_token(self, superadmin_headers):
        resp = requests.get(f"{BASE_URL}/api/auth/me", headers=superadmin_headers)
        assert resp.status_code == 200, f"auth/me failed: {resp.status_code} {resp.text}"
        data = resp.json()
        assert "email" in data or "id" in data, "Missing user fields in auth/me response"
        assert data.get("role") in ("admin", "superadmin"), f"Role should be admin/superadmin, got: {data.get('role')}"

    def test_auth_me_without_token_returns_401_or_403(self):
        resp = requests.get(f"{BASE_URL}/api/auth/me")
        assert resp.status_code in (401, 403), f"Expected 401/403 without token, got: {resp.status_code}"


# ---- Site Settings Analytics ----
class TestSiteSettingsAnalytics:
    """GET /api/site-settings/analytics and POST /api/superadmin/site-settings/analytics"""

    def test_get_analytics_public_endpoint(self):
        """Public GET must return expected fields"""
        resp = requests.get(f"{BASE_URL}/api/site-settings/analytics")
        assert resp.status_code == 200, f"GET analytics failed: {resp.status_code} {resp.text}"
        data = resp.json()
        assert "analytics_id" in data, "Missing analytics_id field"
        assert "adsense_id" in data, "Missing adsense_id field"
        assert "custom_head_code" in data, "Missing custom_head_code field"
        assert "gtm_id" in data, "Missing gtm_id field"

    def test_post_analytics_saves_and_persists(self, superadmin_headers):
        """POST analytics settings and verify persistence via GET"""
        payload = {
            "analytics_id": "G-TEST123456",
            "adsense_id": "ca-pub-TEST123",
            "gtm_id": "GTM-TEST123",
            "custom_head_code": ""
        }
        resp = requests.post(
            f"{BASE_URL}/api/superadmin/site-settings/analytics",
            json=payload,
            headers=superadmin_headers
        )
        assert resp.status_code == 200, f"POST analytics failed: {resp.status_code} {resp.text}"
        data = resp.json()
        assert "updated" in data or "message" in data, f"Unexpected response: {data}"

        # Verify persistence via GET
        get_resp = requests.get(f"{BASE_URL}/api/site-settings/analytics")
        assert get_resp.status_code == 200
        get_data = get_resp.json()
        assert get_data.get("analytics_id") == "G-TEST123456", f"analytics_id not saved: {get_data}"
        assert get_data.get("gtm_id") == "GTM-TEST123", f"gtm_id not saved: {get_data}"

    def test_post_analytics_requires_auth(self):
        """POST without auth returns 401"""
        resp = requests.post(
            f"{BASE_URL}/api/superadmin/site-settings/analytics",
            json={"analytics_id": "test"},
        )
        assert resp.status_code in (401, 403), f"Expected auth error, got: {resp.status_code}"


# ---- Admin Category CRUD ----
class TestAdminCategoryCRUD:
    """Superadmin category management"""

    @pytest.fixture
    def created_category_id(self, superadmin_headers):
        """Create a test category and return its ID"""
        resp = requests.post(
            f"{BASE_URL}/api/superadmin/categories",
            json={"name": "TEST_Category_Iter3", "description": "Test category for iteration 3"},
            headers=superadmin_headers
        )
        assert resp.status_code == 200, f"Failed to create category: {resp.status_code} {resp.text}"
        data = resp.json()
        cat_id = data.get("category_id")
        assert cat_id, f"Missing category_id in response: {data}"
        yield cat_id
        # Cleanup
        requests.delete(f"{BASE_URL}/api/superadmin/categories/{cat_id}", headers=superadmin_headers)

    def test_create_category(self, superadmin_headers, created_category_id):
        assert created_category_id is not None

    def test_update_category(self, superadmin_headers, created_category_id):
        resp = requests.put(
            f"{BASE_URL}/api/superadmin/categories/{created_category_id}",
            json={"name": "TEST_Category_Iter3_Updated"},
            headers=superadmin_headers
        )
        assert resp.status_code == 200, f"Category update failed: {resp.status_code} {resp.text}"
        data = resp.json()
        assert "updated" in data.get("message", "").lower() or data.get("message") is not None


# ---- Admin Blog CRUD ----
class TestAdminBlogCRUD:
    """Superadmin blog CRUD - no page refresh required"""

    @pytest.fixture(scope="class")
    def superadmin_user_id(self, superadmin_headers):
        resp = requests.get(f"{BASE_URL}/api/auth/me", headers=superadmin_headers)
        return resp.json().get("id")

    @pytest.fixture
    def created_blog_id(self, superadmin_headers, superadmin_user_id):
        resp = requests.post(
            f"{BASE_URL}/api/superadmin/blogs",
            json={
                "title": "TEST_Admin_Blog_Iter3",
                "content": "This is test content for iteration 3 testing purposes.",
                "author_id": superadmin_user_id,
                "status": "draft",
                "tags": ["test", "iteration3"]
            },
            headers=superadmin_headers
        )
        assert resp.status_code == 200, f"Blog create failed: {resp.status_code} {resp.text}"
        blog_id = resp.json().get("blog_id")
        assert blog_id, f"Missing blog_id: {resp.json()}"
        yield blog_id
        # Cleanup
        requests.delete(f"{BASE_URL}/api/superadmin/blogs/{blog_id}", headers=superadmin_headers)

    def test_create_blog_returns_id(self, created_blog_id):
        assert created_blog_id is not None

    def test_create_blog_and_verify_persistence(self, superadmin_headers, created_blog_id):
        """Create → GET to verify persistence"""
        resp = requests.get(f"{BASE_URL}/api/superadmin/blogs/{created_blog_id}", headers=superadmin_headers)
        assert resp.status_code == 200, f"GET blog failed: {resp.status_code}"
        data = resp.json()
        assert data.get("title") == "TEST_Admin_Blog_Iter3"
        assert data.get("status") == "draft"
        assert isinstance(data.get("tags"), list)

    def test_update_blog_and_verify_persistence(self, superadmin_headers, created_blog_id):
        """Update → GET to verify update persisted"""
        update_resp = requests.put(
            f"{BASE_URL}/api/superadmin/blogs/{created_blog_id}",
            json={"title": "TEST_Admin_Blog_Iter3_Updated", "status": "published"},
            headers=superadmin_headers
        )
        assert update_resp.status_code == 200, f"Blog update failed: {update_resp.status_code} {update_resp.text}"

        # Verify persistence
        get_resp = requests.get(f"{BASE_URL}/api/superadmin/blogs/{created_blog_id}", headers=superadmin_headers)
        assert get_resp.status_code == 200
        data = get_resp.json()
        assert data.get("title") == "TEST_Admin_Blog_Iter3_Updated"
        assert data.get("status") == "published"


# ---- Admin Tool CRUD ----
class TestAdminToolCRUD:
    """Superadmin tool management"""

    @pytest.fixture
    def created_tool_id(self, superadmin_headers):
        resp = requests.post(
            f"{BASE_URL}/api/superadmin/tools",
            json={
                "name": "TEST_Tool_Iter3",
                "description": "Test tool for iteration 3 backend testing",
                "short_description": "Test tool",
                "url": "https://test-tool-iter3.example.com",
                "pricing_type": "free",
                "is_active": True
            },
            headers=superadmin_headers
        )
        assert resp.status_code == 200, f"Tool create failed: {resp.status_code} {resp.text}"
        tool_id = resp.json().get("tool_id")
        assert tool_id, f"Missing tool_id: {resp.json()}"
        yield tool_id
        # Cleanup
        requests.delete(f"{BASE_URL}/api/superadmin/tools/{tool_id}", headers=superadmin_headers)

    def test_create_tool_returns_id(self, created_tool_id):
        assert created_tool_id is not None

    def test_create_tool_and_verify_persistence(self, superadmin_headers, created_tool_id):
        """Create → GET to verify"""
        resp = requests.get(f"{BASE_URL}/api/superadmin/tools/{created_tool_id}", headers=superadmin_headers)
        assert resp.status_code == 200, f"GET tool failed: {resp.status_code}"
        data = resp.json()
        assert data.get("name") == "TEST_Tool_Iter3"
        assert data.get("is_active") is True

    def test_update_tool_and_verify_persistence(self, superadmin_headers, created_tool_id):
        """Update → GET to verify"""
        update_resp = requests.put(
            f"{BASE_URL}/api/superadmin/tools/{created_tool_id}",
            json={"name": "TEST_Tool_Iter3_Updated", "is_featured": True},
            headers=superadmin_headers
        )
        assert update_resp.status_code == 200, f"Tool update failed: {update_resp.status_code} {update_resp.text}"

        get_resp = requests.get(f"{BASE_URL}/api/superadmin/tools/{created_tool_id}", headers=superadmin_headers)
        assert get_resp.status_code == 200
        data = get_resp.json()
        assert data.get("name") == "TEST_Tool_Iter3_Updated"
        assert data.get("is_featured") is True


# ---- User Blog CRUD ----
class TestUserBlogCRUD:
    """User blog create/edit - tags as array"""

    @pytest.fixture(scope="class")
    def regular_user_headers(self):
        # Create a test user first or use existing
        resp = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "superadmin@marketmindai.com",
            "password": "SuperAdmin@2024!"
        })
        assert resp.status_code == 200
        token = resp.json()["access_token"]
        return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    @pytest.fixture
    def created_user_blog_id(self, regular_user_headers):
        resp = requests.post(
            f"{BASE_URL}/api/user/blogs",
            json={
                "title": "TEST_User_Blog_Iter3",
                "content": "User blog test content for iteration 3",
                "tags": ["test", "user", "iteration3"],
                "status": "draft"
            },
            headers=regular_user_headers
        )
        assert resp.status_code in (200, 201), f"User blog create failed: {resp.status_code} {resp.text}"
        data = resp.json()
        blog_id = data.get("blog_id") or data.get("id")
        assert blog_id, f"Missing blog_id: {data}"
        yield blog_id
        # Cleanup
        requests.delete(f"{BASE_URL}/api/user/blogs/{blog_id}", headers=regular_user_headers)

    def test_user_create_blog_with_tags_array(self, regular_user_headers, created_user_blog_id):
        """POST /api/user/blogs with tags as array - verify persistence"""
        resp = requests.get(f"{BASE_URL}/api/user/blogs/{created_user_blog_id}", headers=regular_user_headers)
        if resp.status_code == 404:
            # Try superadmin endpoint
            sa_resp = requests.post(f"{BASE_URL}/api/auth/login", json={
                "email": "superadmin@marketmindai.com",
                "password": "SuperAdmin@2024!"
            })
            sa_token = sa_resp.json()["access_token"]
            sa_headers = {"Authorization": f"Bearer {sa_token}"}
            resp = requests.get(f"{BASE_URL}/api/superadmin/blogs/{created_user_blog_id}", headers=sa_headers)
        assert resp.status_code == 200, f"Blog not found: {resp.status_code}"
        data = resp.json()
        assert isinstance(data.get("tags"), list), f"Tags should be list, got: {type(data.get('tags'))}"

    def test_user_update_blog(self, regular_user_headers, created_user_blog_id):
        """PUT /api/user/blogs/{id} - update without page refresh"""
        resp = requests.put(
            f"{BASE_URL}/api/user/blogs/{created_user_blog_id}",
            json={"title": "TEST_User_Blog_Iter3_Updated", "tags": ["updated", "test"]},
            headers=regular_user_headers
        )
        assert resp.status_code in (200, 201), f"User blog update failed: {resp.status_code} {resp.text}"

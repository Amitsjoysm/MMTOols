// Dynamic XML sitemap - fetches all tools and blogs from the API
// Serves at /sitemap-dynamic.xml

const API_BASE = process.env.PUBLIC_API_URL || 'http://localhost:8001';
const SITE_URL = 'https://marketmindai.com';

interface ToolSlug { slug: string; updated_at?: string; }
interface BlogSlug { slug: string; published_at?: string; updated_at?: string; }

async function fetchAll<T>(endpoint: string): Promise<T[]> {
  try {
    const resp = await fetch(`${API_BASE}${endpoint}`, { signal: AbortSignal.timeout(30000) });
    if (!resp.ok) return [];
    const data = await resp.json();
    return Array.isArray(data) ? data : (data.items || data.tools || data.blogs || []);
  } catch {
    return [];
  }
}

function xmlDate(d?: string): string {
  if (!d) return new Date().toISOString().split('T')[0];
  try { return new Date(d).toISOString().split('T')[0]; } catch { return new Date().toISOString().split('T')[0]; }
}

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: string): string {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  // Fetch all tool slugs and blog slugs in parallel
  const [tools, blogs, categories] = await Promise.all([
    fetchAll<ToolSlug>('/api/tools?limit=20000&fields=slug,updated_at'),
    fetchAll<BlogSlug>('/api/blogs?limit=5000&fields=slug,published_at,updated_at&status=published'),
    fetchAll<{slug:string}>('/api/categories?limit=1000'),
  ]);

  const staticPages = [
    urlEntry(`${SITE_URL}/`, today, 'daily', '1.0'),
    urlEntry(`${SITE_URL}/tools`, today, 'daily', '0.9'),
    urlEntry(`${SITE_URL}/blogs`, today, 'daily', '0.9'),
    urlEntry(`${SITE_URL}/about`, today, 'monthly', '0.5'),
    urlEntry(`${SITE_URL}/contact`, today, 'monthly', '0.4'),
    urlEntry(`${SITE_URL}/pricing`, today, 'monthly', '0.5'),
  ];

  const categoryEntries = categories.map((c: any) =>
    urlEntry(`${SITE_URL}/tools?category=${c.slug}`, today, 'weekly', '0.7')
  );

  const toolEntries = tools.map((t) =>
    urlEntry(`${SITE_URL}/tools/${t.slug}`, xmlDate(t.updated_at), 'weekly', '0.8')
  );

  const blogEntries = blogs.map((b) =>
    urlEntry(`${SITE_URL}/blogs/${b.slug}`, xmlDate(b.updated_at || b.published_at), 'monthly', '0.7')
  );

  const allEntries = [...staticPages, ...categoryEntries, ...toolEntries, ...blogEntries];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allEntries.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'noindex',
    },
  });
}

import { c as createComponent, r as renderComponent, d as renderScript, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_ngSGK97K.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_0VZwM4He.mjs';
export { renderers } from '../../renderers.mjs';

const $$Sitemap = createComponent(async ($$result, $$props, $$slots) => {
  const metadata = {
    title: "Sitemap Management - Admin"
  };
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="sitemap-management" class="space-y-6"> <!-- Header --> <div class="flex items-center justify-between"> <div> <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Sitemap Management</h2> <p class="text-gray-600 dark:text-gray-400 mt-1">Generate and save sitemap.xml for SEO optimization</p> </div> </div> <!-- Success/Error Messages --> <div id="success-message" class="hidden p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"> <span id="success-text"></span> </div> <div id="error-message" class="hidden p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"> <span id="error-text"></span> </div> <!-- Sitemap Generation --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Generate Sitemap</h3> <p class="text-gray-600 dark:text-gray-400 mb-6">
Generate an updated sitemap.xml file based on current blogs, tools, and categories. This will improve SEO by helping search engines discover your content.
</p> <div class="space-y-4"> <!-- Sitemap Info --> <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"> <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">📋 What's Included</h4> <ul class="list-disc list-inside text-sm text-blue-800 dark:text-blue-200 space-y-1"> <li>All published blog posts</li> <li>All active tool pages</li> <li>All category pages</li> <li>Static pages (about, contact, pricing, etc.)</li> </ul> <p class="text-xs text-blue-600 dark:text-blue-300 mt-2">
Note: Admin and user dashboard pages are excluded for security
</p> </div> <!-- Generate Button --> <button id="generate-sitemap-btn" class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium" data-testid="generate-sitemap-btn">
🚀 Generate & Save Sitemap to Production
</button> <!-- Loading State --> <div id="loading" class="hidden text-center py-4"> <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div> <p class="mt-2 text-gray-600 dark:text-gray-400">Generating sitemap...</p> </div> <!-- Sitemap Preview --> <div id="sitemap-preview" class="hidden"> <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Sitemap Preview</h4> <div class="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto"> <pre id="sitemap-content" class="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap"></pre> </div> </div> </div> </div> <!-- Robots.txt Generation --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Generate Robots.txt</h3> <p class="text-gray-600 dark:text-gray-400 mb-6">
Generate an updated robots.txt file to control search engine crawling behavior.
</p> <button id="generate-robots-btn" class="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium" data-testid="generate-robots-btn">
📄 Generate & Save Robots.txt to Production
</button> </div> <!-- Manual Sitemap URL --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Current Sitemap</h3> <p class="text-gray-600 dark:text-gray-400 mb-4">
Your sitemap is publicly accessible at:
</p> <a href="/sitemap.xml" target="_blank" class="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-mono text-sm">
/sitemap.xml →
</a> </div> </div> ` })} ${renderScript($$result, "/app/frontend/src/pages/admin/sitemap.astro?astro&type=script&index=0&lang.ts")}`;
}, "/app/frontend/src/pages/admin/sitemap.astro", void 0);

const $$file = "/app/frontend/src/pages/admin/sitemap.astro";
const $$url = "/admin/sitemap";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Sitemap,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

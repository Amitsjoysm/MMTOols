import { c as createComponent, r as renderComponent, d as renderScript, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CZk8NOd-.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_Csi0zVbJ.mjs';
export { renderers } from '../../renderers.mjs';

const $$Seo = createComponent(async ($$result, $$props, $$slots) => {
  const metadata = {
    title: "SEO Management - Admin"
  };
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="seo-management" class="space-y-6"> <div class="flex items-center justify-between"> <h2 class="text-2xl font-bold text-gray-900 dark:text-white">SEO Management</h2> </div> <!-- SEO Overview Stats --> <div id="seo-overview" class="grid grid-cols-1 md:grid-cols-4 gap-6"> <!-- Stats will be loaded here --> </div> <!-- SEO Actions --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">SEO Tools</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <button id="generate-json-ld-btn" class="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-left" data-testid="generate-json-ld-btn"> <div class="font-bold">Generate JSON-LD for All Content</div> <div class="text-sm opacity-90">Add structured data to tools and blogs</div> </button> <button id="analyze-issues-btn" class="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-left"> <div class="font-bold">Analyze SEO Issues</div> <div class="text-sm opacity-90">Find and fix SEO problems</div> </button> </div> </div> <!-- SEO Issues Section --> <div id="seo-issues-section" class="hidden"> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> <div class="flex items-center justify-between mb-4"> <h3 class="text-lg font-bold text-gray-900 dark:text-white">SEO Issues</h3> <select id="severity-filter" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"> <option value="">All Severity</option> <option value="critical">Critical</option> <option value="high">High</option> <option value="medium">Medium</option> <option value="low">Low</option> </select> </div> <!-- Issues Summary --> <div id="issues-summary" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"> <!-- Summary will be rendered here --> </div> <!-- Issues List --> <div id="issues-list" class="space-y-4"> <!-- Issues will be rendered here --> </div> </div> </div> <!-- Loading State --> <div id="loading" class="hidden text-center py-12"> <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div> <p class="mt-4 text-gray-600 dark:text-gray-400">Processing...</p> </div> </div> ` })} ${renderScript($$result, "/app/frontend/src/pages/admin/seo.astro?astro&type=script&index=0&lang.ts")}`;
}, "/app/frontend/src/pages/admin/seo.astro", void 0);

const $$file = "/app/frontend/src/pages/admin/seo.astro";
const $$url = "/admin/seo";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Seo,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

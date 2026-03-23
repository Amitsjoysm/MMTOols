import { c as createComponent, r as renderComponent, d as renderScript, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DmgvrA-F.mjs';
import 'piccolore';
import { $ as $$PageLayout } from '../../chunks/PageLayout_B1SbXrLv.mjs';
export { renderers } from '../../renderers.mjs';

const $$Compare = createComponent(async ($$result, $$props, $$slots) => {
  const metadata = {
    title: "Compare Tools - MarketMindAI",
    description: "Compare AI tools and business solutions side-by-side to make informed decisions."
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div id="auth-gate-overlay" class="fixed inset-0 bg-gray-900/95 z-[9999] flex items-center justify-center"> <div class="text-center text-white p-8 max-w-md"> <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" id="auth-loading"></div> <div id="auth-gate-content" class="hidden"> <svg class="w-16 h-16 mx-auto mb-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path> </svg> <h2 class="text-2xl font-bold mb-2">Login Required</h2> <p class="mb-6 text-gray-300">Please login to access the tool comparison feature.</p> <a href="/auth/login?redirect=/tools/compare" class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" data-testid="login-to-compare-btn">
Login to Compare Tools
</a> <p class="mt-4 text-sm text-gray-400">
Don't have an account? <a href="/auth/register" class="text-blue-400 hover:text-blue-300">Register here</a> </p> </div> </div> </div> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12"> <!-- Header --> <div class="text-center mb-12"> <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
Compare Tools
</h1> <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
Select tools to compare their features, pricing, and ratings side-by-side.
</p> </div> <!-- Tool Selection --> <div id="tool-selector" class="mb-8"> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Select Tools to Compare (max 5)</h2> <!-- Search for tools --> <div class="mb-4"> <input type="text" id="tool-search" placeholder="Search for tools to add..." class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-testid="tool-search-input"> </div> <!-- Search results --> <div id="search-results" class="hidden mb-4 max-h-60 overflow-y-auto space-y-2" data-testid="search-results"></div> <!-- Selected tools --> <div id="selected-tools" class="flex flex-wrap gap-2 min-h-12" data-testid="selected-tools"></div> </div> </div> <!-- Loading State --> <div id="loading" class="hidden text-center py-12"> <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div> <p class="mt-4 text-gray-600 dark:text-gray-400">Loading comparison...</p> </div> <!-- Comparison Table --> <div id="comparison-container" class="hidden" data-testid="comparison-table"> <div class="overflow-x-auto"> <table class="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md"> <thead> <tr id="comparison-header" class="border-b border-gray-200 dark:border-gray-700"> <th class="p-4 text-left text-gray-900 dark:text-white font-bold sticky left-0 bg-white dark:bg-gray-800">Feature</th> </tr> </thead> <tbody id="comparison-body"> <!-- Comparison rows will be added here --> </tbody> </table> </div> </div> <!-- Empty State --> <div id="empty-state" class="text-center py-12"> <p class="text-xl text-gray-600 dark:text-gray-400 mb-4">
Search and select tools above to start comparing.
</p> <a href="/tools" class="inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
Browse All Tools →
</a> </div> </div> ` })} ${renderScript($$result, "/app/frontend/src/pages/tools/compare.astro?astro&type=script&index=0&lang.ts")}`;
}, "/app/frontend/src/pages/tools/compare.astro", void 0);

const $$file = "/app/frontend/src/pages/tools/compare.astro";
const $$url = "/tools/compare";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Compare,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

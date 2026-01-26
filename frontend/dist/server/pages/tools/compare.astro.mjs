import { c as createComponent, r as renderComponent, d as renderScript, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DU95tW1k.mjs';
import 'piccolore';
import { $ as $$PageLayout } from '../../chunks/PageLayout_B-LMywRD.mjs';
export { renderers } from '../../renderers.mjs';

const $$Compare = createComponent(async ($$result, $$props, $$slots) => {
  const metadata = {
    title: "Compare Tools - MarketMindAI",
    description: "Compare AI tools and business solutions side-by-side to make informed decisions."
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12"> <!-- Header --> <div class="text-center mb-12"> <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
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

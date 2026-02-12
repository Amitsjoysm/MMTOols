import { c as createComponent, r as renderComponent, a as renderTemplate, F as Fragment, m as maybeRenderHead } from '../chunks/astro/server_ngSGK97K.mjs';
import 'piccolore';
import { $ as $$PageLayout } from '../chunks/PageLayout_DHnoqYNQ.mjs';
import { $ as $$Hero } from '../chunks/Hero_UxlylRES.mjs';
export { renderers } from '../renderers.mjs';

const prerender = true;
const $$FreeTools = createComponent(async ($$result, $$props, $$slots) => {
  const metadata = {
    title: "Free AI Tools - MarketMindAI",
    description: "Discover our collection of free AI-powered tools to boost your productivity"
  };
  let freeTools = [];
  let errorMessage = "";
  const API_BASE_URL = "https://superadmin-boost-1.preview.emergentagent.com";
  try {
    const response = await fetch(`${API_BASE_URL}/api/free-tools`);
    if (response.ok) {
      freeTools = await response.json();
      console.log(`✅ SSR: Loaded ${freeTools.length} free tools`);
    }
  } catch (error) {
    console.error("Error fetching free tools:", error);
    errorMessage = "Failed to load free tools";
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate`  ${renderComponent($$result2, "Hero", $$Hero, {}, { "subtitle": async ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "subtitle" }, { "default": async ($$result4) => renderTemplate`
Explore our curated collection of free SEO and marketing tools designed to enhance your productivity and boost your online presence.
` })}`, "title": async ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "title" }, { "default": async ($$result4) => renderTemplate`
Free SEO & Marketing ${maybeRenderHead()}<span class="text-accent dark:text-white">Tools</span> ` })}` })}  <section class="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"> ${errorMessage ? renderTemplate`<div class="text-center py-12"> <p class="text-red-600 dark:text-red-400">${errorMessage}</p> </div>` : freeTools.length === 0 ? renderTemplate`<div class="text-center py-12"> <p class="text-gray-600 dark:text-gray-400">No free tools available at the moment. Check back soon!</p> </div>` : renderTemplate`<div> <div class="text-center mb-12"> <p class="text-lg text-gray-700 dark:text-gray-300">
Access ${freeTools.length} powerful free tools to optimize your website and content strategy
</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> ${freeTools.map((tool) => renderTemplate`<div class="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200 dark:border-gray-700" data-testid="free-tool-card"> <div class="flex items-start justify-between mb-4"> <h3 class="text-xl font-bold text-gray-900 dark:text-white">${tool.name}</h3> <span class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold rounded-full">
FREE
</span> </div> ${tool.description && renderTemplate`<p class="text-gray-600 dark:text-gray-300 mb-6">${tool.description}</p>`} <button disabled class="w-full flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed font-medium"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path> </svg>
Coming Soon
</button> </div>`)} </div> <!-- Info Banner --> <div class="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6"> <div class="flex items-start"> <svg class="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> <div> <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">Tools Under Development</h3> <p class="text-blue-800 dark:text-blue-300">
These powerful SEO and marketing tools are currently being developed and will be available soon. 
                Subscribe to our newsletter to be notified when they launch!
</p> </div> </div> </div> </div>`} </section> ` })}`;
}, "/app/frontend/src/pages/free-tools.astro", void 0);
const $$file = "/app/frontend/src/pages/free-tools.astro";
const $$url = "/free-tools";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$FreeTools,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

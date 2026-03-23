import { c as createComponent, r as renderComponent, d as renderScript, a as renderTemplate, F as Fragment, b as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_CZk8NOd-.mjs';
import 'piccolore';
import { $ as $$PageLayout } from '../chunks/PageLayout_W7EoUzsJ.mjs';
import { a as ssrToolsApi, b as ssrCategoriesApi } from '../chunks/ssr-api_ip_KgNt5.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const metadata = {
    title: "Browse 10,000+ AI Tools & Business Solutions 2026 | MarketMindAI",
    description: "Discover and compare 10,000+ AI tools and business solutions. Filter by category, pricing, ratings to find the best AI tools for your business in 2026.",
    keywords: "ai tools directory, best ai tools 2026, compare ai tools, ai software, business automation tools, productivity ai, marketing ai tools",
    robots: { index: true, follow: true },
    openGraph: {
      title: "Browse 10,000+ AI Tools & Business Solutions 2026",
      description: "Your comprehensive directory of 10,000+ AI tools. Compare features, pricing and ratings to find the perfect tool.",
      type: "website"
    }
  };
  let tools = [];
  let categories = [];
  let errorMessage = "";
  try {
    const [toolsData, categoriesData] = await Promise.all([
      ssrToolsApi.getAll({ limit: 100, sort: "recent" }),
      ssrCategoriesApi.getAll()
    ]);
    tools = toolsData;
    categories = categoriesData;
    console.log(`\u2705 SSR: Loaded ${tools.length} tools and ${categories.length} categories`);
  } catch (error) {
    console.error("\u274C Error fetching tools data:", error);
    errorMessage = "Failed to load tools data. Please try again later.";
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12"> <!-- Header --> <div class="text-center mb-12"> <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
Discover AI Tools & Solutions
</h1> <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
Browse through our comprehensive directory of ${tools.length}+ tools. Filter by category, pricing, and features to find exactly what you need.
</p> </div> ${errorMessage ? renderTemplate`<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center"> <p class="text-red-800 dark:text-red-200">${errorMessage}</p> </div>` : renderTemplate`<div id="tools-container"> <!-- Search and Filters --> <div class="mb-8 space-y-4"> <!-- Search Bar --> <div class="max-w-2xl mx-auto"> <input type="text" id="search-input" placeholder="Search tools..." class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"> </div> <!-- Filters Row --> <div class="flex flex-wrap gap-4 items-center justify-center"> <!-- Category Filter --> <select id="category-filter" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"> <option value="">All Categories</option> ${categories.map((cat) => renderTemplate`<option${addAttribute(cat.slug, "value")}>${cat.name}</option>`)} </select> <!-- Pricing Filter --> <select id="pricing-filter" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"> <option value="">All Pricing</option> <option value="free">Free</option> <option value="freemium">Freemium</option> <option value="paid">Paid</option> </select> <!-- Sort Filter --> <select id="sort-filter" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"> <option value="recent">Most Recent</option> <option value="trending">Trending</option> <option value="rating">Highest Rated</option> <option value="name">Name (A-Z)</option> </select> </div> </div> <!-- Tools Grid - Pre-rendered with all tools --> <div id="tools-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> ${tools.map((tool) => renderTemplate`<a${addAttribute(`/tools/${tool.slug}`, "href")} class="block group"${addAttribute(`tool-card-${tool.slug}`, "data-testid")}${addAttribute(JSON.stringify({ name: tool.name, category: tool.categories.map((c) => c.slug), pricing: tool.pricing_type }), "data-tool")}> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 h-full"> <!-- Tool Logo --> ${tool.logo_url && renderTemplate`<div class="mb-4"> <img${addAttribute(tool.logo_url, "src")}${addAttribute(`${tool.name} logo`, "alt")} class="h-16 w-16 object-contain" loading="lazy"> </div>`} <!-- Tool Name --> <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400"> ${tool.name} </h3> <!-- Tool Description --> <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2"> ${tool.short_description || tool.description.substring(0, 100) + "..."} </p> <!-- Tool Meta --> <div class="flex items-center justify-between text-sm"> <div class="flex items-center space-x-2"> <span class="text-yellow-500">★</span> <span class="text-gray-900 dark:text-white font-medium">${tool.rating.toFixed(1)}</span> <span class="text-gray-500 dark:text-gray-400">(${tool.review_count})</span> </div> <span${addAttribute(`px-3 py-1 rounded-full text-xs font-medium ${tool.pricing_type === "free" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : tool.pricing_type === "freemium" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"}`, "class")}> ${tool.pricing_type.charAt(0).toUpperCase() + tool.pricing_type.slice(1)} </span> </div> <!-- Categories --> ${tool.categories && tool.categories.length > 0 && renderTemplate`<div class="mt-4 flex flex-wrap gap-2"> ${tool.categories.slice(0, 3).map((cat) => renderTemplate`<span class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"> ${cat.name} </span>`)} </div>`} </div> </a>`)} </div> <!-- No Results (initially hidden, shown by JS filter) --> <div id="no-results" class="hidden text-center py-12"> <p class="text-xl text-gray-600 dark:text-gray-400">No tools found matching your criteria.</p> </div> </div>`} </div> `, "head": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": async ($$result3) => renderTemplate(_a || (_a = __template([' <meta name="keywords"', '> <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large"> <script type="application/ld+json">{JSON.stringify({\n      "@context": "https://schema.org",\n      "@type": "CollectionPage",\n      "name": "AI Tools Directory - MarketMindAI",\n      "description": metadata.description,\n      "url": "https://marketmindai.com/tools",\n      "publisher": { "@type": "Organization", "name": "MarketMindAI", "url": "https://marketmindai.com" },\n      "inLanguage": "en-US"\n    })}<\/script> '])), addAttribute(metadata.keywords, "content")) })}` })} <!-- Client-side filtering (progressive enhancement) --> ${renderScript($$result, "/app/frontend/src/pages/tools/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/app/frontend/src/pages/tools/index.astro", void 0);

const $$file = "/app/frontend/src/pages/tools/index.astro";
const $$url = "/tools";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

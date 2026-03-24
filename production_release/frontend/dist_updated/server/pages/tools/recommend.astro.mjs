import { c as createComponent, r as renderComponent, d as renderScript, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CZk8NOd-.mjs';
import 'piccolore';
import { $ as $$PageLayout } from '../../chunks/PageLayout_DDxlY7So.mjs';
export { renderers } from '../../renderers.mjs';

const $$Recommend = createComponent(async ($$result, $$props, $$slots) => {
  const metadata = {
    title: "AI Tool Recommender | MarketMindAI",
    description: "Get personalized AI tool recommendations based on your specific needs. Our AI analyzes thousands of tools to find the perfect match for you.",
    robots: { index: true, follow: true }
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-4xl mx-auto px-4 py-12"> <!-- Auth Gate Overlay --> <div id="auth-gate-overlay" class="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center"> <div id="auth-loading" class="text-center"> <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div> <p class="mt-4 text-gray-600 dark:text-gray-400">Checking authentication...</p> </div> <div id="auth-gate-content" class="hidden text-center p-8 max-w-md"> <div class="text-6xl mb-4">🔐</div> <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Login Required</h2> <p class="text-gray-600 dark:text-gray-400 mb-6">
Please login to access the AI Tool Recommender feature.
</p> <a href="/login?redirect=/tools/recommend" class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
Login to Continue
</a> </div> </div> <!-- Header --> <div class="text-center mb-8"> <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
🤖 AI Tool Recommender
</h1> <p class="text-xl text-gray-600 dark:text-gray-400">
Tell us what you need, and our AI will find the perfect tools for you.
</p> </div> <!-- Recommendation Form --> <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"> <form id="recommend-form" class="space-y-6"> <!-- User Needs --> <div> <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
What do you need help with? *
</label> <textarea id="user-needs" rows="3" class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="E.g., I need a tool to help me write marketing copy for my startup. It should be easy to use and have templates for social media posts." required></textarea> </div> <!-- Category Filter --> <div> <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Category (optional)
</label> <select id="category-filter" class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"> <option value="">All Categories</option> <option value="writing">Writing & Content</option> <option value="marketing">Marketing</option> <option value="design">Design</option> <option value="development">Development</option> <option value="analytics">Analytics</option> <option value="productivity">Productivity</option> <option value="sales">Sales</option> <option value="customer support">Customer Support</option> </select> </div> <!-- Budget Filter --> <div> <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Budget Preference
</label> <div class="flex flex-wrap gap-3"> <label class="inline-flex items-center"> <input type="radio" name="budget" value="any" checked class="text-blue-600 focus:ring-blue-500"> <span class="ml-2 text-gray-700 dark:text-gray-300">Any</span> </label> <label class="inline-flex items-center"> <input type="radio" name="budget" value="free" class="text-blue-600 focus:ring-blue-500"> <span class="ml-2 text-gray-700 dark:text-gray-300">Free Only</span> </label> <label class="inline-flex items-center"> <input type="radio" name="budget" value="freemium" class="text-blue-600 focus:ring-blue-500"> <span class="ml-2 text-gray-700 dark:text-gray-300">Free + Freemium</span> </label> <label class="inline-flex items-center"> <input type="radio" name="budget" value="paid" class="text-blue-600 focus:ring-blue-500"> <span class="ml-2 text-gray-700 dark:text-gray-300">Paid (Premium)</span> </label> </div> </div> <!-- Features Needed --> <div> <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Must-have Features (optional)
</label> <input type="text" id="features-needed" class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="E.g., API access, team collaboration, mobile app"> <p class="mt-1 text-xs text-gray-500">Separate multiple features with commas</p> </div> <!-- Submit Button --> <button type="submit" id="recommend-btn" class="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-semibold text-lg flex items-center justify-center gap-2"> <span>🔍</span> Find My Perfect Tools
</button> </form> </div> <!-- Loading State --> <div id="loading-results" class="hidden text-center py-12"> <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div> <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">Our AI is analyzing thousands of tools...</p> <p class="text-sm text-gray-500">This may take a few seconds</p> </div> <!-- Results Section --> <div id="results-section" class="hidden space-y-6"> <!-- AI Analysis --> <div id="ai-analysis" class="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6"> <div class="flex items-center gap-2 mb-4"> <span class="text-2xl">🤖</span> <h3 class="text-xl font-bold text-gray-900 dark:text-white">AI Analysis</h3> </div> <p id="ai-analysis-text" class="text-gray-700 dark:text-gray-300"></p> </div> <!-- Recommended Tools --> <div> <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
Recommended Tools
</h3> <div id="tools-list" class="space-y-4"> <!-- Tool cards will be inserted here --> </div> </div> </div> <!-- Error State --> <div id="error-state" class="hidden bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center"> <div class="text-4xl mb-4">⚠️</div> <h3 class="text-xl font-bold text-red-800 dark:text-red-200 mb-2">Something went wrong</h3> <p id="error-message" class="text-red-700 dark:text-red-300"></p> <button onclick="document.getElementById('error-state').classList.add('hidden')" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
Try Again
</button> </div> </div> ` })} ${renderScript($$result, "/app/frontend/src/pages/tools/recommend.astro?astro&type=script&index=0&lang.ts")}`;
}, "/app/frontend/src/pages/tools/recommend.astro", void 0);

const $$file = "/app/frontend/src/pages/tools/recommend.astro";
const $$url = "/tools/recommend";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Recommend,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

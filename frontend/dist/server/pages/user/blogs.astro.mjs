import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as renderScript } from '../../chunks/astro/server_ngSGK97K.mjs';
import 'piccolore';
import { $ as $$PageLayout } from '../../chunks/PageLayout_DHnoqYNQ.mjs';
export { renderers } from '../../renderers.mjs';

const $$Blogs = createComponent(async ($$result, $$props, $$slots) => {
  const metadata = {
    title: "My Blogs - MarketMindAI",
    description: "Manage your blog articles"
  };
  return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-12 max-w-7xl"> <!-- Header --> <div class="flex justify-between items-center mb-8"> <div> <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2" data-testid="page-title">
My Blogs
</h1> <p class="text-gray-600 dark:text-gray-400">
Create and manage your blog articles with automatic SEO optimization
</p> </div> <a href="/user/blogs/create" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg" data-testid="create-blog-btn"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path> </svg>
Create New Blog
</a> </div> <!-- Filter Tabs --> <div class="mb-6 border-b border-gray-200 dark:border-gray-700"> <ul class="flex flex-wrap -mb-px text-sm font-medium text-center"> <li class="mr-2"> <button data-filter="all" class="filter-tab inline-block p-4 border-b-2 border-blue-600 text-blue-600 rounded-t-lg active">
All <span id="all-count" class="ml-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">0</span> </button> </li> <li class="mr-2"> <button data-filter="draft" class="filter-tab inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300">
Drafts <span id="draft-count" class="ml-1 bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">0</span> </button> </li> <li class="mr-2"> <button data-filter="published" class="filter-tab inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300">
Published <span id="published-count" class="ml-1 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">0</span> </button> </li> </ul> </div> <!-- Loading State --> <div id="loading" class="flex justify-center items-center py-12"> <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div> </div> <!-- Error State --> <div id="error" class="hidden bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6"> <p class="text-red-800 dark:text-red-200" id="error-message"></p> </div> <!-- Blogs Grid --> <div id="blogs-container" class="hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> <!-- Blogs will be dynamically inserted here --> </div> <!-- Empty State --> <div id="empty-state" class="hidden text-center py-12"> <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path> </svg> <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No blogs yet</h3> <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
Get started by creating your first blog article with automatic SEO optimization.
</p> <a href="/user/blogs/create" class="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
Create Your First Blog
</a> </div> </div> ${renderScript($$result2, "/app/frontend/src/pages/user/blogs.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/app/frontend/src/pages/user/blogs.astro", void 0);

const $$file = "/app/frontend/src/pages/user/blogs.astro";
const $$url = "/user/blogs";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Blogs,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

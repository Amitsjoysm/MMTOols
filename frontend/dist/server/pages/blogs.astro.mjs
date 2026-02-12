import { c as createComponent, r as renderComponent, d as renderScript, a as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_ngSGK97K.mjs';
import 'piccolore';
import { $ as $$PageLayout } from '../chunks/PageLayout_DHnoqYNQ.mjs';
import { s as ssrBlogsApi } from '../chunks/ssr-api_CezTdN0q.mjs';
export { renderers } from '../renderers.mjs';

const prerender = true;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const metadata = {
    title: "Blog - MarketMindAI | Latest AI Tools & Productivity Insights",
    description: "Read the latest insights, tips, and news about AI tools, productivity, and business solutions. Expert reviews and guides for modern businesses.",
    keywords: "ai blog, productivity tips, business insights, tool reviews, ai news"
  };
  let blogs = [];
  let errorMessage = "";
  try {
    blogs = await ssrBlogsApi.getAll({ limit: 100, status: "published", sort: "newest" });
    console.log(`\u2705 SSR: Loaded ${blogs.length} published blogs`);
  } catch (error) {
    console.error("\u274C Error fetching blogs:", error);
    errorMessage = "Failed to load blogs. Please try again later.";
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12"> <!-- Header --> <div class="text-center mb-12"> <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
Latest from Our Blog
</h1> <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
Insights, tips, and best practices about AI tools, productivity, and business growth. ${blogs.length} articles and counting!
</p> </div> ${errorMessage ? renderTemplate`<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center"> <p class="text-red-800 dark:text-red-200">${errorMessage}</p> </div>` : renderTemplate`<div> <!-- Filters --> <div class="mb-8 flex flex-wrap gap-4 items-center justify-center"> <!-- Search --> <input type="text" id="search-input" placeholder="Search blogs..." class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 min-w-[300px]"> <!-- Sort Filter --> <select id="sort-filter" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"> <option value="newest">Newest First</option> <option value="oldest">Oldest First</option> <option value="most_viewed">Most Viewed</option> </select> <!-- AI Generated Filter --> <select id="ai-filter" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"> <option value="">All Blogs</option> <option value="false">Human Written</option> <option value="true">AI Generated</option> </select> </div> <!-- Blogs Grid (Pre-rendered with all blogs) --> <div id="blogs-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> ${blogs.map((blog) => renderTemplate`<a${addAttribute(`/blogs/${blog.slug}`, "href")} class="block group"${addAttribute(`blog-card-${blog.slug}`, "data-testid")}${addAttribute(JSON.stringify({
    title: blog.title.toLowerCase(),
    isAi: blog.is_ai_generated,
    views: blog.view_count,
    date: blog.published_at
  }), "data-blog")}> <article class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden h-full flex flex-col"> <!-- Featured Image --> ${blog.featured_image ? renderTemplate`<div class="aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden"> <img${addAttribute(blog.featured_image, "src")}${addAttribute(blog.title, "alt")} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"> </div>` : renderTemplate`<div class="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"> <span class="text-white text-4xl">📝</span> </div>`} <div class="p-6 flex-1 flex flex-col"> <!-- Tags --> ${blog.tags && blog.tags.length > 0 && renderTemplate`<div class="flex flex-wrap gap-2 mb-3"> ${blog.tags.slice(0, 3).map((tag) => renderTemplate`<span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"> ${tag} </span>`)} </div>`} <!-- Title --> <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2"> ${blog.title} </h2> <!-- Excerpt --> <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-1"> ${blog.excerpt || blog.content.substring(0, 150) + "..."} </p> <!-- Meta Info --> <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700"> <div class="flex items-center space-x-4"> <span class="flex items-center"> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path> </svg> ${blog.view_count} </span> <span class="flex items-center"> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> ${blog.reading_time} min
</span> </div> ${blog.is_ai_generated && renderTemplate`<span class="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs font-medium">
AI
</span>`} </div> </div> </article> </a>`)} </div> <!-- No Results (initially hidden, shown by JS filter) --> <div id="no-results" class="hidden text-center py-12"> <p class="text-xl text-gray-600 dark:text-gray-400">No blogs found matching your criteria.</p> </div> </div>`} </div> ` })} <!-- Client-side filtering (progressive enhancement) --> ${renderScript($$result, "/app/frontend/src/pages/blogs/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/app/frontend/src/pages/blogs/index.astro", void 0);

const $$file = "/app/frontend/src/pages/blogs/index.astro";
const $$url = "/blogs";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

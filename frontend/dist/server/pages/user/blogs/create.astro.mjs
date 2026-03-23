import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as renderScript } from '../../../chunks/astro/server_CZk8NOd-.mjs';
import 'piccolore';
import { $ as $$PageLayout } from '../../../chunks/PageLayout_W7EoUzsJ.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Create = createComponent(async ($$result, $$props, $$slots) => {
  const metadata = {
    title: "Create Blog - MarketMindAI",
    description: "Create a new blog article with automatic SEO optimization"
  };
  return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-12 max-w-5xl"> <!-- Header --> <div class="mb-8"> <a href="/user/blogs" class="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path> </svg>
Back to My Blogs
</a> <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
Create New Blog
</h1> <p class="text-gray-600 dark:text-gray-400">
Write your blog with automatic SEO optimization and JSON-LD schema generation
</p> </div> <!-- Success Message --> <div id="success-message" class="hidden mb-6 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4"> <div class="flex items-start"> <svg class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg> <div> <p class="text-green-800 dark:text-green-200 font-medium" id="success-text"></p> </div> </div> </div> <!-- Error Message --> <div id="error-message" class="hidden mb-6 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4"> <p class="text-red-800 dark:text-red-200" id="error-text"></p> </div> <!-- Blog Form --> <form id="blog-form" class="space-y-6"> <!-- Basic Information --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"> <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2> <!-- Title --> <div class="mb-4"> <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Blog Title *
</label> <input type="text" id="title" name="title" required maxlength="200" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="Enter your blog title..."> <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">This will also be used as SEO title if not specified</p> </div> <!-- Excerpt --> <div class="mb-4"> <label for="excerpt" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Excerpt / Summary
</label> <textarea id="excerpt" name="excerpt" rows="3" maxlength="300" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="Brief summary of your blog (will be used as SEO description)..."></textarea> <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Recommended: 150-160 characters for SEO</p> </div> <!-- Content --> <div class="mb-4"> <label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Content *
</label> <textarea id="content" name="content" rows="15" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm" placeholder="Write your blog content here... (Markdown supported)"></textarea> <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">You can use Markdown formatting</p> </div> <!-- Featured Image URL --> <div class="mb-4"> <label for="featured_image" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Featured Image URL
</label> <input type="url" id="featured_image" name="featured_image" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="https://example.com/image.jpg"> </div> <!-- Tags --> <div class="mb-4"> <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Tags
</label> <input type="text" id="tags" name="tags" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="AI, Marketing, Productivity (comma separated)"> <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Separate tags with commas</p> </div> </div> <!-- SEO Settings (Optional) --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"> <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">SEO Settings (Optional)</h2> <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
Leave empty for automatic generation. JSON-LD schema will be auto-generated on publish.
</p> <!-- SEO Title --> <div class="mb-4"> <label for="seo_title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
SEO Title
</label> <input type="text" id="seo_title" name="seo_title" maxlength="60" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="Custom SEO title (leave empty for auto-generation)"> <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Recommended: 50-60 characters</p> </div> <!-- SEO Description --> <div class="mb-4"> <label for="seo_description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
SEO Meta Description
</label> <textarea id="seo_description" name="seo_description" rows="2" maxlength="160" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="Custom SEO description (leave empty for auto-generation)"></textarea> <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Recommended: 150-160 characters</p> </div> <!-- SEO Keywords --> <div class="mb-4"> <label for="seo_keywords" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
SEO Keywords
</label> <input type="text" id="seo_keywords" name="seo_keywords" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="keyword1, keyword2, keyword3"> </div> </div> <!-- Actions --> <div class="flex gap-4"> <button type="button" id="save-draft-btn" class="flex-1 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition">
Save as Draft
</button> <button type="button" id="publish-btn" class="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
Save & Publish (Auto SEO + JSON-LD)
</button> </div> </form> </div> ${renderScript($$result2, "/app/frontend/src/pages/user/blogs/create.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/app/frontend/src/pages/user/blogs/create.astro", void 0);

const $$file = "/app/frontend/src/pages/user/blogs/create.astro";
const $$url = "/user/blogs/create";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Create,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

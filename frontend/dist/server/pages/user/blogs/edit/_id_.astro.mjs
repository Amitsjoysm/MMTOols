import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as renderScript } from '../../../../chunks/astro/server_CZk8NOd-.mjs';
import 'piccolore';
import { $ as $$PageLayout } from '../../../../chunks/PageLayout_W7EoUzsJ.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const metadata = {
    title: "Edit Blog - MarketMindAI",
    description: "Edit your blog article"
  };
  return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-12 max-w-5xl"> <!-- Header --> <div class="mb-8"> <a href="/user/blogs" class="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path> </svg>
Back to My Blogs
</a> <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
Edit Blog
</h1> <p class="text-gray-600 dark:text-gray-400">
Update your blog with automatic SEO optimization
</p> </div> <!-- Loading State --> <div id="page-loading" class="flex justify-center items-center py-12"> <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div> <p class="ml-4 text-gray-600 dark:text-gray-400">Loading blog...</p> </div> <!-- Form Container (hidden initially) --> <div id="form-container" class="hidden space-y-6"> <!-- Success/Error Messages --> <div id="success-message" class="hidden bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4"> <p class="text-green-800 dark:text-green-200 font-medium" id="success-text"></p> </div> <div id="error-message" class="hidden bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4"> <p class="text-red-800 dark:text-red-200" id="error-text"></p> </div> <!-- Blog Form (same as create) --> <form id="blog-form" class="space-y-6"> <input type="hidden" id="blog-id"> <!-- Basic Information --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"> <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2> <div class="mb-4"> <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Blog Title *
</label> <input type="text" id="title" required maxlength="200" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"> </div> <div class="mb-4"> <label for="excerpt" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Excerpt / Summary
</label> <textarea id="excerpt" rows="3" maxlength="300" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"></textarea> </div> <div class="mb-4"> <label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Content *
</label> <textarea id="content" rows="15" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"></textarea> </div> <div class="mb-4"> <label for="featured_image" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Featured Image URL
</label> <input type="url" id="featured_image" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"> </div> <div class="mb-4"> <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Tags
</label> <input type="text" id="tags" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"> </div> </div> <!-- SEO Settings --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"> <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">SEO Settings</h2> <div class="mb-4"> <label for="seo_title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
SEO Title
</label> <input type="text" id="seo_title" maxlength="60" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"> </div> <div class="mb-4"> <label for="seo_description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
SEO Meta Description
</label> <textarea id="seo_description" rows="2" maxlength="160" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"></textarea> </div> <div class="mb-4"> <label for="seo_keywords" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
SEO Keywords
</label> <input type="text" id="seo_keywords" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"> </div> </div> <!-- Actions --> <div class="flex gap-4"> <button type="button" id="update-btn" class="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
Update Blog
</button> <button type="button" id="publish-btn" class="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
Update & Publish
</button> </div> </form> </div> </div> ${renderScript($$result2, "/app/frontend/src/pages/user/blogs/edit/[id].astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/app/frontend/src/pages/user/blogs/edit/[id].astro", void 0);

const $$file = "/app/frontend/src/pages/user/blogs/edit/[id].astro";
const $$url = "/user/blogs/edit/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
